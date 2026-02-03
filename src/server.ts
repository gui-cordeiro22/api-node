// Dependencies
import fastify from "fastify";
import cookie from "@fastify/cookie";

// Routes
import { transactionsRoutes } from "./routes/transactions/transactions.js";

// Utils
import { env } from "./env/index.js";

const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
    prefix: "transactions",
});

app.listen({ port: env.PORT }).then(() => console.log("HTTP Server Running"));
