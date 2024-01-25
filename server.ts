import { auth } from "./middleware/isAuth.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { schema } from "./graphql/schema/index.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import express from "express";
import cors from "cors";
import "dotenv/config";

const app: any = express();

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

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.${process.env.MONGO_DATABASE_ID}.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("connected");
    app.listen(process.env.PORT, () => {
      console.log(`⚡️[server]: Server is running`);
    });
  })
  .catch((error: any) => {
    console.log(error);
  });
