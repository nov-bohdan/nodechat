import { useEffect } from "react";
import { socket } from "../socket";
import MessageHistory from "./MessageHistory";
import { useState } from "react";
import axios from "axios";
import UsersPanel from "./UsersPanel";
import { Grid2 } from "@mui/material";
import LogoutButton from "./LogoutButton";
import MessageForm from "./MessageForm";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.connect();
    socket.on("message", (message) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/chat/getmessages")
      .then((response) => {
        const newMessages = response.data;
        if (newMessages) {
          setMessages(newMessages);
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.error);
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sendMessage = () => {
    if (input === "") return;
    socket.emit("message", input);
    setInput("");
  };

  return (
    <Grid2
      container
      spacing={2}
      sx={{
        marginX: 8,
        marginTop: 10,
      }}
    >
      <LogoutButton />
      <UsersPanel />
      <Grid2 item size={9}>
        <MessageHistory messages={messages} />
        {loading && <p>Loading...</p>}
        <MessageForm
          setInput={setInput}
          input={input}
          sendMessage={sendMessage}
        />
      </Grid2>
    </Grid2>
  );
}
