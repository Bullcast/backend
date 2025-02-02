import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { dataSource } from "./database/datasource";
import { RegisterRoutes } from "./routes/routes";
import { env } from "./config/config";

async function initApp() {
  await dataSource.initialize();
  if (env.nodeEnv === "local") {
    await dataSource.synchronize();
  }

  const app = express();

  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(express.static("public"));
  app.use(cors());
  
  app.get("/api/ping", async (_req, res) => {
    res.send({
      message: "hello",
    });
  });

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    }),
  );

  RegisterRoutes(app);

  return app;
}

initApp().then((app) => {
  app.listen(env.port, () => {
    console.log(`Server is running on http://localhost:${env.port}`);
  });
});