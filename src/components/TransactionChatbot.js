import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import PropTypes from "prop-types";

const TransactionChatbot = ({ transactions }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    const analyzeTransactions = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/analyze-transactions",
          { transactions }
        );
        setAnalysis(response.data.analysis);
        setMessages([
          {
            position: "left",
            type: "text",
            text: `Here's a summary of your transactions:\n\n${response.data.analysis}\n\nHow can I help you with your transactions?`,
          },
        ]);
      } catch (error) {
        console.error("Error analyzing transactions:", error);
      }
    };

    if (transactions.length > 0) {
      analyzeTransactions();
    }
  }, [transactions]);

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const newMessages = [
      ...messages,
      { position: "right", type: "text", text: inputText },
    ];
    setMessages(newMessages);
    setInputText("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: inputText,
        transactions,
      });
      setMessages([
        ...newMessages,
        { position: "left", type: "text", text: response.data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          position: "left",
          type: "text",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
  };

  return (
    <div style={{ height: "400px", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <MessageList
          className="message-list"
          lockable={true}
          toBottomHeight={"100%"}
          dataSource={messages}
        />
      </div>
      <Input
        placeholder="Type here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rightButtons={<button onClick={handleSendMessage}>Send</button>}
      />
    </div>
  );
};

TransactionChatbot.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default TransactionChatbot;
