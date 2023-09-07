import { auth } from "./middleware/isAuth";
import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import { resolvers } from "./graphql/resolvers/index";
import { schema } from "./graphql/schema";
import cors from "cors";
require("dotenv").config();

const app: any = express();
const port = 3000;

//every route will be checked
app.use(bodyParser.json());
app.use(cors());
app.use(auth);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

console.log(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.${process.env.MONGO_DATABASE_ID}.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`
);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.${process.env.MONGO_DATABASE_ID}.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("connected");
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error: any) => {
    console.log(error);
  });
