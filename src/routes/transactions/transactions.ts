// Dependencies
import { FastifyInstance } from "fastify";
import crypto, { randomUUID } from "node:crypto";

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

        let sessionId = request.cookies.sessionId;

        if (!sessionId) {
            sessionId = randomUUID();

            response.cookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 Days
            });
        }

        await database("transactions").insert({
            id: crypto.randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id: sessionId,
        });

        return response.status(201).send();
    });

    app.get("/summary", async () => {
        const summary = await database("transactions")
            .sum("amount", { as: "amount" })
            .first();

        return { summary };
    });
};
