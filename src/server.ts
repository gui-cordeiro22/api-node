// Dependencies
import fastify from "fastify";

// Database
import { database } from "./database.js";

// Utils
import { env } from "./env/index.js";

const app = fastify();

app.get("/hello", async () => {
    const transactions = await database("transactions")
        .where("amount", 500)
        .select("*");

    return transactions;
});

app.listen({ port: env.PORT }).then(() => console.log("HTTP Server Running"));
