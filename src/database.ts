// Dependencies
import knex from "knex";

// Types
import { Knex } from "knex";

// Utils
import { env } from "./env/index.js";

const databaseConnectionParams =
    env.DATABASE_CLIENT === "sqlite"
        ? { filename: env.DATABASE_URL }
        : env.DATABASE_URL;

export const databaseConfig: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: databaseConnectionParams,
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./database/migrations",
    },
};

export const database = knex(databaseConfig);
