import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import PropTypes from "prop-types";

const TransactionChatbot = ({ transactions }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);

      try {
        console.log("Sending PDF to backend for analysis");
        const response = await axios.post(
          "http://localhost:5000/api/analyze-pdf",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Analysis received:", response.data.analysis);
        setAnalysis(response.data.analysis);
      } catch (error) {
        console.error("Error analyzing PDF:", error);
        setAnalysis("Error processing PDF. Please try again.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

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
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button
        onClick={triggerFileInput}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Upload PDF
      </button>
      {analysis ? (
        <div>
          <h3>PDF Analysis:</h3>
          <p>{analysis}</p>
        </div>
      ) : (
        <p>No PDF analysis available yet.</p>
      )}
    </div>
  );
};

TransactionChatbot.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default TransactionChatbot;
