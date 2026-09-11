
import { NextResponse } from "next/server";
import { requireAuthenticatedPage } from "@/lib/auth/guards";

type MarketCategory =
  | "Crypto"
  | "Stocks"
  | "ETFs"
  | "Forex"
  | "Bonds"
  | "Precious Metals"
  | "Commodities";

type MarketItem = {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change: number | null;
  source: string;
};

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        shortName?: string;
        longName?: string;
        quoteType?: string;
        regularMarketPrice?: number;
        previousClose?: number;
        chartPreviousClose?: number;
      };
    }>;
    error?: unknown;
  };
};

type YahooScreenerQuote = {
  symbol?: string;
  shortName?: string;
  longName?: string;
  quoteType?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  previousClose?: number;
  regularMarketPreviousClose?: number;
};

type YahooScreenerResponse = {
  finance?: {
    result?: Array<{
      quotes?: YahooScreenerQuote[];
      total?: number;
    }>;
    error?: unknown;
  };
};

type CoinGeckoItem = {
  id?: string;
  symbol?: string;
  name?: string;
  current_price?: number | null;
  price_change_percentage_24h?: number | null;
};

type FrankfurterResponse = {
  base?: string;
  date?: string;
  rate?: number;
};

async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (compatible; NAXODEX-MarketWatchlist/1.0)",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(
      `Market data request failed: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

function calculateChange(
  current: number,
  previous: number
): number | null {
  if (
    !Number.isFinite(current) ||
    !Number.isFinite(previous) ||
    previous === 0
  ) {
    return null;
  }

  return Number(
    (((current - previous) / previous) * 100).toFixed(2)
  );
}

function roundPrice(price: number): number {
  if (!Number.isFinite(price)) {
    return 0;
  }

  if (price >= 1000) {
    return Number(price.toFixed(2));
  }

  if (price >= 1) {
    return Number(price.toFixed(4));
  }

  return Number(price.toFixed(8));
}

/*
|--------------------------------------------------------------------------
| COINGECKO
|--------------------------------------------------------------------------
*/

async function loadCryptoMarkets(): Promise<MarketItem[]> {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd" +
      "&order=market_cap_desc" +
      "&per_page=100" +
      "&page=1" +
      "&sparkline=false" +
      "&price_change_percentage=24h";

    const data =
      await fetchJson<CoinGeckoItem[]>(url);

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item): MarketItem | null => {
        const id = String(item.id || "");

        const symbol = String(
          item.symbol || ""
        ).toUpperCase();

        const name = String(
          item.name || id
        );

        const price = Number(
          item.current_price
        );

        const change = Number(
          item.price_change_percentage_24h
        );

        if (
          !id ||
          !symbol ||
          !name ||
          !Number.isFinite(price) ||
          price <= 0
        ) {
          return null;
        }

        return {
          symbol: `${symbol}/USD`,
          name,
          category: "Crypto",
          price: roundPrice(price),
          change: Number.isFinite(change)
            ? Number(change.toFixed(2))
            : null,
          source: "CoinGecko",
        };
      })
      .filter(
        (item): item is MarketItem =>
          item !== null
      );
  } catch (error) {
    console.error(
      "CoinGecko market discovery error:",
      error
    );

    return [];
  }
}

/*
|--------------------------------------------------------------------------
| YAHOO FINANCE DYNAMIC SCREENER
|--------------------------------------------------------------------------
*/

async function loadYahooScreener(
  screen: string
): Promise<YahooScreenerQuote[]> {
  try {
    const url =
      "https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved" +
      `?count=250&scrIds=${encodeURIComponent(
        screen
      )}` +
      "&formatted=false" +
      "&lang=en-US" +
      "&region=US";

    const data =
      await fetchJson<YahooScreenerResponse>(
        url
      );

    const result =
      data?.finance?.result?.[0];

    if (!result?.quotes) {
      return [];
    }

    return result.quotes;
  } catch (error) {
    console.error(
      `Yahoo screener error (${screen}):`,
      error
    );

    return [];
  }
}

async function loadDynamicYahooMarkets(): Promise<
  MarketItem[]
> {
  const screens = [
    "most_actives",
    "day_gainers",
    "day_losers",
  ];

  const results =
    await Promise.all(
      screens.map((screen) =>
        loadYahooScreener(screen)
      )
    );

  const discovered =
    results.flat();

  /*
   * Remove duplicate Yahoo symbols.
   */
  const uniqueQuotes =
    Array.from(
      new Map(
        discovered
          .filter(
            (quote) =>
              Boolean(quote.symbol)
          )
          .map((quote) => [
            String(
              quote.symbol
            ).toUpperCase(),
            quote,
          ])
      ).values()
    );

  const markets: MarketItem[] = [];

  for (const quote of uniqueQuotes) {
    const symbol = String(
      quote.symbol || ""
    ).toUpperCase();

    if (!symbol) {
      continue;
    }

    const quoteType = String(
      quote.quoteType || ""
    ).toUpperCase();

    const price = Number(
      quote.regularMarketPrice
    );

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      continue;
    }

    const previousClose = Number(
      quote.previousClose ??
        quote.regularMarketPreviousClose
    );

    let change = Number(
      quote.regularMarketChangePercent
    );

    if (!Number.isFinite(change)) {
      change = Number.NaN;
    }

    if (
      !Number.isFinite(change) &&
      Number.isFinite(previousClose)
    ) {
      change =
        calculateChange(
          price,
          previousClose
        ) ?? Number.NaN;
    }

    /*
     * ETFs
     */
    if (quoteType === "ETF") {
      markets.push({
        symbol,
        name: String(
          quote.longName ||
            quote.shortName ||
            symbol
        ),
        category: "ETFs",
        price: roundPrice(price),
        change: Number.isFinite(change)
          ? Number(change.toFixed(2))
          : null,
        source: "Yahoo Finance",
      });

      continue;
    }

    /*
     * Stocks
     */
    if (quoteType === "EQUITY") {
      markets.push({
        symbol,
        name: String(
          quote.longName ||
            quote.shortName ||
            symbol
        ),
        category: "Stocks",
        price: roundPrice(price),
        change: Number.isFinite(change)
          ? Number(change.toFixed(2))
          : null,
        source: "Yahoo Finance",
      });
    }
  }

  return markets;
}

/*
|--------------------------------------------------------------------------
| YAHOO SPECIALIST MARKETS
|--------------------------------------------------------------------------
*/

const specialistMarkets = [
  {
    symbol: "^TNX",
    name: "10-Year Treasury Yield",
    category: "Bonds" as const,
  },
  {
    symbol: "^FVX",
    name: "5-Year Treasury Yield",
    category: "Bonds" as const,
  },
  {
    symbol: "^IRX",
    name: "13-Week Treasury Bill Yield",
    category: "Bonds" as const,
  },
  {
    symbol: "^TYX",
    name: "30-Year Treasury Yield",
    category: "Bonds" as const,
  },
  {
    symbol: "IEF",
    name: "iShares 7-10 Year Treasury Bond ETF",
    category: "Bonds" as const,
  },
  {
    symbol: "TLT",
    name: "iShares 20+ Year Treasury Bond ETF",
    category: "Bonds" as const,
  },
  {
    symbol: "SHY",
    name: "iShares 1-3 Year Treasury Bond ETF",
    category: "Bonds" as const,
  },
  {
    symbol: "VGIT",
    name: "Vanguard Intermediate Treasury ETF",
    category: "Bonds" as const,
  },
  {
    symbol: "GOVT",
    name: "iShares U.S. Treasury Bond ETF",
    category: "Bonds" as const,
  },
  {
    symbol: "GC=F",
    name: "Gold Futures",
    category: "Precious Metals" as const,
  },
  {
    symbol: "SI=F",
    name: "Silver Futures",
    category: "Precious Metals" as const,
  },
  {
    symbol: "PL=F",
    name: "Platinum Futures",
    category: "Precious Metals" as const,
  },
  {
    symbol: "PA=F",
    name: "Palladium Futures",
    category: "Precious Metals" as const,
  },
  {
    symbol: "HG=F",
    name: "Copper Futures",
    category: "Precious Metals" as const,
  },
  {
    symbol: "CL=F",
    name: "WTI Crude Oil Futures",
    category: "Commodities" as const,
  },
  {
    symbol: "BZ=F",
    name: "Brent Crude Oil Futures",
    category: "Commodities" as const,
  },
  {
    symbol: "NG=F",
    name: "Natural Gas Futures",
    category: "Commodities" as const,
  },
];

async function fetchYahooSpecialistMarket(
  item: (typeof specialistMarkets)[number]
): Promise<MarketItem | null> {
  try {
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
      `${encodeURIComponent(item.symbol)}` +
      "?range=2d&interval=1d";

    const data =
      await fetchJson<YahooChartResponse>(
        url
      );

    const result =
      data?.chart?.result?.[0];

    if (!result) {
      return null;
    }

    const meta = result.meta;

    const price = Number(
      meta?.regularMarketPrice
    );

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return null;
    }

    const previousClose = Number(
      meta?.previousClose ??
        meta?.chartPreviousClose
    );

    const change =
      calculateChange(
        price,
        previousClose
      );

    return {
      symbol: item.symbol,
      name: item.name,
      category: item.category,
      price: roundPrice(price),
      change,
      source: "Yahoo Finance",
    };
  } catch (error) {
    console.error(
      `Yahoo specialist market error for ${item.symbol}:`,
      error
    );

    return null;
  }
}

async function loadSpecialistMarkets(): Promise<
  MarketItem[]
> {
  const results =
    await Promise.allSettled(
      specialistMarkets.map(
        (item) =>
          fetchYahooSpecialistMarket(
            item
          )
      )
    );

  /*
   * Only keep fulfilled promises.
   *
   * We intentionally do not use a PromiseFulfilledResult
   * type predicate here. This avoids the TypeScript
   * inference conflict that caused the production build
   * failure.
   */
  return results
    .filter(
      (result) =>
        result.status === "fulfilled"
    )
    .map(
      (result) => result.value
    )
    .filter(
      (item): item is MarketItem =>
        item !== null
    );
}

/*
|--------------------------------------------------------------------------
| FOREX
|--------------------------------------------------------------------------
*/

const forexPairs = [
  ["EUR", "USD", "Euro / US Dollar"],
  ["GBP", "USD", "British Pound / US Dollar"],
  ["USD", "JPY", "US Dollar / Japanese Yen"],
  ["USD", "CHF", "US Dollar / Swiss Franc"],
  ["AUD", "USD", "Australian Dollar / US Dollar"],
  ["USD", "CAD", "US Dollar / Canadian Dollar"],
  ["NZD", "USD", "New Zealand Dollar / US Dollar"],
  ["EUR", "GBP", "Euro / British Pound"],
  ["EUR", "JPY", "Euro / Japanese Yen"],
  ["GBP", "JPY", "British Pound / Japanese Yen"],
  ["EUR", "CHF", "Euro / Swiss Franc"],
  ["AUD", "JPY", "Australian Dollar / Japanese Yen"],
  ["USD", "SEK", "US Dollar / Swedish Krona"],
  ["USD", "NOK", "US Dollar / Norwegian Krone"],
  ["USD", "SGD", "US Dollar / Singapore Dollar"],
  ["USD", "HKD", "US Dollar / Hong Kong Dollar"],
] as const;

async function loadForexMarkets(): Promise<
  MarketItem[]
> {
  const results =
    await Promise.allSettled(
      forexPairs.map(
        async ([base, quote, name]): Promise<
          MarketItem | null
        > => {
          try {
            const url =
              `https://api.frankfurter.dev/v2/rate/${base}/${quote}`;

            const data =
              await fetchJson<FrankfurterResponse>(
                url
              );

            const rate = Number(
              data.rate
            );

            if (
              !Number.isFinite(rate) ||
              rate <= 0
            ) {
              return null;
            }

            return {
              symbol: `${base}/${quote}`,
              name: String(name),
              category: "Forex",
              price: roundPrice(rate),
              change: null,
              source: "Frankfurter",
            };
          } catch (error) {
            console.error(
              `Forex market error for ${base}/${quote}:`,
              error
            );

            return null;
          }
        }
      )
    );

  /*
   * Only keep fulfilled promises.
   *
   * No explicit PromiseFulfilledResult predicate is
   * required because the filter narrows the result
   * automatically.
   */
  return results
    .filter(
      (result) =>
        result.status === "fulfilled"
    )
    .map(
      (result) => result.value
    )
    .filter(
      (item): item is MarketItem =>
        item !== null
    );
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    await requireAuthenticatedPage();

    /*
     * Load all asset classes concurrently.
     */
    const [
      cryptoMarkets,
      yahooMarkets,
      specialistMarketsData,
      forexMarkets,
    ] = await Promise.all([
      loadCryptoMarkets(),
      loadDynamicYahooMarkets(),
      loadSpecialistMarkets(),
      loadForexMarkets(),
    ]);

    const markets: MarketItem[] = [
      ...cryptoMarkets,
      ...yahooMarkets,
      ...specialistMarketsData,
      ...forexMarkets,
    ];

    /*
     * Remove duplicate category/symbol combinations.
     */
    const uniqueMarkets =
      Array.from(
        new Map(
          markets.map((market) => [
            `${market.category}:${market.symbol}`,
            market,
          ])
        ).values()
      );

    /*
     * Keep the UI in a predictable category order.
     */
    const categoryOrder: MarketCategory[] = [
      "Crypto",
      "Stocks",
      "ETFs",
      "Forex",
      "Bonds",
      "Precious Metals",
      "Commodities",
    ];

    uniqueMarkets.sort(
      (a, b) => {
        const categoryDifference =
          categoryOrder.indexOf(
            a.category
          ) -
          categoryOrder.indexOf(
            b.category
          );

        if (
          categoryDifference !== 0
        ) {
          return categoryDifference;
        }

        return a.symbol.localeCompare(
          b.symbol
        );
      }
    );

    /*
     * Calculate real dataset statistics.
     */
    const risingMarkets =
      uniqueMarkets.filter(
        (market) =>
          market.change !== null &&
          market.change > 0
      ).length;

    const fallingMarkets =
      uniqueMarkets.filter(
        (market) =>
          market.change !== null &&
          market.change < 0
      ).length;

    const categoryCounts =
      categoryOrder.reduce(
        (
          accumulator,
          currentCategory
        ) => {
          accumulator[
            currentCategory
          ] =
            uniqueMarkets.filter(
              (market) =>
                market.category ===
                currentCategory
            ).length;

          return accumulator;
        },
        {} as Record<
          MarketCategory,
          number
        >
      );

    return NextResponse.json({
      success: true,

      updatedAt:
        new Date().toISOString(),

      count:
        uniqueMarkets.length,

      risingMarkets,

      fallingMarkets,

      categoryCounts,

      markets:
        uniqueMarkets,
    });
  } catch (error) {
    console.error(
      "Market watchlist API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to load market data.",

        count: 0,

        risingMarkets: 0,

        fallingMarkets: 0,

        categoryCounts: {
          Crypto: 0,
          Stocks: 0,
          ETFs: 0,
          Forex: 0,
          Bonds: 0,
          "Precious Metals": 0,
          Commodities: 0,
        },

        markets: [],
      },
      {
        status: 500,
      }
    );
  }
}