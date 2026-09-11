
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BankAccount = {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string | null;
  swiftBic: string | null;
  bankAddress: string | null;
  instructions: string | null;
  isEnabled: boolean;
};

type CardConfig = {
  id: string;
  paymentLink: string;
  instructions: string | null;
  isEnabled: boolean;
};

type CryptoOption = {
  id: string;
  asset: string;
  symbol: string;
  network: string;
  walletAddress: string;
  instructions: string | null;
  isEnabled: boolean;
};

type PaymentConfig = {
  id: string;
  method: "CASH_APP" | "PAYPAL" | "ZELLE" | "VENMO";
  paymentInformation: string;
  instructions: string | null;
  isEnabled: boolean;
};

type DepositData = {
  bankAccounts: BankAccount[];
  cardConfigs: CardConfig[];
  cryptoOptions: CryptoOption[];
  paymentConfigs: PaymentConfig[];
};

const paymentMethods = [
  {
    value: "CASH_APP",
    label: "Cash App",
  },
  {
    value: "PAYPAL",
    label: "PayPal",
  },
  {
    value: "ZELLE",
    label: "Zelle",
  },
  {
    value: "VENMO",
    label: "Venmo",
  },
] as const;

function formatPaymentMethod(method: string) {
  return (
    paymentMethods.find(
      (item) => item.value === method
    )?.label ?? method.replaceAll("_", " ")
  );
}

export default function AdminDepositSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [bank, setBank] = useState({
    id: "",
    accountName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    swiftBic: "",
    bankAddress: "",
    instructions: "",
    isEnabled: true,
  });

  const [card, setCard] = useState({
    id: "",
    paymentLink: "",
    instructions: "",
    isEnabled: true,
  });

  const [crypto, setCrypto] = useState({
    id: "",
    asset: "",
    symbol: "",
    network: "",
    walletAddress: "",
    instructions: "",
    isEnabled: true,
  });

  const [payments, setPayments] = useState<
    Record<
      string,
      {
        id: string;
        paymentInformation: string;
        instructions: string;
        isEnabled: boolean;
      }
    >
  >({});

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/deposits", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load deposit settings."
        );
      }

      const depositData: DepositData = result.data;

      const firstBank = depositData.bankAccounts[0];

      if (firstBank) {
        setBank({
          id: firstBank.id,
          accountName: firstBank.accountName,
          bankName: firstBank.bankName,
          accountNumber: firstBank.accountNumber,
          routingNumber:
            firstBank.routingNumber ?? "",
          swiftBic: firstBank.swiftBic ?? "",
          bankAddress:
            firstBank.bankAddress ?? "",
          instructions:
            firstBank.instructions ?? "",
          isEnabled: firstBank.isEnabled,
        });
      }

      const firstCard = depositData.cardConfigs[0];

      if (firstCard) {
        setCard({
          id: firstCard.id,
          paymentLink: firstCard.paymentLink,
          instructions:
            firstCard.instructions ?? "",
          isEnabled: firstCard.isEnabled,
        });
      }

      const firstCrypto =
        depositData.cryptoOptions[0];

      if (firstCrypto) {
        setCrypto({
          id: firstCrypto.id,
          asset: firstCrypto.asset,
          symbol: firstCrypto.symbol,
          network: firstCrypto.network,
          walletAddress:
            firstCrypto.walletAddress,
          instructions:
            firstCrypto.instructions ?? "",
          isEnabled: firstCrypto.isEnabled,
        });
      }

      const paymentState: Record<
        string,
        {
          id: string;
          paymentInformation: string;
          instructions: string;
          isEnabled: boolean;
        }
      > = {};

      for (const payment of depositData.paymentConfigs) {
        paymentState[payment.method] = {
          id: payment.id,
          paymentInformation:
            payment.paymentInformation,
          instructions:
            payment.instructions ?? "",
          isEnabled: payment.isEnabled,
        };
      }

      setPayments(paymentState);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load deposit settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function saveConfiguration(
    payload: Record<string, unknown>
  ) {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "/api/admin/deposits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to save settings."
        );
      }

      setMessage(
        result.message ||
          "Settings saved successfully."
      );

      await loadSettings();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteConfiguration(
    action: string,
    id: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this configuration?"
    );

    if (!confirmed) {
      return;
    }

    await saveConfiguration({
      action,
      id,
    });
  }

  function updatePayment(
    method: string,
    field:
      | "paymentInformation"
      | "instructions"
      | "isEnabled",
    value: string | boolean
  ) {
    setPayments((current) => ({
      ...current,
      [method]: {
        id: current[method]?.id ?? "",
        paymentInformation:
          current[method]?.paymentInformation ?? "",
        instructions:
          current[method]?.instructions ?? "",
        isEnabled:
          current[method]?.isEnabled ?? true,
        [field]: value,
      },
    }));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />

            <p className="mt-4 text-sm !text-[#FFFFFF]">
              Loading deposit settings...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="flex min-h-screen">
        {/* ADMIN SIDEBAR */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#050505] lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-6">
            <Link
              href="/admin"
              className="flex items-center gap-3"
            >
              <img
                src="/branding/NAXODEX-logo.png"
                alt="NAXODEX"
                className="h-9 w-auto object-contain"
              />

              <div>
                <p className="font-bold">
                  NAXODEX
                </p>

                <p className="text-xs !text-[#FFFFFF]">
                  Administration
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/admin"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Admin dashboard
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Users
            </Link>

            <Link
              href="/admin/kyc"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              KYC
            </Link>

            <Link
              href="/admin/deposit-settings"
              className="flex items-center rounded-xl bg-gold/10 px-4 py-3 text-sm font-bold text-gold"
            >
              Deposit settings
            </Link>

            <Link
              href="/admin/withdrawal-settings"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Withdrawal settings
            </Link>

            <Link
              href="/admin/transactions"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Transactions
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">
          <header className="border-b border-white/10 bg-[#050505] px-5 py-7 sm:px-8">
            <div className="mx-auto max-w-6xl">
              <p className="text-xs uppercase tracking-wider text-gold">
                Administration
              </p>

              <h1 className="mt-2 text-xl font-bold">
                Deposit settings
              </h1>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Manage deposit channels
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 !text-[#FFFFFF]">
                Configure the payment information
                your users will see when they open
                the deposit page. A method can be
                disabled without deleting its
                configuration.
              </p>
            </div>

            {message && (
              <div className="mb-6 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm text-gold-light">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* BANK TRANSFER */}
            <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold">
                    Deposit method 01
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Bank transfer
                  </h2>

                  <p className="mt-1 text-sm !text-[#FFFFFF]">
                    Bank details shown to users making
                    a bank deposit.
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm !text-[#FFFFFF]">
                  <input
                    type="checkbox"
                    checked={bank.isEnabled}
                    onChange={(event) =>
                      setBank((current) => ({
                        ...current,
                        isEnabled:
                          event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-gold"
                  />
                  Enabled
                </label>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Account name
                  </label>

                  <input
                    value={bank.accountName}
                    onChange={(event) =>
                      setBank((current) => ({
                        ...current,
                        accountName:
                          event.target.value,
                      }))
                    }
                    placeholder="Account holder name"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Bank name
                  </label>

                  <input
                    value={bank.bankName}
                    onChange={(event) =>
                      setBank((current) => ({
                        ...current,
                        bankName:
                          event.target.value,
                      }))
                    }
                    placeholder="Bank name"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Account number
                  </label>

                  <input
                    value={bank.accountNumber}
                    onChange={(event) =>
                      setBank((current) => ({
                        ...current,
                        accountNumber:
                          event.target.value,
                      }))
                    }
                    placeholder="Account number"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Routing number
                  </label>

                  <input
                    value={bank.routingNumber}
                    onChange={(event) =>
                      setBank((current) => ({
                        ...current,
                        routingNumber:
                          event.target.value,
                      }))
                    }
                    placeholder="Optional"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    SWIFT / BIC
                  </label>

                  <input
                    value={bank.swiftBic}
                    onChange={(event) =>
                      setBank((current) => ({
                        ...current,
                        swiftBic:
                          event.target.value,
                      }))
                    }
                    placeholder="Optional"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Bank address
                  </label>

                  <input
                    value={bank.bankAddress}
                    onChange={(event) =>
                      setBank((current) => ({
                        ...current,
                        bankAddress:
                          event.target.value,
                      }))
                    }
                    placeholder="Optional"
                    className="admin-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Instructions
                  </label>

                  <textarea
                    value={bank.instructions}
                    onChange={(event) =>
                      setBank((current) => ({
                        ...current,
                        instructions:
                          event.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Tell users exactly how to complete the bank transfer."
                    className="admin-input resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    saveConfiguration({
                      action: "SAVE_BANK",
                      ...bank,
                    })
                  }
                  className="rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save bank settings"}
                </button>

                {bank.id && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      deleteConfiguration(
                        "DELETE_BANK",
                        bank.id
                      )
                    }
                    className="rounded-xl border border-red-400/20 px-5 py-3 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </section>

            {/* CARD */}
            <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold">
                    Deposit method 02
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Card
                  </h2>

                  <p className="mt-1 text-sm !text-[#FFFFFF]">
                    Provide a secure card payment link
                    or payment information.
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm !text-[#FFFFFF]">
                  <input
                    type="checkbox"
                    checked={card.isEnabled}
                    onChange={(event) =>
                      setCard((current) => ({
                        ...current,
                        isEnabled:
                          event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-gold"
                  />
                  Enabled
                </label>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Card payment link / information
                  </label>

                  <input
                    value={card.paymentLink}
                    onChange={(event) =>
                      setCard((current) => ({
                        ...current,
                        paymentLink:
                          event.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Instructions
                  </label>

                  <textarea
                    value={card.instructions}
                    onChange={(event) =>
                      setCard((current) => ({
                        ...current,
                        instructions:
                          event.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Card payment instructions."
                    className="admin-input resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    saveConfiguration({
                      action: "SAVE_CARD",
                      ...card,
                    })
                  }
                  className="rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save card settings"}
                </button>

                {card.id && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      deleteConfiguration(
                        "DELETE_CARD",
                        card.id
                      )
                    }
                    className="rounded-xl border border-red-400/20 px-5 py-3 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </section>

            {/* CRYPTO */}
            <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-gold">
                  Deposit method 03
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Cryptocurrency
                </h2>

                <p className="mt-1 text-sm !text-[#FFFFFF]">
                  Configure the wallet address users
                  should send cryptocurrency to.
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Asset
                  </label>

                  <input
                    value={crypto.asset}
                    onChange={(event) =>
                      setCrypto((current) => ({
                        ...current,
                        asset:
                          event.target.value,
                      }))
                    }
                    placeholder="Bitcoin"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Symbol
                  </label>

                  <input
                    value={crypto.symbol}
                    onChange={(event) =>
                      setCrypto((current) => ({
                        ...current,
                        symbol:
                          event.target.value,
                      }))
                    }
                    placeholder="BTC"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Network
                  </label>

                  <input
                    value={crypto.network}
                    onChange={(event) =>
                      setCrypto((current) => ({
                        ...current,
                        network:
                          event.target.value,
                      }))
                    }
                    placeholder="Bitcoin"
                    className="admin-input"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Wallet address
                  </label>

                  <input
                    value={crypto.walletAddress}
                    onChange={(event) =>
                      setCrypto((current) => ({
                        ...current,
                        walletAddress:
                          event.target.value,
                      }))
                    }
                    placeholder="Wallet address"
                    className="admin-input font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="mb-2 block text-sm !text-[#FFFFFF]">
                    Instructions
                  </label>

                  <textarea
                    value={crypto.instructions}
                    onChange={(event) =>
                      setCrypto((current) => ({
                        ...current,
                        instructions:
                          event.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Crypto deposit instructions."
                    className="admin-input resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-3 text-sm !text-[#FFFFFF]">
                  <input
                    type="checkbox"
                    checked={crypto.isEnabled}
                    onChange={(event) =>
                      setCrypto((current) => ({
                        ...current,
                        isEnabled:
                          event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-gold"
                  />
                  Enabled
                </label>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    saveConfiguration({
                      action: "SAVE_CRYPTO",
                      ...crypto,
                    })
                  }
                  className="rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save cryptocurrency settings"}
                </button>

                {crypto.id && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      deleteConfiguration(
                        "DELETE_CRYPTO",
                        crypto.id
                      )
                    }
                    className="rounded-xl border border-red-400/20 px-5 py-3 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </section>

            {/* PAYMENT METHODS */}
            <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-gold">
                  Deposit methods 04–07
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Payment apps
                </h2>

                <p className="mt-1 text-sm !text-[#FFFFFF]">
                  Configure Cash App, PayPal, Zelle,
                  and Venmo individually.
                </p>
              </div>

              <div className="mt-6 space-y-5">
                {paymentMethods.map(
                  (paymentMethod) => {
                    const current =
                      payments[
                        paymentMethod.value
                      ] ?? {
                        id: "",
                        paymentInformation: "",
                        instructions: "",
                        isEnabled: true,
                      };

                    return (
                      <div
                        key={paymentMethod.value}
                        className="rounded-2xl border border-white/10 bg-black/20 p-5"
                      >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row">
                          <div>
                            <h3 className="font-bold">
                              {
                                paymentMethod.label
                              }
                            </h3>

                            <p className="mt-1 text-xs !text-[#FFFFFF]">
                              This information will
                              be displayed to users
                              when they choose{" "}
                              {
                                paymentMethod.label
                              }
                              .
                            </p>
                          </div>

                          <label className="flex cursor-pointer items-center gap-3 text-sm !text-[#FFFFFF]">
                            <input
                              type="checkbox"
                              checked={
                                current.isEnabled
                              }
                              onChange={(event) =>
                                updatePayment(
                                  paymentMethod.value,
                                  "isEnabled",
                                  event.target
                                    .checked
                                )
                              }
                              className="h-4 w-4 accent-gold"
                            />
                            Enabled
                          </label>
                        </div>

                        <div className="mt-5 space-y-5">
                          <div>
                            <label className="mb-2 block text-sm !text-[#FFFFFF]">
                              Payment information
                            </label>

                            <input
                              value={
                                current.paymentInformation
                              }
                              onChange={(event) =>
                                updatePayment(
                                  paymentMethod.value,
                                  "paymentInformation",
                                  event.target
                                    .value
                                )
                              }
                              placeholder={`Enter ${paymentMethod.label} payment information`}
                              className="admin-input"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm !text-[#FFFFFF]">
                              Instructions
                            </label>

                            <textarea
                              value={
                                current.instructions
                              }
                              onChange={(event) =>
                                updatePayment(
                                  paymentMethod.value,
                                  "instructions",
                                  event.target
                                    .value
                                )
                              }
                              rows={3}
                              placeholder="Optional instructions"
                              className="admin-input resize-none"
                            />
                          </div>
                        </div>

                        <div className="mt-5 flex gap-3">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              saveConfiguration({
                                action:
                                  "SAVE_PAYMENT",
                                id: current.id,
                                method:
                                  paymentMethod.value,
                                paymentInformation:
                                  current.paymentInformation,
                                instructions:
                                  current.instructions,
                                isEnabled:
                                  current.isEnabled,
                              })
                            }
                            className="rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:opacity-50"
                          >
                            {saving
                              ? "Saving..."
                              : `Save ${formatPaymentMethod(
                                  paymentMethod.value
                                )}`}
                          </button>

                          {current.id && (
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() =>
                                deleteConfiguration(
                                  "DELETE_PAYMENT",
                                  current.id
                                )
                              }
                              className="rounded-xl border border-red-400/20 px-5 py-3 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            {/* STATUS */}
            <section className="rounded-3xl border border-gold/10 bg-gold/5 p-6">
              <div>
                <h3 className="font-bold text-gold-light">
                  Deposit configuration
                </h3>

                <p className="mt-1 text-sm leading-6 !text-[#FFFFFF]">
                  Enabled methods are automatically
                  available on the user deposit page.
                  Disabled methods will not be
                  available for new deposit requests.
                </p>
              </div>
            </section>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: border-color 150ms ease;
        }

        .admin-input::placeholder {
          color: rgb(113 113 122);
        }

        .admin-input:focus {
          border-color: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </main>
  );
}

