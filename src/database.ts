// Dependencies
import knex from "knex";

// Types
import { Knex } from "knex";

export const databaseConfig: Knex.Config = {
    client: "sqlite",
    connection: {
        filename: "./database/app.db",
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./database/migrations",
    },
};

export const database = knex(databaseConfig);
