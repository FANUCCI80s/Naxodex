
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Bell,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Star,
  TrendingUp,
  X,
} from "lucide-react";

type Instrument = {
  id: string;
  symbol: string;
  name: string;
  coingeckoId: string | null;
  baseAsset: string;
  quoteAsset: string;
  enabled: boolean;
  assetClass?: string;
  provider?: string;
};

type Side = "BUY" | "SELL";

type Quote = {
  price: number;
  quantity: number;
  notional: number;
  timestamp: number;
  instrument: Instrument;
  side: Side;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Market Watchlist",
    href: "/market-watchlist",
    icon: Star,
  },
  {
    label: "Trade",
    href: "/trade",
    icon: ArrowLeftRight,
  },
  {
    label: "Deposit",
    href: "/deposit",
    icon: ArrowDownToLine,
  },
  {
    label: "Withdraw",
    href: "/withdraw",
    icon: ArrowUpFromLine,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
];

const secondaryNavItems = [
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function TradePage() {
  const router = useRouter();
  const pathname = usePathname();

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loadingInstruments, setLoadingInstruments] = useState(true);

  const [instrumentId, setInstrumentId] = useState("");
  const [side, setSide] = useState<Side>("BUY");
  const [quantity, setQuantity] = useState("0.01");

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [executing, setExecuting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /*
   * =========================================================
   * LOAD TRADING INSTRUMENTS
   * =========================================================
   */
  useEffect(() => {
    let cancelled = false;

    async function loadInstruments() {
      setLoadingInstruments(true);
      setError("");

      try {
        const response = await fetch("/api/trade/instruments", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ?? "Unable to load trading instruments.",
          );
        }

        const loadedInstruments = Array.isArray(data.instruments)
          ? data.instruments.filter(
              (instrument: Instrument) =>
                instrument.enabled !== false,
            )
          : [];

        if (cancelled) return;

        setInstruments(loadedInstruments);

        if (loadedInstruments.length > 0) {
          setInstrumentId(loadedInstruments[0].id);
        }
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Trading instruments request error:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load trading instruments.",
        );
      } finally {
        if (!cancelled) {
          setLoadingInstruments(false);
        }
      }
    }

    loadInstruments();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================================
   * SELECTED INSTRUMENT
   * =========================================================
   */
  const instrument = useMemo(
    () =>
      instruments.find(
        (item) => item.id === instrumentId,
      ) ?? null,
    [instruments, instrumentId],
  );

  const numericQuantity = Number(quantity);

  /*
   * =========================================================
   * NAVIGATION
   * =========================================================
   */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return false;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */
  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      closeMenu();

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to log out.");
      }

      router.replace("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);

      setLoggingOut(false);

      alert("Unable to log out. Please try again.");
    }
  }

  /*
   * =========================================================
   * REQUEST QUOTE
   * =========================================================
   */
  async function requestQuote() {
    setError("");
    setSuccess("");

    if (!instrument) {
      setError("Please select a trading instrument.");
      return;
    }

    if (
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      setError("Enter a valid quantity.");
      return;
    }

    setLoadingQuote(true);

    try {
      const response = await fetch("/api/trade/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instrumentId,
          side,
          quantity: numericQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ?? "Unable to retrieve quote.",
        );
      }

      setQuote(data.quote);
    } catch (err) {
      setQuote(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve quote.",
      );
    } finally {
      setLoadingQuote(false);
    }
  }

  /*
   * =========================================================
   * EXECUTE TRADE
   * =========================================================
   */
  async function execute() {
    setError("");
    setSuccess("");

    if (!instrument) {
      setError("Please select a trading instrument.");
      return;
    }

    if (
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      setError("Enter a valid quantity.");
      return;
    }

    if (!quote) {
      setError(
        "Get a current quote before confirming the trade.",
      );
      return;
    }

    setExecuting(true);

    try {
      const response = await fetch("/api/trade/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instrumentId,
          side,
          quantity: numericQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ?? "Trade execution failed.",
        );
      }

      const execution = data.execution;

      setSuccess(
        `${execution.side} order executed successfully. ` +
          `${execution.quantity} ${execution.symbol} ` +
          `at $${execution.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          })}.`,
      );

      setQuote(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Trade execution failed.",
      );
    } finally {
      setExecuting(false);
    }
  }

  /*
   * =========================================================
   * RESET QUOTE WHEN ORDER CHANGES
   * =========================================================
   */
  useEffect(() => {
    setQuote(null);
    setError("");
    setSuccess("");
  }, [instrumentId, side]);

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */
  if (loadingInstruments) {
    return (
      <>
        <TradeMenuButton
          onClick={() => setMenuOpen(true)}
        />

        <MobileTradeNavbar
          open={menuOpen}
          closeMenu={closeMenu}
          handleLogout={handleLogout}
          loggingOut={loggingOut}
          isActive={isActive}
        />

        <main className="min-h-screen bg-[#050505] px-4 py-6 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
            <div className="text-center">
              <Loader2
                className="mx-auto h-8 w-8 animate-spin text-[#d4af37]"
                strokeWidth={1.8}
              />

              <p className="mt-4 text-sm text-white/50">
                Loading trading instruments...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */
  if (!instrument && instruments.length === 0) {
    return (
      <>
        <TradeMenuButton
          onClick={() => setMenuOpen(true)}
        />

        <MobileTradeNavbar
          open={menuOpen}
          closeMenu={closeMenu}
          handleLogout={handleLogout}
          loggingOut={loggingOut}
          isActive={isActive}
        />

        <main className="min-h-screen bg-[#050505] px-4 py-6 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <TradeHeader />

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04]">
                <TrendingUp
                  size={22}
                  className="text-white/30"
                />
              </div>

              <p className="mt-5 text-lg font-medium">
                No trading instruments available
              </p>

              <p className="mt-2 text-sm text-white/50">
                Trading instruments have not been configured yet.
              </p>

              {error && (
                <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-4 text-sm text-red-300">
                  {error}
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* =====================================================
          TOP RIGHT MENU BUTTON
      ===================================================== */}
      <TradeMenuButton
        onClick={() => setMenuOpen(true)}
      />

      {/* =====================================================
          SLIDE-OUT USER NAVBAR
      ===================================================== */}
      <MobileTradeNavbar
        open={menuOpen}
        closeMenu={closeMenu}
        handleLogout={handleLogout}
        loggingOut={loggingOut}
        isActive={isActive}
      />

      <main className="min-h-screen bg-[#050505] px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* =================================================
              HEADER
          ================================================= */}
          <TradeHeader />

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            {/* =================================================
                ORDER FORM
            ================================================= */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Order
                  </p>

                  <h2 className="mt-1 text-xl font-medium">
                    Market Trade
                  </h2>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 px-3 py-1.5 text-xs text-[#d4af37]">
                  <ShieldCheck size={14} />
                  Secure
                </div>
              </div>

              {/* BUY / SELL */}
              <div className="mb-6 grid grid-cols-2 rounded-2xl bg-black/40 p-1">
                <button
                  type="button"
                  onClick={() => setSide("BUY")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    side === "BUY"
                      ? "bg-[#d4af37] text-black"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <ArrowDownToLine size={16} />
                  Buy
                </button>

                <button
                  type="button"
                  onClick={() => setSide("SELL")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    side === "SELL"
                      ? "bg-[#d4af37] text-black"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <ArrowUpFromLine size={16} />
                  Sell
                </button>
              </div>

              <div className="space-y-5">
                {/* SEARCHABLE INSTRUMENT */}
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-white/40">
                    Instrument
                  </label>

                  <InstrumentSearch
                    instruments={instruments}
                    selectedInstrument={instrument}
                    onSelect={(selected) => {
                      setInstrumentId(selected.id);
                    }}
                  />

                  <p className="mt-2 text-xs text-white/30">
                    Search from {instruments.length} available
                    trading instruments.
                  </p>
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-white/40">
                    Quantity
                  </label>

                  <div className="relative">
                    <input
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(event.target.value)
                      }
                      inputMode="decimal"
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 pr-20 text-lg text-white outline-none transition focus:border-[#d4af37]/50"
                    />

                    {instrument && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/40">
                        {instrument.baseAsset}
                      </span>
                    )}
                  </div>
                </div>

                {/* QUOTE BUTTON */}
                <button
                  type="button"
                  onClick={requestQuote}
                  disabled={
                    loadingQuote ||
                    executing ||
                    !instrument
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-4 text-sm font-medium text-[#d4af37] transition hover:bg-[#d4af37]/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingQuote ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Getting Quote
                    </>
                  ) : (
                    <>
                      <RefreshCw size={17} />
                      Get Current Quote
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 flex gap-3 rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/5 px-4 py-4 text-sm text-[#e4c65a]">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{success}</span>
                </div>
              )}
            </section>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Order Summary
                </p>

                <h2 className="mt-1 text-xl font-medium">
                  {instrument?.symbol ?? "—"}
                </h2>
              </div>

              <div className="space-y-4">
                <SummaryRow
                  label="Side"
                  value={side}
                />

                <SummaryRow
                  label="Asset"
                  value={instrument?.name ?? "—"}
                />

                <SummaryRow
                  label="Quantity"
                  value={
                    instrument
                      ? `${numericQuantity || 0} ${instrument.baseAsset}`
                      : "—"
                  }
                />

                <SummaryRow
                  label="Market Price"
                  value={
                    quote
                      ? `$${quote.price.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          },
                        )}`
                      : "—"
                  }
                />

                <div className="my-5 border-t border-white/10" />

                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm text-white/40">
                    Estimated Value
                  </span>

                  <span className="text-2xl font-semibold text-[#d4af37]">
                    {quote
                      ? `$${quote.notional.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}`
                      : "—"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={execute}
                disabled={
                  executing ||
                  loadingQuote ||
                  !quote ||
                  !instrument
                }
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d4af37] px-4 py-4 text-sm font-semibold text-black transition hover:bg-[#e0bf4d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {executing ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Executing
                  </>
                ) : (
                  <>Confirm {side}</>
                )}
              </button>

              <p className="mt-4 text-center text-[11px] leading-5 text-white/30">
                Market prices can change between quote and
                execution. The final execution price is
                determined by the engine at execution time.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

/*
 * ===========================================================
 * TRADE HEADER
 * ===========================================================
 */
function TradeHeader() {
  return (
    <div className="mb-8 pr-14 lg:pr-0">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[#d4af37]">
        <TrendingUp size={15} />
        NAXODEX TRADE
      </div>

      <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
        Trade
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
        Execute market orders with real-time pricing and
        controlled account settlement.
      </p>
    </div>
  );
}

/*
 * ===========================================================
 * TOP RIGHT MENU BUTTON
 * ===========================================================
 */
function TradeMenuButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div className="fixed right-5 top-5 z-30 sm:right-8 lg:hidden">
      <button
        type="button"
        onClick={onClick}
        aria-label="Open navigation"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#050505] text-white shadow-lg transition hover:border-[#d4af37]/30 hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
      >
        <Menu
          className="h-5 w-5"
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}

/*
 * ===========================================================
 * MOBILE / TABLET USER NAVBAR
 * ===========================================================
 */
function MobileTradeNavbar({
  open,
  closeMenu,
  handleLogout,
  loggingOut,
  isActive,
}: {
  open: boolean;
  closeMenu: () => void;
  handleLogout: () => void;
  loggingOut: boolean;
  isActive: (href: string) => boolean;
}) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#050505] shadow-2xl transition-transform duration-300 lg:hidden ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-7">
          <a
            href="/dashboard"
            onClick={closeMenu}
            className="inline-flex items-center"
          >
            <img
              src="/branding/NAXODEX-logo.png"
              alt="NAXODEX"
              className="block h-10 w-auto max-w-[190px] object-contain"
            />
          </a>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-gold/10 font-bold text-gold"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </a>
            );
          })}

          <div className="my-5 border-t border-white/10" />

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-gold/10 font-bold text-gold"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white transition hover:bg-red-400/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut
              className="h-5 w-5 shrink-0"
              strokeWidth={1.8}
            />

            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

/*
 * ===========================================================
 * SEARCHABLE INSTRUMENT SELECTOR
 * ===========================================================
 */
function InstrumentSearch({
  instruments,
  selectedInstrument,
  onSelect,
}: {
  instruments: Instrument[];
  selectedInstrument: Instrument | null;
  onSelect: (instrument: Instrument) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredInstruments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return instruments;
    }

    return instruments.filter((instrument) => {
      return (
        instrument.symbol
          .toLowerCase()
          .includes(query) ||
        instrument.name
          .toLowerCase()
          .includes(query) ||
        instrument.baseAsset
          .toLowerCase()
          .includes(query) ||
        instrument.quoteAsset
          .toLowerCase()
          .includes(query) ||
        instrument.coingeckoId
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [instruments, search]);

  function handleSelect(instrument: Instrument) {
    onSelect(instrument);
    setSearch("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <div
        className={`relative flex items-center rounded-2xl border bg-black/40 transition ${
          open
            ? "border-[#d4af37]/50"
            : "border-white/10"
        }`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center">
          <Search
            size={18}
            className="text-white/35"
          />
        </div>

        <input
          value={
            open
              ? search
              : selectedInstrument
                ? `${selectedInstrument.symbol} — ${selectedInstrument.name}`
                : ""
          }
          onFocus={() => {
            setOpen(true);
            setSearch("");
          }}
          onChange={(event) => {
            setSearch(event.target.value);
            setOpen(true);
          }}
          placeholder="Search asset or symbol..."
          className="min-w-0 flex-1 bg-transparent py-4 pr-2 text-sm text-white outline-none placeholder:text-white/30"
        />

        {open && search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear asset search"
            className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (open) {
              setOpen(false);
              setSearch("");
            } else {
              setOpen(true);
              setSearch("");
            }
          }}
          aria-label={
            open
              ? "Close asset search"
              : "Open asset search"
          }
          className="flex h-12 w-12 shrink-0 items-center justify-center text-white/40 transition hover:text-white"
        >
          <ChevronDown
            size={17}
            className={`transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close asset search"
            onClick={() => {
              setOpen(false);
              setSearch("");
            }}
            className="fixed inset-0 z-30 cursor-default"
          />

          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-2xl">
            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                    Available Assets
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {search.trim()
                      ? `${filteredInstruments.length} result${
                          filteredInstruments.length === 1
                            ? ""
                            : "s"
                        }`
                      : `${instruments.length} instruments`}
                  </p>
                </div>

                <TrendingUp
                  size={16}
                  className="text-[#d4af37]/50"
                />
              </div>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2">
              {filteredInstruments.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
                    <Search
                      size={18}
                      className="text-white/30"
                    />
                  </div>

                  <p className="text-sm font-medium text-white">
                    No assets found
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Try searching by asset name or symbol.
                  </p>
                </div>
              ) : (
                filteredInstruments.map((item) => {
                  const selected =
                    selectedInstrument?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                        selected
                          ? "bg-[#d4af37]/10"
                          : "hover:bg-white/[0.05]"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                          selected
                            ? "border-[#d4af37]/30 bg-[#d4af37]/10"
                            : "border-white/10 bg-white/[0.04]"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold ${
                            selected
                              ? "text-[#d4af37]"
                              : "text-white/60"
                          }`}
                        >
                          {item.baseAsset.slice(0, 4)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {item.symbol}
                          </p>

                          {item.assetClass && (
                            <span className="hidden rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/30 sm:inline-flex">
                              {item.assetClass}
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 truncate text-xs text-white/40">
                          {item.name}
                        </p>
                      </div>

                      {selected && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/10">
                          <CheckCircle2
                            size={15}
                            className="text-[#d4af37]"
                          />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/*
 * ===========================================================
 * SUMMARY ROW
 * ===========================================================
 */
function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-white/40">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-white">
        {value}
      </span>
    </div>
  );
}

