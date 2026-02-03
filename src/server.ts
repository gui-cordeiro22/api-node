// Dependencies
import fastify from "fastify";
import crypto from "node:crypto";

// Database
import { database } from "./database.js";

const app = fastify();

app.get("/hello", async () => {
    const transactions = await database("transactions")
        .where("amount", 500)
        .select("*");

    return transactions;
});

app.listen({ port: 3333 }).then(() => console.log("HTTP Server Running"));
