import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

async function bootstrap() {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
