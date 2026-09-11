"use client";

import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

type MarketApiResponse = {
  success?: boolean;
  updatedAt?: string;
  count?: number;
  risingMarkets?: number;
  fallingMarkets?: number;
  markets?: MarketItem[];
};

const FALLBACK_MARKETS: MarketItem[] = [
  {
    symbol: "BTC/USD",
    name: "Bitcoin",
    category: "Crypto",
    price: 0,
    change: null,
    source: "Loading",
  },
  {
    symbol: "ETH/USD",
    name: "Ethereum",
    category: "Crypto",
    price: 0,
    change: null,
    source: "Loading",
  },
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    category: "Forex",
    price: 0,
    change: null,
    source: "Loading",
  },
  {
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    category: "Forex",
    price: 0,
    change: null,
    source: "Loading",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    category: "Stocks",
    price: 0,
    change: null,
    source: "Loading",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    category: "Stocks",
    price: 0,
    change: null,
    source: "Loading",
  },
];

function formatPrice(
  market: MarketItem
): string {
  const price = Number(market.price);

  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return "—";
  }

  /*
   * Forex pairs usually have more decimal
   * places than stocks and crypto.
   */
  if (market.category === "Forex") {
    if (price >= 100) {
      return price.toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3,
        }
      );
    }

    return price.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 4,
        maximumFractionDigits: 5,
      }
    );
  }

  /*
   * Very small prices need additional
   * decimal precision.
   */
  if (price < 0.01) {
    return price.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 6,
        maximumFractionDigits: 8,
      }
    );
  }

  if (price < 1) {
    return price.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      }
    );
  }

  return `$${price.toLocaleString(
    "en-US",
    {
      minimumFractionDigits:
        price >= 1000 ? 2 : 2,
      maximumFractionDigits:
        price >= 1000 ? 2 : 4,
    }
  )}`;
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

function MarketDirection({
  change,
}: {
  change: number | null;
}) {
  if (
    change !== null &&
    Number.isFinite(change)
  ) {
    if (change > 0) {
      return (
        <TrendingUp
          className="h-3.5 w-3.5 shrink-0 text-emerald-400"
          strokeWidth={2}
        />
      );
    }

    if (change < 0) {
      return (
        <TrendingDown
          className="h-3.5 w-3.5 shrink-0 text-red-400"
          strokeWidth={2}
        />
      );
    }
  }

  return (
    <Minus
      className="h-3.5 w-3.5 shrink-0 text-zinc-500"
      strokeWidth={2}
    />
  );
}

function getChangeClass(
  change: number | null
): string {
  if (
    change !== null &&
    Number.isFinite(change)
  ) {
    if (change > 0) {
      return "text-emerald-400";
    }

    if (change < 0) {
      return "text-red-400";
    }
  }

  return "text-zinc-500";
}

export default function MarketTicker() {
  const [markets, setMarkets] =
    useState<MarketItem[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState(false);

  const loadMarkets = useCallback(
    async () => {
      try {
        const response = await fetch(
          "/api/market-ticker",
          {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Market request failed: ${response.status}`
          );
        }

        const data =
          (await response.json()) as MarketApiResponse;

        if (
          !data.success ||
          !Array.isArray(data.markets) ||
          data.markets.length === 0
        ) {
          throw new Error(
            "No market data returned"
          );
        }

        setMarkets(data.markets);
        setError(false);
      } catch (err) {
        console.error(
          "Market ticker error:",
          err
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      if (!mounted) {
        return;
      }

      await loadMarkets();
    };

    initialLoad();

    /*
     * Refresh the ticker every 30 seconds.
     *
     * The API itself pulls current market
     * data from CoinGecko, Yahoo Finance,
     * and Frankfurter.
     */
    const interval = window.setInterval(
      () => {
        if (mounted) {
          loadMarkets();
        }
      },
      30_000
    );

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [loadMarkets]);

  const tickerMarkets = useMemo(() => {
    if (markets.length > 0) {
      return markets;
    }

    return FALLBACK_MARKETS;
  }, [markets]);

  /*
   * Duplicate the dataset so the marquee
   * can continuously scroll.
   */
  const scrollingMarkets = useMemo(
    () => [
      ...tickerMarkets,
      ...tickerMarkets,
    ],
    [tickerMarkets]
  );

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[#050505]">
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('/branding/new-background-mobile-1.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#050505]/80" />

      {/* Subtle cinematic gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-transparent to-[#050505]/95" />

      {/* Emerald ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.05] blur-[100px]" />

      <div className="relative overflow-hidden">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration:
              Math.max(
                80,
                tickerMarkets.length * 4
              ),
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex w-max"
        >
          {scrollingMarkets.map(
            (
              market,
              index
            ) => {
              const change =
                market.change;

              return (
                <div
                  key={`${market.symbol}-${index}`}
                  className="flex min-w-[210px] items-center gap-3 border-r border-white/5 px-6 py-4 backdrop-blur-[2px]"
                  title={`${market.name} • ${market.source}`}
                >
                  <MarketDirection
                    change={change}
                  />

                  <span className="text-xs font-bold !text-[#FFFFFF]">
                    {market.symbol}
                  </span>

                  <span className="text-xs !text-[#FFFFFF]">
                    {formatPrice(
                      market
                    )}
                  </span>

                  <span
                    className={`text-xs font-bold ${getChangeClass(
                      change
                    )}`}
                  >
                    {formatChange(
                      change
                    )}
                  </span>
                </div>
              );
            }
          )}
        </motion.div>
      </div>

      {/* Loading / refresh indicator */}
      {(loading || error) && (
        <div className="pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md sm:flex">
          <RefreshCw
            className={`h-3 w-3 text-emerald-400 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
            {loading
              ? "Updating"
              : "Retrying"}
          </span>
        </div>
      )}
    </section>
  );
}