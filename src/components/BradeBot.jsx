import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingPage from "./LoadingPage";

const BradeBot = ({ expenses, revenues, financialGoals, report, isMobile }) => {
  const [message, setMessage] = useState(
    "👋 Hi there, I'm BradeBot! I'm here to answer any questions about your salon's finances"
  );
  const [inputText, setInputText] = useState("");
  const [isInputMode, setIsInputMode] = useState(false);
  const [previousMessage, setPreviousMessage] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatbotRef = useRef(null);
  const sendIconRef = useRef(null);

  const handleMessageClick = () => {
    setIsInputMode(true);
    setPreviousMessage(message);
    setMessage("");
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== "" && !isLoading) {
      setIsInputMode(false);
      setIsLoading(true);
      setMessage(""); // Clear the message while loading

      try {
        const response = await axios.post(
          report
            ? "/api/openai/report-financial-performance"
            : "/api/openai/analyze-monthly-transactions",
          {
            message: inputText,
            expenses: expenses,
            revenues: revenues,
            financialGoals: financialGoals,
          }
        );
        setMessage(response.data.response);
        setPreviousMessage(response.data.response);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessage("Sorry, I encountered an error. Please try again.");
      } finally {
        setIsLoading(false);
      }
      setInputText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCancelInput = useCallback(() => {
    setIsInputMode(false);
    setInputText("");
    if (previousMessage) {
      setMessage(previousMessage);
      setPreviousMessage("");
    }
  }, [previousMessage]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target) &&
        sendIconRef.current &&
        !sendIconRef.current.contains(event.target)
      ) {
        handleCancelInput();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [previousMessage, handleCancelInput]);

  const chatbotStyle = isFullScreen
    ? {
        position: "fixed",
        top: isMobile ? "10px" : "20px",
        left: isMobile ? "10px" : "200px",
        right: "10px",
        bottom: isMobile ? "50px" : "60px",
        zIndex: 100,
        width: "auto",
        height: "auto",
        maxWidth: "none",
        borderRadius: isMobile ? "0" : "14px",
      }
    : {
        height: "130px",
        width: "100%",
        borderRadius: "14px",
        marginBottom: "50px",
      };

  return (
    <div style={{ paddingRight: "60px" }}>
      <div style={{ position: "relative", ...chatbotStyle }}>
        <div
          ref={chatbotRef}
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #efefef",
            borderRadius: "14px",
            overflow: "hidden",
            padding: "20px",
            fontFamily: "Inter, sans-serif",
            backgroundColor: "#f1f2f3",
            height: "100%",
          }}
        >
          {isLoading ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <LoadingPage color="#222222" backgroundColor="transparent" />
            </div>
          ) : isInputMode ? (
            <textarea
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message and press Enter"
              style={{
                width: "100%",
                height: "100%",
                padding: "0",
                border: "none",
                outline: "none",
                fontSize: "16px",
                backgroundColor: "transparent",
                resize: "none",
                fontFamily: "Inter, sans-serif",
              }}
              autoFocus
            />
          ) : (
            <div
              onClick={handleMessageClick}
              style={{
                cursor: "pointer",
                whiteSpace: "pre-wrap",
                overflowY: "auto",
                height: "100%",
              }}
            >
              {message}
            </div>
          )}
        </div>
        <img
          ref={sendIconRef}
          src={
            inputText.trim() !== "" ? "/icons/send.svg" : "/icons/bradebot.svg"
          }
          alt={inputText.trim() !== "" ? "Send" : "BradeBot"}
          onClick={inputText.trim() !== "" ? handleSendMessage : undefined}
          style={{
            position: "absolute",
            top: isFullScreen ? "auto" : "0",
            bottom: isFullScreen ? "-20px" : "auto",
            right: isFullScreen ? "10px" : "-60px",
            width: "38px",
            height: "38px",
            cursor: inputText.trim() !== "" ? "pointer" : "default",
          }}
        />
        {isInputMode && inputText.trim() !== "" && (
          <img
            src="/icons/cancel-circle.svg"
            alt="Cancel"
            onClick={handleCancelInput}
            style={{
              position: "absolute",
              bottom: "-20px",
              left: isFullScreen ? "50px" : "10px",
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
          />
        )}
        <img
          src={
            isFullScreen ? "/icons/arrow-shrink.svg" : "/icons/arrow-expand.svg"
          }
          alt={isFullScreen ? "Shrink" : "Expand"}
          onClick={toggleFullScreen}
          style={{
            position: "absolute",
            bottom: "-20px",
            left: isFullScreen ? "10px" : "auto",
            right: isFullScreen ? "auto" : "10px",
            width: "24px",
            height: "24px",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

BradeBot.propTypes = {
  expenses: PropTypes.array.isRequired,
  revenues: PropTypes.array.isRequired,
  financialGoals: PropTypes.array.isRequired,
  month: PropTypes.string,
  isMobile: PropTypes.bool,
};

export default BradeBot;
