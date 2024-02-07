const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const users = {};

const wss = new WebSocket.Server({ host: '0.0.0.0', port: 4000 });
wss.on("connection", async(ws, req) => {
  console.log(Object.keys(users));
  console.log("Client Connected");
  let name = "";

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    if (data.type == "join") {
      name = data.payload;
      users[data.payload] = ws;
      console.log(Object.keys(users));
    } else if (data.type == "file") {
      users[data.sendTo].send(JSON.stringify(data));
    }
  })

  ws.on("close", () => {
    console.log(`${name} left!`);
    delete users[name];
    console.log(Object.keys(users));
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

app.listen(3000, '0.0.0.0', () => {
  console.log("Server is running")
});
