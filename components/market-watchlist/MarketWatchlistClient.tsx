
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Coins,
  DollarSign,
  Gem,
  Landmark,
  LineChart,
  Menu,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

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

type MarketResponse = {
  success: boolean;
  updatedAt?: string;
  count?: number;
  markets?: MarketItem[];
  message?: string;
};

const categories = [
  "All",
  "Crypto",
  "Stocks",
  "ETFs",
  "Forex",
  "Bonds",
  "Precious Metals",
  "Commodities",
] as const;

type CategoryFilter =
  (typeof categories)[number];

function formatPrice(
  market: MarketItem
): string {
  if (market.category === "Forex") {
    return market.price.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }

  if (market.price < 0.01) {
    return market.price.toLocaleString("en-US", {
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    });
  }

  return market.price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function formatChange(
  change: number | null
): string {
  if (
    change === null ||
    !Number.isFinite(change)
  ) {
    return "—";
  }

  const sign = change > 0 ? "+" : "";

  return `${sign}${change.toFixed(2)}%`;
}

function formatUpdatedAt(
  updatedAt: string | null
): string {
  if (!updatedAt) {
    return "Waiting for market data";
  }

  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Recently updated";
  }

  return `Updated ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}`;
}

function getCategoryIcon(
  category: MarketCategory
) {
  switch (category) {
    case "Crypto":
      return Coins;

    case "Stocks":
      return LineChart;

    case "ETFs":
      return BarChart3;

    case "Forex":
      return DollarSign;

    case "Bonds":
      return Landmark;

    case "Precious Metals":
      return Gem;

    case "Commodities":
      return Activity;

    default:
      return Activity;
  }
}

export default function MarketWatchlistClient() {
  const [markets, setMarkets] =
    useState<MarketItem[]>([]);

  const [category, setCategory] =
    useState<CategoryFilter>("All");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [updatedAt, setUpdatedAt] =
    useState<string | null>(null);

  const [
    openMobileCategories,
    setOpenMobileCategories,
  ] = useState(false);

  const loadMarkets =
    useCallback(
      async (
        manualRefresh = false
      ) => {
        try {
          if (manualRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError("");

          const response =
            await fetch(
              "/api/market-watchlist",
              {
                method: "GET",
                cache: "no-store",
                credentials: "include",
              }
            );

          const data: MarketResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Unable to load market data."
            );
          }

          setMarkets(
            Array.isArray(
              data.markets
            )
              ? data.markets
              : []
          );

          setUpdatedAt(
            data.updatedAt ||
              null
          );
        } catch (err) {
          console.error(
            "Market watchlist error:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load market data."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  useEffect(() => {
    loadMarkets();

    const interval =
      window.setInterval(
        () => {
          loadMarkets(true);
        },
        60_000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [loadMarkets]);

  /*
   * ----------------------------------------------------------
   * REAL DATA STATISTICS
   * ----------------------------------------------------------
   */

  const totalMarkets =
    markets.length;

  const risingMarkets =
    markets.filter(
      (market) =>
        market.change !== null &&
        market.change > 0
    ).length;

  const fallingMarkets =
    markets.filter(
      (market) =>
        market.change !== null &&
        market.change < 0
    ).length;

  const categoryCounts =
    useMemo(() => {
      const counts =
        {} as Record<
          MarketCategory,
          number
        >;

      for (const market of markets) {
        counts[
          market.category
        ] =
          (counts[
            market.category
          ] || 0) + 1;
      }

      return counts;
    }, [markets]);

  /*
   * ----------------------------------------------------------
   * FILTERING
   * ----------------------------------------------------------
   */

  const filteredMarkets =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return markets.filter(
        (market) => {
          const matchesCategory =
            category === "All" ||
            market.category ===
              category;

          const matchesSearch =
            !query ||
            market.symbol
              .toLowerCase()
              .includes(query) ||
            market.name
              .toLowerCase()
              .includes(query);

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      markets,
      category,
      search,
    ]);

  /*
   * ----------------------------------------------------------
   * CATEGORY CARDS
   * ----------------------------------------------------------
   */

  const categoryCards = [
    {
      category:
        "Crypto" as const,
      title:
        "Digital assets",
      description:
        "Track a broad selection of cryptocurrencies and digital assets using market data supplied by CoinGecko.",
    },
    {
      category:
        "Stocks" as const,
      title:
        "Equities",
      description:
        "Monitor dynamically discovered listed companies and actively traded equities.",
    },
    {
      category:
        "ETFs" as const,
      title:
        "ETFs",
      description:
        "Monitor broad-market funds, sector funds and other exchange-traded instruments.",
    },
    {
      category:
        "Forex" as const,
      title:
        "Currencies",
      description:
        "Follow major international currency pairs using current reference exchange rates.",
    },
    {
      category:
        "Bonds" as const,
      title:
        "Bonds",
      description:
        "Follow Treasury yields and selected fixed-income market instruments.",
    },
    {
      category:
        "Precious Metals" as const,
      title:
        "Precious metals",
      description:
        "Monitor gold, silver, platinum, palladium and copper market prices.",
    },
    {
      category:
        "Commodities" as const,
      title:
        "Metals & energy",
      description:
        "Monitor crude oil, Brent crude and natural gas markets.",
    },
  ];

  return (
    <div className="space-y-10">

      {/* =====================================================
          GLOBAL MARKETS HEADER
          ===================================================== */}

      <header className="relative border-b border-white/10 pb-10">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/[0.04] blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                Market Watchlist
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Global markets
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 !text-[#FFFFFF] sm:text-base">
                Explore live market data across
                digital assets, equities, ETFs,
                currencies, bonds, precious metals
                and energy markets.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-xs font-semibold text-gold">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                  Live data
                </span>

                <span className="text-xs !text-[#FFFFFF]">
                  {loading
                    ? "Synchronizing markets..."
                    : formatUpdatedAt(
                        updatedAt
                      )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                loadMarkets(true)
              }
              disabled={refreshing}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gold/25 bg-gold/[0.07] px-5 py-3 text-sm font-bold text-gold transition hover:border-gold/40 hover:bg-gold/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh markets"}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Markets tracked */}
        <div className="rounded-3xl border border-gold/20 bg-gold/[0.06] p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm !text-[#FFFFFF]">
              Markets tracked
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <BarChart3 className="h-5 w-5" />
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-white">
            {loading
              ? "—"
              : totalMarkets}
          </p>

          <p className="mt-2 text-xs !text-[#FFFFFF]">
            Across multiple global asset classes
          </p>
        </div>

        {/* Markets rising */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm !text-[#FFFFFF]">
              Markets rising
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-white">
            {loading
              ? "—"
              : risingMarkets}
          </p>

          <p className="mt-2 text-xs !text-[#FFFFFF]">
            Showing positive movement
          </p>
        </div>

        {/* Markets falling */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm !text-[#FFFFFF]">
              Markets falling
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
              <TrendingDown className="h-5 w-5" />
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-white">
            {loading
              ? "—"
              : fallingMarkets}
          </p>

          <p className="mt-2 text-xs !text-[#FFFFFF]">
            Showing negative movement
          </p>
        </div>

        {/* Market status */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm !text-[#FFFFFF]">
              Market status
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Activity className="h-5 w-5" />
            </span>
          </div>

          <p className="mt-4 text-xl font-bold text-white">
            {error
              ? "Unavailable"
              : loading
              ? "Loading"
              : "Data active"}
          </p>

          <p className="mt-2 text-xs !text-[#FFFFFF]">
            {error
              ? "Unable to retrieve market data"
              : formatUpdatedAt(
                  updatedAt
                )}
          </p>
        </div>
      </div>

      {/* =====================================================
          ASSET CLASS OVERVIEW
          ===================================================== */}

      <section>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Asset classes
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Explore global markets
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 !text-[#FFFFFF]">
            Browse live market information across
            the major asset classes available in
            the watchlist.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryCards.map(
            (card) => {
              const Icon =
                getCategoryIcon(
                  card.category
                );

              const count =
                categoryCounts[
                  card.category
                ] || 0;

              return (
                <button
                  key={
                    card.category
                  }
                  type="button"
                  onClick={() => {
                    setCategory(
                      card.category
                    );
                    setSearch("");
                  }}
                  className={`group rounded-3xl border p-6 text-left transition ${
                    category ===
                    card.category
                      ? "border-gold/30 bg-gold/[0.06]"
                      : "border-white/10 bg-white/[0.03] hover:border-gold/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="text-2xl font-bold text-white">
                      {loading
                        ? "—"
                        : count}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] !text-[#FFFFFF]">
                    {card.category}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-white">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                    {
                      card.description
                    }
                  </p>

                  <p className="mt-4 text-xs font-bold text-gold">
                    {count === 1
                      ? "1 market"
                      : `${count} markets`}
                  </p>
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* =====================================================
          MARKETS
          ===================================================== */}

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
              Markets
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Search and explore
            </h2>
          </div>

          <p className="text-xs !text-[#FFFFFF]">
            {loading
              ? "Loading markets..."
              : `${filteredMarkets.length.toLocaleString()} markets shown`}
          </p>
        </div>

        {/* Search */}

        <div className="mt-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 !text-[#FFFFFF]" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by name or symbol..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:!text-[#FFFFFF] transition focus:border-gold/40 focus:bg-white/[0.04]"
            />
          </div>
        </div>

        {/* Mobile category selector */}

        <div className="mt-4 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setOpenMobileCategories(
                (value) =>
                  !value
              )
            }
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-white"
          >
            <span>
              {category}
            </span>

            <Menu className="h-5 w-5" />
          </button>

          {openMobileCategories && (
            <div className="mt-2 grid gap-2 rounded-2xl border border-white/10 bg-[#080808] p-2">
              {categories.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setCategory(
                        item
                      );
                      setOpenMobileCategories(
                        false
                      );
                    }}
                    className={`rounded-xl px-4 py-3 text-left text-sm transition ${
                      category ===
                      item
                        ? "bg-gold text-white"
                        : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Desktop categories */}

        <div className="mt-4 hidden flex-wrap gap-2 lg:flex">
          {categories.map(
            (item) => {
              const active =
                category === item;

              const count =
                item === "All"
                  ? totalMarkets
                  : categoryCounts[
                      item as MarketCategory
                    ] || 0;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setCategory(
                      item
                    )
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-gold text-white"
                      : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:border-gold/30 hover:text-white"
                  }`}
                >
                  {item}

                  <span
                    className={`ml-2 text-xs ${
                      active
                        ? "text-white/80"
                        : "text-zinc-600"
                    }`}
                  >
                    {loading
                      ? "—"
                      : count}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                !
              </div>

              <div>
                <p className="font-bold text-red-400">
                  Market data unavailable
                </p>

                <p className="mt-1 text-sm !text-[#FFFFFF]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    loadMarkets(
                      true
                    )
                  }
                  className="mt-3 text-sm font-bold text-red-300 underline underline-offset-4"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}

        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          <div className="hidden border-b border-white/10 px-6 py-4 text-xs font-bold uppercase tracking-wider !text-[#FFFFFF] md:grid md:grid-cols-[1.8fr_1fr_1fr_0.8fr_0.7fr]">
            <div>
              Market
            </div>

            <div>
              Category
            </div>

            <div>
              Price
            </div>

            <div className="text-right">
              24h Change
            </div>

            <div className="text-right">
              Source
            </div>
          </div>

          {loading ? (
            <div className="divide-y divide-white/10">
              {Array.from({
                length: 8,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="px-5 py-6 sm:px-6"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 w-40 rounded bg-white/10" />

                      <div className="mt-3 h-3 w-28 rounded bg-white/5" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : filteredMarkets.length ===
            0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.05] !text-[#FFFFFF]">
                <Search className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-bold text-white">
                No markets found
              </h3>

              <p className="mt-2 text-sm !text-[#FFFFFF]">
                Try another search or
                asset category.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredMarkets.map(
                (market) => {
                  const positive =
                    market.change !==
                      null &&
                    market.change >
                      0;

                  const negative =
                    market.change !==
                      null &&
                    market.change <
                      0;

                  const Icon =
                    getCategoryIcon(
                      market.category
                    );

                  return (
                    <div
                      key={`${market.category}-${market.symbol}`}
                      className="group px-5 py-5 transition hover:bg-white/[0.025] sm:px-6"
                    >
                      <div className="grid gap-4 md:grid-cols-[1.8fr_1fr_1fr_0.8fr_0.7fr] md:items-center">

                        {/* Market */}

                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-gold">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-white">
                              {
                                market.symbol
                              }
                            </p>

                            <p className="mt-1 truncate text-xs !text-[#FFFFFF]">
                              {
                                market.name
                              }
                            </p>
                          </div>
                        </div>

                        {/* Category */}

                        <div>
                          <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs !text-[#FFFFFF]">
                            {
                              market.category
                            }
                          </span>
                        </div>

                        {/* Price */}

                        <div>
                          <p className="text-sm font-bold text-white">
                            {formatPrice(
                              market
                            )}
                          </p>

                          <p className="mt-1 text-xs !text-[#FFFFFF]">
                            USD
                          </p>
                        </div>

                        {/* Change */}

                        <div className="text-left md:text-right">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                              positive
                                ? "bg-gold/10 text-gold"
                                : negative
                                ? "bg-red-400/10 text-red-400"
                                : "bg-white/[0.05] text-zinc-500"
                            }`}
                          >
                            {positive && (
                              <ArrowUp className="h-3 w-3" />
                            )}

                            {negative && (
                              <ArrowDown className="h-3 w-3" />
                            )}

                            {formatChange(
                              market.change
                            )}
                          </span>
                        </div>

                        {/* Source */}

                        <div className="text-left md:text-right">
                          <span className="text-xs !text-[#FFFFFF]">
                            {
                              market.source
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          DATA INFORMATION
          ===================================================== */}

      <section className="rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6 sm:p-8">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold text-yellow-300">
              Market data information
            </h3>

            <p className="mt-2 text-sm leading-6 !text-[#FFFFFF]">
              Market prices and movements are
              supplied by external market-data
              providers. Availability and update
              frequency can vary by asset class and
              provider. Markets shown here are for
              monitoring and information purposes;
              this interface does not execute trading
              orders or real-money transactions.
            </p>

            <p className="mt-3 text-xs !text-[#FFFFFF]">
              {formatUpdatedAt(
                updatedAt
              )}
            </p>
          </div>
        </div>
      </section>

      <p className="text-center text-xs !text-[#FFFFFF]">
        NAXODEX • Market Watchlist
      </p>
    </div>
  );
}


