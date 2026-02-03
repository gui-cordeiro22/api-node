// Dependencies
import { FastifyInstance } from "fastify";
import crypto from "node:crypto";

// Schema
import { createTransactionBodySchema } from "./transactions.schema.js";

// Database
import { database } from "../../database.js";

export const transactionsRoutes = async (app: FastifyInstance) => {
    app.post("/", async (request, response) => {
        const { title, amount, type } = createTransactionBodySchema.parse(
            request.body,
        );

        await database("transactions").insert({
            id: crypto.randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
        });

        return response.status(201).send();
    });
};
