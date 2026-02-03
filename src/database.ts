// Dependencies
import knex from "knex";

// Types
import { Knex } from "knex";

// Utils
import { env } from "./env/index.js";

export const databaseConfig: Knex.Config = {
    client: "sqlite",
    connection: {
        filename: env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./database/migrations",
    },
};

export const database = knex(databaseConfig);
