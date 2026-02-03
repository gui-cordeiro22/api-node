// Dependencies
import { FastifyInstance } from "fastify";
import crypto from "node:crypto";

// Schema
import {
    createTransactionBodySchema,
    getTransactionsParamsSchema,
} from "./transactions.schema.js";

// Database
import { database } from "../../database.js";

export const transactionsRoutes = async (app: FastifyInstance) => {
    app.get("/", async () => {
        const transactions = await database("transactions").select();

        return { transactions };
    });

    app.get("/:id", async (request) => {
        const { id } = getTransactionsParamsSchema.parse(request.params);

        const transaction = await database("transactions")
            .select()
            .where("id", id)
            .first();

        return transaction;
    });

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
