import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const ws = new WebSocket("ws://192.168.83.85:4000");
function sendMessage(msg) {
  ws.send(msg);
}

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  ws.onmessage = function (message) {
    
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://192.168.83.85:3000/users");
      setUsers(response.data.users);
    };

    setInterval(() => {
      fetchData();
    }, 5 * 1000);
  }, []);

  const handleClick = (id) => {
    if (users[id] == username) {
      const file = document.getElementById("fileForm");
      file.style.display = "none";
      return;
    }

    const file = document.getElementById("fileForm");
    file.style.display = "block";
    setSelectedUser(users[id]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var fileInput = document.getElementById("fileToUpload");
    var file = fileInput.files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = function (event) {
        var fileData = event.target.result;
        var fileObject = {
          type: "file",
          name: username,
          sendTo: selectedUser,
          fileName: file.name,
          fileData: fileData,
        };
        sendMessage(JSON.stringify(fileObject));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {isLogged || (
        <Login setIsLogged={setIsLogged} setUsername={setUsername} />
      )}
      {isLogged && (
        <>
          <div className="top">
            {users.map((user, id) => (
              <div key={id} className="card" onClick={() => handleClick(id)}>
                <div className="glowing-green-light"></div>
                <p>{user}</p>
              </div>
            ))}
            <form id="fileForm" onSubmit={handleSubmit}>
              <input type="file" name="fileToUpload" id="fileToUpload" />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div className="bottom">
            {fileUrls.map((fileUrl, id) => {
              return (
                <div className="card">
                  <a href={fileUrl} download={fileNames[id]}>
                    <button>Download</button>
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

const Login = ({ setIsLogged, setUsername }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const data = {
      type: "join",
      payload: name,
    };
    sendMessage(JSON.stringify(data));
    setIsLogged(true);
    setUsername(name);
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
