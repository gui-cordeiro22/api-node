// Dependencies
import fastify from "fastify";

// Routes
import { transactionsRoutes } from "./routes/transactions/transactions.js";

// Utils
import { env } from "./env/index.js";

const app = fastify();

app.register(transactionsRoutes, {
    prefix: "transactions",
});

app.listen({ port: env.PORT }).then(() => console.log("HTTP Server Running"));
