import { NextResponse } from "next/server";

type MarketCategory =
  | "Crypto"
  | "Stocks"
  | "Forex"
  | "Bonds";

type MarketItem = {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change: number | null;
  source: string;
};

type CoinGeckoItem = {
  symbol?: string;
  name?: string;
  current_price?: number | null;
  price_change_percentage_24h?: number | null;
};

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        shortName?: string;
        longName?: string;
        regularMarketPrice?: number;
        previousClose?: number;
        chartPreviousClose?: number;
      };
    }>;
    error?: unknown;
  };
};

type FrankfurterResponse = {
  base?: string;
  date?: string;
  rate?: number;
};

async function fetchJson<T>(
  url: string,
): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (compatible; EDGE-PORTFOLIO-MarketTicker/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Market data request failed: ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

function calculateChange(
  current: number,
  previous: number,
): number | null {
  if (
    !Number.isFinite(current) ||
    !Number.isFinite(previous) ||
    previous === 0
  ) {
    return null;
  }

  return Number(
    (((current - previous) / previous) * 100).toFixed(2),
  );
}

function roundPrice(
  price: number,
): number {
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
| CRYPTO
|--------------------------------------------------------------------------
*/

async function loadCryptoMarkets(): Promise<
  MarketItem[]
> {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd" +
      "&ids=" +
      "bitcoin," +
      "ethereum," +
      "binancecoin," +
      "solana," +
      "ripple," +
      "cardano," +
      "dogecoin," +
      "avalanche-2," +
      "chainlink," +
      "polkadot," +
      "litecoin," +
      "tron" +
      "&order=market_cap_desc" +
      "&sparkline=false" +
      "&price_change_percentage=24h";

    const data =
      await fetchJson<CoinGeckoItem[]>(
        url,
      );

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(
        (
          item,
        ): MarketItem | null => {
          const symbol = String(
            item.symbol || "",
          ).toUpperCase();

          const name = String(
            item.name || "",
          );

          const price = Number(
            item.current_price,
          );

          const change = Number(
            item.price_change_percentage_24h,
          );

          if (
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
            change: Number.isFinite(
              change,
            )
              ? Number(
                  change.toFixed(2),
                )
              : null,
            source: "CoinGecko",
          };
        },
      )
      .filter(
        (
          item,
        ): item is MarketItem =>
          item !== null,
      );
  } catch (error) {
    console.error(
      "Market ticker CoinGecko error:",
      error,
    );

    return [];
  }
}

/*
|--------------------------------------------------------------------------
| STOCKS
|--------------------------------------------------------------------------
*/

const stockSymbols = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices Inc.",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
  },
  {
    symbol: "V",
    name: "Visa Inc.",
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
  },
];

async function loadStockMarket(
  item: (typeof stockSymbols)[number],
): Promise<MarketItem | null> {
  try {
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
      `${encodeURIComponent(item.symbol)}` +
      "?range=2d&interval=1d";

    const data =
      await fetchJson<YahooChartResponse>(
        url,
      );

    const result =
      data?.chart?.result?.[0];

    if (!result) {
      return null;
    }

    const meta = result.meta;

    const price = Number(
      meta?.regularMarketPrice,
    );

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return null;
    }

    const previousClose = Number(
      meta?.previousClose ??
        meta?.chartPreviousClose,
    );

    const change =
      calculateChange(
        price,
        previousClose,
      );

    return {
      symbol: item.symbol,
      name:
        String(
          meta?.longName ||
            meta?.shortName ||
            item.name,
        ),
      category: "Stocks",
      price: roundPrice(price),
      change,
      source: "Yahoo Finance",
    };
  } catch (error) {
    console.error(
      `Market ticker Yahoo stock error for ${item.symbol}:`,
      error,
    );

    return null;
  }
}

async function loadStockMarkets(): Promise<
  MarketItem[]
> {
  const results =
    await Promise.allSettled(
      stockSymbols.map(
        (item) =>
          loadStockMarket(item),
      ),
    );

  return results
    .filter(
      (
        result,
      ) =>
        result.status ===
        "fulfilled",
    )
    .map(
      (result) => result.value,
    )
    .filter(
      (
        item,
      ): item is MarketItem =>
        item !== null,
    );
}

/*
|--------------------------------------------------------------------------
| BONDS / TREASURY YIELDS
|--------------------------------------------------------------------------
|
| Yahoo Finance provides these U.S. Treasury
| market indicators:
|
| ^IRX = 13 Week Treasury Bill
| ^FVX = 5 Year Treasury Yield
| ^TNX = 10 Year Treasury Yield
| ^TYX = 30 Year Treasury Yield
|
| These values represent Treasury yields,
| not bond share prices.
|
*/

const bondSymbols = [
  {
    symbol: "^IRX",
    name: "13 Week U.S. Treasury Bill",
  },
  {
    symbol: "^FVX",
    name: "5 Year U.S. Treasury Yield",
  },
  {
    symbol: "^TNX",
    name: "10 Year U.S. Treasury Yield",
  },
  {
    symbol: "^TYX",
    name: "30 Year U.S. Treasury Yield",
  },
];

async function loadBondMarket(
  item: (typeof bondSymbols)[number],
): Promise<MarketItem | null> {
  try {
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
      `${encodeURIComponent(item.symbol)}` +
      "?range=2d&interval=1d";

    const data =
      await fetchJson<YahooChartResponse>(
        url,
      );

    const result =
      data?.chart?.result?.[0];

    if (!result) {
      return null;
    }

    const meta = result.meta;

    const price = Number(
      meta?.regularMarketPrice,
    );

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return null;
    }

    const previousClose = Number(
      meta?.previousClose ??
        meta?.chartPreviousClose,
    );

    const change =
      calculateChange(
        price,
        previousClose,
      );

    return {
      symbol: item.symbol,
      name: item.name,
      category: "Bonds",
      price: roundPrice(price),
      change,
      source: "Yahoo Finance",
    };
  } catch (error) {
    console.error(
      `Market ticker Yahoo bond error for ${item.symbol}:`,
      error,
    );

    return null;
  }
}

async function loadBondMarkets(): Promise<
  MarketItem[]
> {
  const results =
    await Promise.allSettled(
      bondSymbols.map(
        (item) =>
          loadBondMarket(item),
      ),
    );

  return results
    .filter(
      (
        result,
      ) =>
        result.status ===
        "fulfilled",
    )
    .map(
      (result) => result.value,
    )
    .filter(
      (
        item,
      ): item is MarketItem =>
        item !== null,
    );
}

/*
|--------------------------------------------------------------------------
| FOREX
|--------------------------------------------------------------------------
*/

const forexPairs = [
  [
    "EUR",
    "USD",
    "Euro / US Dollar",
  ],
  [
    "GBP",
    "USD",
    "British Pound / US Dollar",
  ],
  [
    "USD",
    "JPY",
    "US Dollar / Japanese Yen",
  ],
  [
    "USD",
    "CHF",
    "US Dollar / Swiss Franc",
  ],
] as const;

async function loadForexMarket(
  pair: (typeof forexPairs)[number],
): Promise<MarketItem | null> {
  const [
    base,
    quote,
    name,
  ] = pair;

  try {
    const url =
      `https://api.frankfurter.dev/v2/rate/${base}/${quote}`;

    const data =
      await fetchJson<FrankfurterResponse>(
        url,
      );

    const rate = Number(
      data.rate,
    );

    if (
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      return null;
    }

    return {
      symbol: `${base}/${quote}`,
      name,
      category: "Forex",
      price: roundPrice(rate),
      change: null,
      source: "Frankfurter",
    };
  } catch (error) {
    console.error(
      `Market ticker Forex error for ${base}/${quote}:`,
      error,
    );

    return null;
  }
}

async function loadForexMarkets(): Promise<
  MarketItem[]
> {
  const results =
    await Promise.allSettled(
      forexPairs.map(
        (pair) =>
          loadForexMarket(pair),
      ),
    );

  return results
    .filter(
      (
        result,
      ) =>
        result.status ===
        "fulfilled",
    )
    .map(
      (result) => result.value,
    )
    .filter(
      (
        item,
      ): item is MarketItem =>
        item !== null,
    );
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    /*
     * This endpoint is intentionally PUBLIC.
     *
     * Do not add requireAuthenticatedPage()
     * here. It powers the public landing page.
     */

    const results =
      await Promise.allSettled([
        loadCryptoMarkets(),
        loadStockMarkets(),
        loadBondMarkets(),
        loadForexMarkets(),
      ]);

    const cryptoMarkets =
      results[0].status ===
      "fulfilled"
        ? results[0].value
        : [];

    const stockMarkets =
      results[1].status ===
      "fulfilled"
        ? results[1].value
        : [];

    const bondMarkets =
      results[2].status ===
      "fulfilled"
        ? results[2].value
        : [];

    const forexMarkets =
      results[3].status ===
      "fulfilled"
        ? results[3].value
        : [];

    const markets: MarketItem[] = [
      ...cryptoMarkets,
      ...stockMarkets,
      ...bondMarkets,
      ...forexMarkets,
    ];

    /*
     * Remove duplicates.
     */
    const uniqueMarkets =
      Array.from(
        new Map(
          markets.map(
            (market) => [
              `${market.category}:${market.symbol}`,
              market,
            ],
          ),
        ).values(),
      );

    /*
     * Keep the ticker order predictable.
     */
    const categoryOrder: MarketCategory[] =
      [
        "Crypto",
        "Stocks",
        "Bonds",
        "Forex",
      ];

    uniqueMarkets.sort(
      (a, b) => {
        const categoryDifference =
          categoryOrder.indexOf(
            a.category,
          ) -
          categoryOrder.indexOf(
            b.category,
          );

        if (
          categoryDifference !== 0
        ) {
          return categoryDifference;
        }

        return a.symbol.localeCompare(
          b.symbol,
        );
      },
    );

    const risingMarkets =
      uniqueMarkets.filter(
        (market) =>
          market.change !== null &&
          market.change > 0,
      ).length;

    const fallingMarkets =
      uniqueMarkets.filter(
        (market) =>
          market.change !== null &&
          market.change < 0,
      ).length;

    /*
     * Even if one provider fails,
     * return the data that did load.
     */
    return NextResponse.json(
      {
        success:
          uniqueMarkets.length > 0,

        updatedAt:
          new Date().toISOString(),

        count:
          uniqueMarkets.length,

        risingMarkets,

        fallingMarkets,

        markets:
          uniqueMarkets,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    /*
     * The endpoint itself should only return
     * 500 for an unexpected server failure.
     */
    console.error(
      "Market ticker API fatal error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        updatedAt:
          new Date().toISOString(),
        count: 0,
        risingMarkets: 0,
        fallingMarkets: 0,
        markets: [],
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  }
}