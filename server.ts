import { auth } from "./middleware/isAuth";
import { resolvers } from "./graphql/resolvers/index";
import { schema } from "./graphql/schema/index";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import express from "express";
import cors from "cors";
import "dotenv/config";

const app: any = express();
const http = require("http").Server(app);

const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: `http://localhost:5173`,
  },
});

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
    http.listen(process.env.PORT, () => {
      console.log(`⚡️[server]: Server is running`);
    });
  })
  .catch((error: any) => {
    console.log(error);
  });

io.on("connection", (socket: any) => {
  console.log("a user connected");

  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });
});
