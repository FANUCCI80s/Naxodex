import "dotenv/config";

import { domainToASCII } from "node:url";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import bcrypt from "bcryptjs";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.trim() ||
  "support@naxodex.com";

const databaseUrl =
  process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("");
  console.error(
    "? DATABASE_URL is missing from your .env file."
  );
  console.error("");

  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter =
  new PrismaPg(pool);

const prisma =
  new PrismaClient({
    adapter,
  });

function normalizeEmail(
  email: string
): string {
  const value =
    email.trim().toLowerCase();

  const atIndex =
    value.lastIndexOf("@");

  if (
    atIndex <= 0 ||
    atIndex === value.length - 1
  ) {
    return value;
  }

  const localPart =
    value.slice(0, atIndex);

  const domain =
    value.slice(atIndex + 1);

  const asciiDomain =
    domainToASCII(domain);

  if (!asciiDomain) {
    return value;
  }

  return `${localPart}@${asciiDomain}`;
}

async function main() {
  const canonicalEmail =
    normalizeEmail(
      ADMIN_EMAIL
    );

  const unicodeEmail =
    ADMIN_EMAIL
      .trim()
      .toLowerCase();

  const adminPassword =
    process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "ADMIN_PASSWORD is missing from the environment."
    );
  }

  if (adminPassword.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must contain at least 8 characters."
    );
  }

  console.log("");
  console.log(
    "======================================"
  );
  console.log(
    "       NAXODEX ADMIN SETUP"
  );
  console.log(
    "======================================"
  );
  console.log("");

  console.log(
    `Admin email: ${canonicalEmail}`
  );

  /*
   * Look for the admin account using
   * the canonical email first.
   */
  let user =
    await prisma.user.findUnique({
      where: {
        email: canonicalEmail,
      },
    });

  /*
   * Also check the original lowercase
   * email in case it was stored differently.
   */
  if (
    !user &&
    unicodeEmail !== canonicalEmail
  ) {
    user =
      await prisma.user.findUnique({
        where: {
          email: unicodeEmail,
        },
      });
  }

  /*
   * Securely hash the admin password.
   */
  const passwordHash =
    await bcrypt.hash(
      adminPassword,
      12
    );

  /*
   * If the account already exists,
   * update it to ADMIN.
   */
  if (user) {
    console.log("");
    console.log(
      `Found existing user: ${user.firstName} ${user.lastName}`
    );

    console.log(
      "Updating account to ADMIN..."
    );

    const updatedUser =
      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          email: canonicalEmail,
          passwordHash,
          role: "ADMIN",
          status: "ACTIVE",
          emailVerified: true,
        },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true,
          emailVerified: true,
        },
      });

    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "       NAXODEX ADMIN READY"
    );
    console.log(
      "======================================"
    );
    console.log("");

    console.log(
      `Name:     ${updatedUser.firstName} ${updatedUser.lastName}`
    );

    console.log(
      `Email:    ${updatedUser.email}`
    );

    console.log(
      `Role:     ${updatedUser.role}`
    );

    console.log(
      `Status:   ${updatedUser.status}`
    );

    console.log(
      `Verified: ${
        updatedUser.emailVerified
          ? "YES"
          : "NO"
      }`
    );

    console.log("");
    console.log(
      "Admin account updated successfully."
    );
    console.log("");

    return;
  }

  /*
   * Account does not exist, so create
   * a completely new admin account.
   */
  console.log("");
  console.log(
    "No existing account found."
  );

  console.log(
    "Creating new admin account..."
  );

  const newUser =
    await prisma.user.create({
      data: {
        firstName: "NAXODEX",
        lastName: "Admin",
        email: canonicalEmail,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });

  /*
   * Create the user's balance record as well.
   * This keeps the new admin compatible with
   * parts of the application that expect a Balance.
   */
  await prisma.balance.create({
    data: {
      userId: newUser.id,
      available: 0,
      locked: 0,
    },
  });

  console.log("");
  console.log(
    "======================================"
  );
  console.log(
    "       NAXODEX ADMIN CREATED"
  );
  console.log(
    "======================================"
  );
  console.log("");

  console.log(
    `Name:     ${newUser.firstName} ${newUser.lastName}`
  );

  console.log(
    `Email:    ${newUser.email}`
  );

  console.log(
    `Role:     ${newUser.role}`
  );

  console.log(
    `Status:   ${newUser.status}`
  );

  console.log(
    `Verified: ${
      newUser.emailVerified
        ? "YES"
        : "NO"
    }`
  );

  console.log("");
  console.log(
    "Admin account created successfully."
  );
  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error(
      "? Failed to create/update NAXODEX admin account:"
    );
    console.error("");
    console.error(error);
    console.error("");

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });