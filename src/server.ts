// App
import { app } from "./app.js";

// Utils
import { env } from "./env/index.js";

app.listen({ port: env.PORT }).then(() => console.log("HTTP Server Running"));
