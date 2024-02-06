import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const ws = new WebSocket("ws://localhost:4000");

function sendMessage(msg) {
  ws.send(msg);
}

function App() {
  const [users, setUsers] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data.users);
    };

    setInterval(() => {
      fetchData();
    }, 5 * 1000);
  }, []);

  const handleClick = (id) => {
    const sendData = {
      name: users[id],
      payload: "Hello",
    };

    sendMessage(JSON.stringify(sendData));
  };

  return (
    <>
      {isLogged || <Login setIsLogged={setIsLogged} />}
      {isLogged && (
        <div className="top">
          {users.map((user, id) => (
            <div key={id} className="card" onClick={() => handleClick(id)}>
              <div className="glowing-green-light"></div>
              <p>{user}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const Login = ({ setIsLogged }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const data = {
      type: "join",
      payload: name,
    };
    sendMessage(JSON.stringify(data));
    setIsLogged(true);
  };

  return (
    <div className="center">
      <form onSubmit={handleSubmit}>
        <label>What should we call you?</label>
        <input type="text" name="name" id="name" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
