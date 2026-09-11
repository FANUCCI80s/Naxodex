import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import readline from "readline";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("");
  console.error("❌ DATABASE_URL is missing from your .env file.");
  console.error("");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("");
  console.log("======================================");
  console.log("       NAXODEX ADMIN SETUP");
  console.log("======================================");
  console.log("");

  const firstName = (
    await question("Admin first name: ")
  ).trim();

  const lastName = (
    await question("Admin last name: ")
  ).trim();

  const email = (
    await question("Admin email: ")
  )
    .trim()
    .toLowerCase();

  const password = await question(
    "Admin password: "
  );

  console.log("");

  if (!firstName || !lastName) {
    throw new Error(
      "First name and last name are required."
    );
  }

  if (!email) {
    throw new Error(
      "Email address is required."
    );
  }

  if (!email.includes("@")) {
    throw new Error(
      "Please provide a valid email address."
    );
  }

  if (password.length < 8) {
    throw new Error(
      "Admin password must contain at least 8 characters."
    );
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  /*
   * Existing user
   */

  if (existingUser) {
    if (existingUser.role === "ADMIN") {
      console.log("");
      console.log(
        "⚠️ An admin account already exists with this email."
      );
      console.log("");

      return;
    }

    const confirm = (
      await question(
        "A normal user already exists with this email. Promote this user to ADMIN? (yes/no): "
      )
    )
      .trim()
      .toLowerCase();

    if (confirm !== "yes" && confirm !== "y") {
      console.log("");
      console.log("❌ Operation cancelled.");
      console.log("");

      return;
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const updatedUser =
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },

        data: {
          firstName,
          lastName,
          passwordHash,
          role: "ADMIN",
          status: "ACTIVE",
          emailVerified: true,
        },
      });

    console.log("");
    console.log("======================================");
    console.log("       NAXODEX ADMIN READY");
    console.log("======================================");
    console.log("");
    console.log(
      `Name: ${updatedUser.firstName} ${updatedUser.lastName}`
    );
    console.log(`Email: ${updatedUser.email}`);
    console.log("Role: ADMIN");
    console.log("Status: ACTIVE");
    console.log("Email verified: YES");
    console.log("");
    console.log(
      "The existing account has been promoted to ADMIN."
    );
    console.log("");

    return;
  }

  /*
   * Create new admin
   */

  const passwordHash =
    await bcrypt.hash(password, 12);

  const admin =
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
      },
    });

  console.log("");
  console.log("======================================");
  console.log("       NAXODEX ADMIN CREATED");
  console.log("======================================");
  console.log("");
  console.log(
    `Name: ${admin.firstName} ${admin.lastName}`
  );
  console.log(`Email: ${admin.email}`);
  console.log("Role: ADMIN");
  console.log("Status: ACTIVE");
  console.log("Email verified: YES");
  console.log("");
  console.log(
    "You can now log in using the admin credentials."
  );
  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ Admin creation failed.");
    console.error("");
    console.error(error);
    console.error("");
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();

    await prisma.$disconnect();

    await pool.end();
  });