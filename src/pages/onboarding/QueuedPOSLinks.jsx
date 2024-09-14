import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LinkYourPOSAccount from "./LinkYourPOSAccount";

const QueuedPOSLinks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [posQueue, setPosQueue] = useState([]);
  const [currentPOS, setCurrentPOS] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  useEffect(() => {
    const storedState = localStorage.getItem("onboarding_state");
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      console.log("parsedState", parsedState);
      const updatedQueue = parsedState.posQueue.slice(1); // Remove the first item
      setPosQueue(updatedQueue);
      setCurrentPOS(updatedQueue.length > 0 ? updatedQueue[0] : null);
      setSelectedBank(parsedState.selectedBank);
      console.log("parsedState", parsedState);
      // Remove the stored state after retrieving it
      localStorage.removeItem("onboarding_state");

      if (
        updatedQueue.length === 0 &&
        !parsedState.selectedPOS.includes("gocardless")
      ) {
        localStorage.removeItem("onboarding_state");
        navigate("/link-business-bank");
      }
    } else if (location.state?.selectedPOS) {
      setPosQueue(location.state.selectedPOS);
      setCurrentPOS(location.state.selectedPOS[0]);
      setSelectedBank(location.state.selectedBank);
    } else {
      // If there's no stored state and no location state, redirect to LinkYourPOS
      navigate("/link-your-pos");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (posQueue.length > 0 && !currentPOS) {
      setCurrentPOS(posQueue[0]);
    }
  }, [posQueue, currentPOS]);

  const handleNextPOS = () => {
    if (posQueue.includes("gocardless")) {
      const newQueue = posQueue.slice(1);
      setPosQueue(newQueue);
      setCurrentPOS(newQueue.length > 0 ? newQueue[0] : null);
      localStorage.removeItem("onboarding_state");
      navigate("/account-created-success");
    } else {
      const newQueue = posQueue.slice(1);
      setPosQueue(newQueue);
      setCurrentPOS(newQueue.length > 0 ? newQueue[0] : null);

      if (newQueue.length === 0) {
        localStorage.removeItem("onboarding_state");
        navigate("/link-business-bank");
      }
    }
  };

  if (!currentPOS) {
    return <div>Loading...</div>;
  }

  return (
    <LinkYourPOSAccount
      selectedPOS={currentPOS}
      posQueue={posQueue}
      selectedBank={selectedBank}
      onComplete={handleNextPOS}
    />
  );
};

export default QueuedPOSLinks;
