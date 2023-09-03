import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as express from "express";
import { AppDataSource } from "./data-source";
import { useExpressServer } from "routing-controllers";
import { WalletController } from "./controller/WalletController";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    dotenv.config();

    useExpressServer(app, {
      routePrefix: "/api",
      classTransformer: true,
      defaultErrorHandler: true,
      validation: false,
      controllers: [WalletController],
    });

    // start express server
    app.listen(process.env.PORT);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));
