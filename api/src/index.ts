import express from "express";
import cors from "cors";
import { config } from "./config/config";
import logger from "./config/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { corsOptions } from "./middlewares/corsOptions";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (_: any, res: any) => res.send("pong"));

app.use((_: any, res: express.Response) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

app.listen(config.app.port, () => {
  logger.info(
    `Server running on port ${config.app.port} in ${config.app.env} mode.`
  );
});
