import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "../../components/FormInput";

const Settings = () => {
  const [marginGoal, setMarginGoal] = useState(8);
  const [revenueTarget, setRevenueTarget] = useState(6000);
  const [retentionRate, setRetentionRate] = useState(15);

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [salesAccessTokens, setSalesAccessTokens] = useState({});
  const [expensesAccessTokens, setExpensesAccessTokens] = useState({});
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasNotificationChanges, setHasNotificationChanges] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState(false);
  const [actionRequired, setActionRequired] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 1024;

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("/api/gocardless/choose-a-bank");
        const bankOptions = response.data.banks.map((bank) => ({
          value: bank.id,
          label: bank.name,
        }));

        // Add SANDBOXFINANCE_SFIN0000 to the list of banks
        bankOptions.unshift({
          value: "SANDBOXFINANCE_SFIN0000",
          label: "Sandbox Finance",
        });

        setBanks(bankOptions);
      } catch (error) {
        console.error("Error fetching bank list:", error);
      }
    };

    const fetchFinancialGoals = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.get(
          `/api/database/get-financial-goals/${userId}`
        );
        const { margin_goal, revenue_target, retention_rate } =
          response.data.financial_goals;
        setMarginGoal(margin_goal);
        setRevenueTarget(revenue_target);
        setRetentionRate(retention_rate);
      } catch (error) {
        console.error("Error fetching financial goals:", error);
      }
    };

    const fetchAccessTokens = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.get(
          `/api/database/get-access-tokens/${userId}`
        );
        setSalesAccessTokens(response.data.sales_access_tokens);
        setExpensesAccessTokens(response.data.expenses_access_tokens);
      } catch (error) {
        console.error("Error fetching access tokens:", error);
      }
    };

    const fetchNotificationSettings = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.get(
          `/api/database/get-notification-settings/${userId}`
        );
        const { monthly_summary, action_required } = response.data;
        setMonthlySummary(monthly_summary);
        setActionRequired(action_required);
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      }
    };

    fetchBanks();
    fetchFinancialGoals();
    fetchAccessTokens();
    fetchNotificationSettings();
  }, []);

  const sliderStyle = (value, min, max) => ({
    width: "100%",
    marginTop: "10px",
    WebkitAppearance: "none",
    appearance: "none",
    height: "2px",
    outline: "none",
    opacity: "0.7",
    transition: "opacity .2s",
    background: `linear-gradient(to right, #222222 0%, #222222 ${
      ((value - min) / (max - min)) * 100
    }%, #f1f2f3 ${((value - min) / (max - min)) * 100}%, #f1f2f3 100%)`,
  });

  const sliderThumbStyle = `
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      background: #222222;
      cursor: pointer;
      border-radius: 50%;
    }

    input[type="range"]::-moz-range-thumb {
      width: 12px;
      height: 12px;
      background: #222222;
      cursor: pointer;
      border-radius: 50%;
    }
  `;

  const buttonStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "15px",
    backgroundColor: "#ffffff",
    border: "1.5px solid #efefef",
    borderRadius: "8px",
    width: isMobile ? "100%" : "calc(33.33% - 10px)",
    textAlign: "left",
    fontFamily: "Inter, sans-serif",
    position: "relative",
  };

  const labelStyle = {
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: "#222222",
    marginBottom: "5px",
  };

  const descriptionStyle = {
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: "#606060",
    marginBottom: "5px",
  };

  const minMaxStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "5px",
    fontSize: "12px",
    color: "#606060",
    fontFamily: "Inter, sans-serif",
  };

  const infoStyle = {
    fontSize: "12px",
    color: "#606060",
    marginTop: "10px",
    fontFamily: "Inter, sans-serif",
  };

  const highlightStyle = {
    color: "#222222",
    fontWeight: 500,
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
  };

  const titleStyle = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "18px",
    color: "#222222",
    marginBottom: "20px",
    marginTop: isMobile ? "60px" : "40px",
  };

  const radioContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    width: "100%",
  };

  const radioGroupStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "70%",
  };

  const radioLabelStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: "#606060",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  };

  const radioInputStyle = `
    .custom-radio input[type="radio"] {
      display: none;
    }

    .custom-radio .radio-button {
      width: 12px;
      height: 12px;
      border: 2px solid #222222;
      border-radius: 50%;
      display: inline-block;
      position: relative;
      margin-right: 5px;
      border-color: transparent;
      background-color: #f1f2f3;  // Add this line
    }

    .custom-radio input[type="radio"]:checked + .radio-button::after {
      content: "";
      width: 10px;
      height: 10px;
      background-color: #222222;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .custom-radio input[type="radio"]:checked + .radio-button {
      border-color: transparent;
      background-color: #f1f2f3;
    }
    }
  `;

  const saveButtonStyle = {
    padding: "5px 10px",
    backgroundColor: "#f564a9",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 500,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  };

  const handlePOSConnection = async (pos, isConnected) => {
    setError(null); // Clear any previous error messages
    if (isConnected) {
      try {
        // Make API call to disconnect the POS
        await axios.post(`/api/database/delete-tokens`, {
          id: localStorage.getItem("id"),
          processor: pos,
        });

        if (pos === "gocardless") {
          setExpensesAccessTokens((prev) => {
            const newTokens = { ...prev };
            delete newTokens[pos];
            return newTokens;
          });
        } else {
          setSalesAccessTokens((prev) => {
            const newTokens = { ...prev };
            delete newTokens[pos];
            return newTokens;
          });
        }
      } catch (error) {
        console.error(`Error disconnecting from ${pos}:`, error);
        // Handle error (e.g., show an error message to the user)
      }
    } else {
      let authUrl;
      switch (pos) {
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
          if (!selectedBank) {
            setError("Please select the bank you wish to connect.");
            return;
          }
          try {
            const response = await axios.post("/api/gocardless/build-a-link", {
              user_id: localStorage.getItem("id"),
              institution_id: selectedBank,
              redirect: `${window.location.origin}/gocardless-redirect`,
            });
            localStorage.setItem(
              "requisistion_id",
              response.data.requisition.id
            );
            authUrl = response.data.requisition.link;
          } catch (error) {
            console.error("Error connecting to GoCardless:", error);
            setError(
              "Failed to connect your business account. Please try again."
            );
            return;
          }
          break;
        default:
          console.error("Unknown POS selected");
          return;
      }

      if (authUrl) {
        openAuthWindow(authUrl);
      }
    }
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

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type) {
        if (event.data.type.includes("_CONNECT_SUCCESS")) {
          // Update the appropriate state (salesAccessTokens or expensesAccessTokens)
          const pos = event.data.type.split("_")[0].toLowerCase();
          const token = event.data.token;
          if (pos === "gocardless") {
            setExpensesAccessTokens((prev) => ({ ...prev, [pos]: token }));
          } else {
            setSalesAccessTokens((prev) => ({ ...prev, [pos]: token }));
          }
        } else if (event.data.type.includes("_CONNECT_ERROR")) {
          console.error(
            `Failed to connect to ${event.data.type.split("_")[0]}`
          );
          // Handle error (e.g., show an error message to the user)
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("id");
      await axios.post(`/api/database/update-financial-goals/${userId}`, {
        financial_goals: {
          margin_goal: marginGoal,
          revenue_target: revenueTarget,
          retention_rate: retentionRate,
        },
      });
      setHasChanges(false);
      alert("Financial goals saved successfully!");
    } catch (error) {
      console.error("Error saving financial goals:", error);
      alert("Failed to save financial goals. Please try again.");
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const userId = localStorage.getItem("id");
      // Replace this with the actual API call to save notification settings
      await axios.post(`/api/database/update-notification-settings/${userId}`, {
        monthly_summary: document.querySelector(
          'input[name="monthlySummary"]:checked'
        ).value,
        action_required: document.querySelector(
          'input[name="actionRequired"]:checked'
        ).value,
        email_notifications: document.querySelector(
          'input[name="emailNotifications"]:checked'
        ).value,
      });
      setHasNotificationChanges(false);
      alert("Notification settings saved successfully!");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("Failed to save notification settings. Please try again.");
    }
  };

  return (
    <div>
      <style>{sliderThumbStyle}</style>
      <style>{radioInputStyle}</style>
      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={titleStyle}>Financial Goals</h1>
          {hasChanges && (
            <button style={saveButtonStyle} onClick={handleSave}>
              Save
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            gap: isMobile ? "20px" : "10px",
          }}
        >
          <button style={buttonStyle}>
            <span style={labelStyle}>Set Margin Goal</span>
            <span style={descriptionStyle}>
              Setting a margin goal helps you monitor your profitability and
              adjust pricing strategies accordingly.
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={marginGoal}
              onChange={(e) => {
                setMarginGoal(e.target.value);
                setHasChanges(true);
              }}
              style={sliderStyle(marginGoal, 0, 100)}
            />
            <div style={minMaxStyle}>
              <span>0%</span>
              <span>100%</span>
            </div>
            <div style={infoStyle}>
              Current margin goal:{" "}
              <span style={highlightStyle}>{marginGoal}%</span> • Industry
              standard: 7-9%
            </div>
          </button>
          <button style={buttonStyle}>
            <span style={labelStyle}>Set Revenue Target</span>
            <span style={descriptionStyle}>
              Setting revenue targets helps you stay focused on achieving your
              sales goals and measure performance over time.
            </span>
            <input
              type="range"
              min="0"
              max="20000"
              step="10"
              value={revenueTarget}
              onChange={(e) => {
                setRevenueTarget(e.target.value);
                setHasChanges(true);
              }}
              style={sliderStyle(revenueTarget, 0, 20000)}
            />
            <div style={minMaxStyle}>
              <span>£0</span>
              <span>£20,000</span>
            </div>
            <div style={infoStyle}>
              Current: <span style={highlightStyle}>£{revenueTarget}</span> •
              Industry standard: £6,000
            </div>
          </button>
          <button style={buttonStyle}>
            <span style={labelStyle}>Set Retention Rate</span>
            <span style={descriptionStyle}>
              Measures the percentage of clients who return. A higher rate shows
              strong customer loyalty.
            </span>
            <input
              type="range"
              min="0"
              max="30"
              value={retentionRate}
              onChange={(e) => {
                setRetentionRate(e.target.value);
                setHasChanges(true);
              }}
              style={sliderStyle(retentionRate, 0, 30)}
            />
            <div style={minMaxStyle}>
              <span>0%</span>
              <span>30%</span>
            </div>
            <div style={infoStyle}>
              Current goal: <span style={highlightStyle}>{retentionRate}%</span>{" "}
              • Industry standard: 10%-15%
            </div>
          </button>
        </div>
      </div>

      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={titleStyle}>Notifications</h1>
          {hasNotificationChanges && (
            <button style={saveButtonStyle} onClick={handleSaveNotifications}>
              Save
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            gap: isMobile ? "20px" : "10px",
          }}
        >
          <button style={buttonStyle}>
            <span style={labelStyle}>Monthly Summary</span>
            <span style={descriptionStyle}>
              Receive a monthly summary of financial performance
            </span>
            <div style={radioContainerStyle}>
              <div style={radioGroupStyle}>
                <label style={radioLabelStyle} className="custom-radio">
                  <input
                    type="radio"
                    name="monthlySummary"
                    value="enable"
                    checked={monthlySummary}
                    onChange={() => {
                      setMonthlySummary(true);
                      setHasNotificationChanges(true);
                    }}
                  />
                  <span className="radio-button"></span>
                  Enable
                </label>
                <label style={radioLabelStyle} className="custom-radio">
                  <input
                    type="radio"
                    name="monthlySummary"
                    value="disable"
                    checked={!monthlySummary}
                    onChange={() => {
                      setMonthlySummary(false);
                      setHasNotificationChanges(true);
                    }}
                  />
                  <span className="radio-button"></span>
                  Disable
                </label>
              </div>
            </div>
          </button>
          <button style={buttonStyle}>
            <span style={labelStyle}>Action Required</span>
            <span style={descriptionStyle}>
              Receive notifications for any actions required on integrations or
              settings
            </span>
            <div style={radioContainerStyle}>
              <div style={radioGroupStyle}>
                <label style={radioLabelStyle} className="custom-radio">
                  <input
                    type="radio"
                    name="actionRequired"
                    value="enable"
                    checked={actionRequired}
                    onChange={() => {
                      setActionRequired(true);
                      setHasNotificationChanges(true);
                    }}
                  />
                  <span className="radio-button"></span>
                  Enable
                </label>
                <label style={radioLabelStyle} className="custom-radio">
                  <input
                    type="radio"
                    name="actionRequired"
                    value="disable"
                    checked={!actionRequired}
                    onChange={() => {
                      setActionRequired(false);
                      setHasNotificationChanges(true);
                    }}
                  />
                  <span className="radio-button"></span>
                  Disable
                </label>
              </div>
            </div>
          </button>
          <button
            style={{
              ...buttonStyle,
              visibility: "hidden",
              display: isMobile ? "none" : "block",
            }}
          >
            <span style={labelStyle}>Email Notifications</span>
            <span style={descriptionStyle}>
              Receive notifications via email
            </span>
            <div style={radioContainerStyle}>
              <div style={radioGroupStyle}>
                <label style={radioLabelStyle} className="custom-radio">
                  <input
                    type="radio"
                    name="emailNotifications"
                    value="enable"
                    onChange={() => setHasNotificationChanges(true)}
                  />
                  <span className="radio-button"></span>
                  Enable
                </label>
                <label style={radioLabelStyle} className="custom-radio">
                  <input
                    type="radio"
                    name="emailNotifications"
                    value="disable"
                    defaultChecked
                    onChange={() => setHasNotificationChanges(true)}
                  />
                  <span className="radio-button"></span>
                  Disable
                </label>
              </div>
            </div>
          </button>
        </div>
      </div>

      <h1 style={titleStyle}>Integrations</h1>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: isMobile ? "nowrap" : "wrap",
          gap: "20px",
        }}
      >
        {[
          { name: "stripe", src: "/images/logostripe.png" },
          { name: "square", src: "/images/logosquare.png" },
          { name: "sumup", src: "/images/logosumup.png" },
          {
            name: "gocardless",
            src: "/images/logogocardless.png",
            label: "Business Account",
          },
        ].map((pos) => (
          <button
            key={pos.name}
            style={{
              ...buttonStyle,
              width: isMobile ? "100%" : "calc(33.33% - 14px)",
              marginBottom: "0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ ...labelStyle, marginTop: "3px" }}>
                  {pos.label ||
                    pos.name.charAt(0).toUpperCase() + pos.name.slice(1)}
                </span>
                <img
                  src={pos.src}
                  alt={`${pos.name} logo`}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginLeft: "10px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <button
                onClick={() =>
                  handlePOSConnection(
                    pos.name,
                    pos.name === "gocardless"
                      ? expensesAccessTokens[pos.name]
                      : salesAccessTokens[pos.name]
                  )
                }
                style={{
                  padding: "5px 10px",
                  backgroundColor:
                    pos.name === "gocardless"
                      ? expensesAccessTokens[pos.name]
                        ? "#ed6a5f"
                        : "#222222"
                      : salesAccessTokens[pos.name]
                      ? "#ed6a5f"
                      : "#222222",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                }}
              >
                {pos.name === "gocardless"
                  ? expensesAccessTokens[pos.name]
                    ? "Disconnect"
                    : "Connect"
                  : salesAccessTokens[pos.name]
                  ? "Disconnect"
                  : "Connect"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f1f2f3",
                padding: "5px 10px",
                borderRadius: "5px",
                width: "fit-content",
                marginTop: "10px",
              }}
            >
              <span style={descriptionStyle}>
                Status{" "}
                {pos.name === "gocardless" ? (
                  expensesAccessTokens[pos.name] ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#00d693",
                          marginRight: "2px",
                          marginBottom: "2px",
                          marginLeft: "2px",
                          verticalAlign: "middle",
                        }}
                      />
                      <span style={{ color: "#00d693" }}>Connected</span>
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#ed6a5f",
                          marginRight: "2px",
                          marginBottom: "2px",
                          marginLeft: "2px",
                          verticalAlign: "middle",
                        }}
                      />
                      <span style={{ color: "#ed6a5f" }}>Not connected</span>
                    </>
                  )
                ) : salesAccessTokens[pos.name] ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#00d693",
                        marginRight: "2px",
                        marginBottom: "2px",
                        marginLeft: "2px",
                        verticalAlign: "middle",
                      }}
                    />
                    <span style={{ color: "#00d693" }}>Connected</span>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#ed6a5f",
                        marginRight: "2px",
                        marginBottom: "2px",
                        marginLeft: "2px",
                        verticalAlign: "middle",
                      }}
                    />
                    <span style={{ color: "#ed6a5f" }}>Not connected</span>
                  </>
                )}
              </span>
            </div>
            {pos.name === "gocardless" && (
              <div style={{ width: "100%", marginTop: "10px" }}>
                <FormInput
                  label=""
                  type="select"
                  id="bankSelection"
                  value={selectedBank}
                  onChange={(e) => {
                    setSelectedBank(e.target.value);
                    setError("");
                  }}
                  required
                  hint="Select a bank"
                  options={banks}
                  style={{
                    width: "100%",
                    height: "30px",
                    fontSize: "12px",
                    fontFamily: "Inter, sans-serif",
                    padding: "0 10px",
                    color: "#606060",
                    fontWeight: 500,
                    marginBottom: "5px",
                  }}
                />
                {error && pos.name === "gocardless" && (
                  <div
                    style={{
                      color: "#D32F2F",
                      fontSize: "12px",
                      marginTop: "5px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Settings;
