// Dependencies
import "dotenv/config";
import knex from "knex";

console.log(process.env);

// Types
import { Knex } from "knex";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not found");
}

export const databaseConfig: Knex.Config = {
    client: "sqlite",
    connection: {
        filename: process.env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./database/migrations",
    },
};

export const database = knex(databaseConfig);
