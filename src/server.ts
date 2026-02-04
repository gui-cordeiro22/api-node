// App
import { app } from "./app.js";

// Utils
import { env } from "./env/index.js";

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() =>
    console.log("HTTP Server Running"),
);
