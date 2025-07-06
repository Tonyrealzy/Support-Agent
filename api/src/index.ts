import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import { config } from "./config/config";
import logger from "./config/logger";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ping", (_, res: express.Response) => res.send("pong"));

app.listen(config.app.port, () => {
  logger.info(
    `Server running on port ${config.app.port} in ${config.app.env} mode.`
  );
});
