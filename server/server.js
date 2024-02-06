const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const users = {};

const wss = new WebSocket.Server({ port: 4000 });
wss.on("connection", async(ws, req) => {
  console.log("Client Connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    if (data.type == "join") {
      users[data.payload] = ws;
      console.log(Object.keys(users));
    }
  })
})

const getUsers = async (req, res) => {
  res.status(200).json({
    users: Object.keys(users)
  });
};

const app = express();

app.use(express.json());
app.use(cors()); 

const router = express.Router();

router.route("/").get(getUsers);

app.use("/users", router);

app.listen(3000, () => {
  console.log("Server is running")
});
