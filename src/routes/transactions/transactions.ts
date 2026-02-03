// Dependencies
import { FastifyInstance } from "fastify";
import crypto, { randomUUID } from "node:crypto";

// Schema
import {
    createTransactionBodySchema,
    getTransactionsParamsSchema,
} from "./transactions.schema.js";

// Middleware
import { checkSessionIdExists } from "../../middleware/check-session-id-exists/check-session-id-exists.js";

// Database
import { database } from "../../database.js";

export const transactionsRoutes = async (app: FastifyInstance) => {
    app.get(
        "/",
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const { sessionId } = request.cookies;

            const transactions = await database("transactions")
                .where("session_id", sessionId)
                .select();

            return { transactions };
        },
    );

    app.get(
        "/:id",
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const { id } = getTransactionsParamsSchema.parse(request.params);

            const { sessionId } = request.cookies;

            const transaction = await database("transactions")
                .select()
                .where({ id, session_id: sessionId })
                .first();

            return transaction;
        },
    );

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

    app.get(
        "/summary",
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const { sessionId } = request.cookies;

            const summary = await database("transactions")
                .where("session_id", sessionId)
                .sum("amount", { as: "amount" })
                .first();

            return { summary };
        },
    );
};
