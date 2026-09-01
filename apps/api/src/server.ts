import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
    console.log(`🚀 ${env.APP_NAME} is running`);
    console.log(`🌍 http://localhost:${env.PORT}`);
    console.log(`📦 Environment: ${env.NODE_ENV}`);
});