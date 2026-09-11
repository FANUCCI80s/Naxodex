"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  status: string;
  createdAt: string;
  kyc: {
    status: string;
  } | null;
  balance: {
    available: number;
    total: number;
  } | null;
};

type Filter = "ALL" | "ACTIVE" | "PENDING" | "BLOCKED";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/users", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load users."
          );
        }

        setUsers(data.users || []);
      } catch (error) {
        console.error("Users page error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`
          .trim()
          .toLowerCase();

      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (filter === "ACTIVE") {
        return user.status === "ACTIVE";
      }

      if (filter === "BLOCKED") {
        return (
          user.status === "BLOCKED" ||
          user.status === "SUSPENDED"
        );
      }

      if (filter === "PENDING") {
        return (
          user.kyc?.status === "PENDING" ||
          user.status === "PENDING"
        );
      }

      return true;
    });
  }, [users, search, filter]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "ACTIVE"
  ).length;

  const pendingUsers = users.filter(
    (user) =>
      user.kyc?.status === "PENDING" ||
      user.status === "PENDING"
  ).length;

  const blockedUsers = users.filter(
    (user) =>
      user.status === "BLOCKED" ||
      user.status === "SUSPENDED"
  ).length;

  function getFullName(user: User) {
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return name || "Unnamed user";
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number(value || 0));
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "ACTIVE":
        return "bg-gold/10 text-gold";

      case "BLOCKED":
      case "SUSPENDED":
        return "bg-red-400/10 text-red-400";

      case "PENDING":
        return "bg-yellow-400/10 text-yellow-400";

      default:
        return "bg-white/10 text-zinc-400";
    }
  }

  function getKycClass(status?: string) {
    switch (status) {
      case "APPROVED":
        return "bg-gold/10 text-gold";

      case "REJECTED":
        return "bg-red-400/10 text-red-400";

      case "PENDING":
        return "bg-yellow-400/10 text-yellow-400";

      default:
        return "bg-white/10 text-zinc-500";
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-gold transition hover:text-gold-light"
            >
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 rotate-45 border-b border-l border-gold"
              />
              Admin Dashboard
            </Link>

            <p className="mt-5 text-sm font-bold text-gold">
              User management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 !text-[#FFFFFF]">
              Manage registered NAXODEX users,
              account status, KYC status, and balances.
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Total users
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalUsers}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              Registered accounts
            </p>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-gold/[0.05] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Active users
            </p>

            <p className="mt-3 text-3xl font-bold text-gold">
              {activeUsers}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              Currently active accounts
            </p>
          </div>

          <div className="rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Pending
            </p>

            <p className="mt-3 text-3xl font-bold text-yellow-400">
              {pendingUsers}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              Users requiring attention
            </p>
          </div>

          <div className="rounded-3xl border border-red-400/10 bg-red-400/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Blocked
            </p>

            <p className="mt-3 text-3xl font-bold text-red-400">
              {blockedUsers}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              Restricted accounts
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="relative w-full lg:max-w-xl">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-zinc-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, email, or user ID..."
                className="w-full rounded-2xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:!text-[#FFFFFF] transition focus:border-gold/40"
              />
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["ALL", "All"],
                  ["ACTIVE", "Active"],
                  ["PENDING", "Pending"],
                  ["BLOCKED", "Blocked"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    filter === value
                      ? "bg-gold text-white"
                      : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:border-gold/30 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* USERS */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm !text-[#FFFFFF]">
                  Accounts
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Registered users
                </h2>
              </div>

              <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs !text-[#FFFFFF]">
                {filteredUsers.length} results
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold" />

              <p className="mt-4 text-sm !text-[#FFFFFF]">
                Loading users...
              </p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10 text-red-400">
                !
              </div>

              <h3 className="mt-4 font-bold">
                Unable to load users
              </h3>

              <p className="mt-2 text-sm !text-[#FFFFFF]">
                {error}
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] !text-[#FFFFFF]">
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full border border-zinc-500"
                />
              </div>

              <h3 className="mt-4 font-bold">
                No users found
              </h3>

              <p className="mt-2 text-sm !text-[#FFFFFF]">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider !text-[#FFFFFF]">
                      <th className="px-6 py-4 font-bold">
                        User
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Status
                      </th>

                      <th className="px-6 py-4 font-bold">
                        KYC
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Balance
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-right font-bold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 font-bold text-gold">
                              {(
                                user.firstName ||
                                user.email ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold">
                                {getFullName(user)}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-xs !text-[#FFFFFF]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getKycClass(
                              user.kyc?.status
                            )}`}
                          >
                            {user.kyc?.status ||
                              "NOT SUBMITTED"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-bold">
                            {formatCurrency(
                              user.balance?.available || 0
                            )}
                          </p>

                          <p className="mt-1 text-xs !text-[#FFFFFF]">
                            Available
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm !text-[#FFFFFF]">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm !text-[#FFFFFF] transition hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-white/10 lg:hidden">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 font-bold text-gold">
                          {(
                            user.firstName ||
                            user.email ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold">
                            {getFullName(user)}
                          </p>

                          <p className="mt-1 truncate text-xs !text-[#FFFFFF]">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs !text-[#FFFFFF]">
                          KYC
                        </p>

                        <p className="mt-2 text-sm">
                          {user.kyc?.status ||
                            "NOT SUBMITTED"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs !text-[#FFFFFF]">
                          Available
                        </p>

                        <p className="mt-2 text-sm font-bold">
                          {formatCurrency(
                            user.balance?.available || 0
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="text-xs !text-[#FFFFFF]">
                        Joined{" "}
                        {formatDate(user.createdAt)}
                      </p>

                      <Link
                        href={`/admin/users/${user.id}`}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm !text-[#FFFFFF] transition hover:border-gold/30 hover:text-gold"
                      >
                        View user
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <p className="mt-8 text-center text-xs !text-[#FFFFFF]">
          NAXODEX · Admin · Users
        </p>
      </div>
    </main>
  );
}