const { db } = require("@vercel/postgres");
const {
  accounts,
  wordsets,
  publicData,
  users,
} = require("../app/lib/placeholder-data.js");
const bcrypt = require("bcrypt");

async function seedUsers(client) {
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create the "users" table if it doesn't exist
    await client.query(`
            CREATE TABLE IF NOT EXISTS users
            (
                id UUID DEFAULT uuid_generate_v4
            (
            ) PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
                );
        `);

    console.log('Created "users" table');

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(
          `
                        INSERT INTO users (id, email, password)
                        VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;
                    `,
          [user.id, user.email, hashedPassword]
        );
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedAccounts(client) {
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create the "accounts" table if it doesn't exist
    await client.query(`
            CREATE TABLE IF NOT EXISTS accounts
            (
                id UUID DEFAULT uuid_generate_v4
            (
            ) PRIMARY KEY,
                name VARCHAR
            (
                255
            ) NOT NULL,
                score INT NOT NULL,
                progress INT [],
                day_streak TIMESTAMP [],
                wordsets_user JSONB[]
                );
        `);

    console.log('Created "accounts" table');

    // Alter the "accounts" table to add the missing column
    await client.query(`
            ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS wordsets_user JSONB[];
        `);

    console.log('Altered "accounts" table to add missing column');

    // Insert data into the "accounts" table
    const insertedAccounts = await Promise.all(
      accounts.map(async (account) => {
        return client.query(
          `
                        INSERT INTO accounts (id, name, score, progress, day_streak, wordsets_user)
                        VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING;
                    `,
          [
            account.id,
            account.name,
            account.score,
            account.progress,
            account.day_streak,
            account.wordsets_user,
          ]
        );
      })
    );

    console.log(`Seeded ${insertedAccounts.length} accounts`);

    return {
      accounts: insertedAccounts,
    };
  } catch (error) {
    console.error("Error seeding accounts:", error);
    throw error;
  }
}

async function seedWordsets(client) {
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create the "wordsets" table if it doesn't exist
    await client.query(`
            CREATE TABLE IF NOT EXISTS wordsets
            (
                id UUID DEFAULT uuid_generate_v4
            (
            ) PRIMARY KEY,
                title VARCHAR
            (
                255
            ) NOT NULL,
                description TEXT,
                words JSONB[] -- JSONB array column
                );
        `);

    console.log('Created "wordsets" table');

    // Insert data into the "wordsets" table
    const insertedWordsets = await Promise.all(
      wordsets.map(async (wordset) => {
        return client.query(
          `
                        INSERT INTO wordsets (id, title, description, words)
                        VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;
                    `,
          [wordset.id, wordset.title, wordset.description, wordset.words]
        );
      })
    );

    console.log(`Seeded ${insertedWordsets.length} wordsets`);

    return {
      wordsets: insertedWordsets,
    };
  } catch (error) {
    console.error("Error seeding wordsets:", error);
    throw error;
  }
}

async function seedPublicData(client) {
  try {
    // Create the "public_data" table if it doesn't exist
    await client.query(`
            CREATE TABLE IF NOT EXISTS public_data
            (
                name VARCHAR
            (
                255
            ) PRIMARY KEY,
                score INT NOT NULL
                );
        `);

    console.log('Created "public_data" table');

    // Insert data into the "public_data" table
    const insertedPublicData = await Promise.all(
      publicData.map(async (publicItem) => {
        return client.query(
          `
                        INSERT INTO public_data (name, score)
                        VALUES ($1, $2) ON CONFLICT (name) DO NOTHING;
                    `,
          [publicItem.name, publicItem.score]
        );
      })
    );

    console.log(`Seeded ${insertedPublicData.length} public data`);

    return {
      publicData: insertedPublicData,
    };
  } catch (error) {
    console.error("Error seeding public data:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  try {
    await seedUsers(client);
    await seedAccounts(client);
    await seedWordsets(client);
    await seedPublicData(client);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
