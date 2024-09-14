import React, { useEffect, useState } from "react";
import axios from "axios";

const LinkYourPOSAccount = ({
  selectedPOS,
  posQueue,
  selectedBank,
  onComplete,
}) => {
  const [error, setError] = useState(null);

  const saveOnboardingState = () => {
    localStorage.setItem(
      "onboarding_state",
      JSON.stringify({
        posQueue,
        selectedPOS,
        selectedBank,
        currentStep: `${selectedPOS}_connect`,
      })
    );
  };

  const openAuthWindow = (url) => {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      url,
      "POS Authorization",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleConnect = () => {
    setError(null);
    saveOnboardingState();

    let authUrl;
    switch (selectedPOS) {
      case "stripe":
        authUrl = `https://marketplace.stripe.com/oauth/v2/channellink*AZHNo6RSDgAAANsQ%23EhcKFWFjY3RfMVB3U2syMkw1aElURjJrNw/authorize?client_id=ca_Qo50TCFgXJKN1uVHUpkEiBw6pjtFoi3t&redirect_uri=${window.location.origin}/stripe-redirect`;
        break;
      case "square":
        const APPLICATION_ID = "sq0idp-_t93S2Hq4RJDLmVfzfcQ8A";
        authUrl = `https://connect.squareup.com/oauth2/authorize?client_id=${APPLICATION_ID}&scope=PAYMENTS_READ+PAYOUTS_READ&session=false&state=82201dd8d83d23cc8a48caf52b`;
        break;
      case "sumup":
        const sumUpAuthUrl = new URL("https://api.sumup.com/authorize");
        sumUpAuthUrl.searchParams.append("response_type", "code");
        sumUpAuthUrl.searchParams.append(
          "client_id",
          "cc_classic_OWLXSjVhAQv5Gs1Ro7g1RkJ9EXr4X"
        );
        sumUpAuthUrl.searchParams.append(
          "redirect_uri",
          `${window.location.origin}/sumup-redirect`
        );
        sumUpAuthUrl.searchParams.append("scope", "transactions.history");
        sumUpAuthUrl.searchParams.append("state", "2cFCsY36y95lFHk4");
        authUrl = sumUpAuthUrl.toString();
        break;
      case "gocardless":
        // For GoCardless, we need to make an API call first
        axios
          .post("/api/gocardless/build-a-link", {
            institution_id: selectedBank,
            redirect: `${window.location.origin}/gocardless-redirect`,
          })
          .then((response) => {
            localStorage.setItem(
              "requisistion_id",
              response.data.requisition.id
            );
            openAuthWindow(response.data.requisition.link);
          })
          .catch((error) => {
            console.error("Error connecting to GoCardless:", error);
            setError("Failed to connect to GoCardless. Please try again.");
          });
        return;
      default:
        setError("Unknown POS selected. Please try again.");
        return;
    }

    if (authUrl) {
      openAuthWindow(authUrl);
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type) {
        if (event.data.type.includes("_CONNECT_SUCCESS")) {
          onComplete();
        } else if (event.data.type.includes("_CONNECT_ERROR")) {
          setError(`Failed to connect. Please try again.`);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "400px",
          padding: "20px",
          backgroundColor: "#F2F2F2",
          borderRadius: "8px",
          border: "1px solid #efefef",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {error && (
          <div
            style={{
              backgroundColor: "#FFEBEE",
              color: "#D32F2F",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <div>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              color: "#222222",
              marginBottom: "20px",
            }}
          >
            Link your{" "}
            {selectedPOS === "sumup"
              ? "SumUp"
              : selectedPOS === "gocardless"
              ? "business bank account"
              : `${
                  selectedPOS.charAt(0).toUpperCase() + selectedPOS.slice(1)
                }`}{" "}
            account
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                maxWidth: "240px",
              }}
            >
              <img
                src="/images/logobrade.png"
                alt="Brade Logo"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
              <img
                src="/images/link.png"
                alt="Link Logo"
                style={{ width: "50px", height: "auto" }}
              />
              <img
                src={`/images/logo${selectedPOS}.png`}
                alt={`${
                  selectedPOS === "gocardless"
                    ? "UK Bank Account"
                    : selectedPOS.charAt(0).toUpperCase() + selectedPOS.slice(1)
                } Logo`}
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            </div>
          </div>
          <p
            style={{
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#5C5C5C",
              marginBottom: "30px",
            }}
          >
            Link your{" "}
            <span style={{ color: "#F564A9" }}>
              {selectedPOS === "sumup"
                ? "SumUp"
                : selectedPOS === "gocardless"
                ? "UK bank account"
                : `${
                    selectedPOS.charAt(0).toUpperCase() + selectedPOS.slice(1)
                  }`}{" "}
            </span>{" "}
            and <span style={{ color: "#F564A9" }}>Brade</span> and begin <br />
            tracking revenue and costs effortlessly.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onComplete}
            style={{
              width: "48%",
              height: "50px",
              backgroundColor: "#5c5c5c",
              color: "#f2f2f2",
              border: "none",
              borderRadius: "100px",
              cursor: "pointer",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Skip
          </button>
          <button
            onClick={handleConnect}
            style={{
              width: "48%",
              height: "50px",
              backgroundColor: "#f564a9",
              color: "white",
              border: "none",
              borderRadius: "100px",
              cursor: "pointer",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkYourPOSAccount;
