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
    origin: process.env.DEV
      ? `http://localhost:5173`
      : process.env.V1FLIX_FE_URL,
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

let listUser: any = [];
io.on("connection", (socket: any) => {
  let currentUser = "";
  let currentRoom = "";
  console.log("a user connected");

  socket.on("join", (username: string, room: any) => {
    currentRoom = room;
    currentUser = username;
    socket.join(room);
    const clients = io.sockets.adapter.rooms.get(room);

    if (clients.size === 1) listUser = [];
    listUser.push(username);

    io.sockets.in(room).emit("listUser", listUser);
  });

  socket.on("userChat", (username: string, message: string) => {
    console.log("room: " + currentRoom);
    io.sockets.in(currentRoom).emit("sendMessage", {
      message,
      username,
    });
  });

  socket.on("userVideo", (isPlaying: boolean, currentTime: any) => {
    socket.broadcast
      .to(currentRoom)
      .emit("playingVideo", isPlaying, currentTime);
  });

  socket.on("disconnect", () => {
    socket.leave(currentRoom);
    listUser = [...listUser].filter((user) => user !== currentUser);
    io.sockets.in(currentRoom).emit("listUser", listUser);
    console.log(`${currentUser} has disconnected in room ${currentRoom}`);
  });
});
