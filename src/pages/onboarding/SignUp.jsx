import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormInput from "../../components/FormInput";
import SplashPage from "../../components/SplashPage";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // New state for password requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  // New state to track if user has started typing
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Check password requirements
  useEffect(() => {
    // Simulate loading time (remove this in production)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 7 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate full name
    if (!fullName.trim()) {
      setError("Full Name is required");
      return;
    }

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password requirements
    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError("Password does not meet all requirements");
      return;
    }

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post("/api/signup_user", {
        email: email,
        password: password,
        options: { data: { full_name: fullName } },
      });
      console.log(response.data);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("email", email);
      navigate("/otp-confirmation", { state: { email } });
    } catch (error) {
      console.error("Error signing up:", error);
      setError(
        error.response?.data?.error ||
          "An error occurred during sign up. Please try again."
      );
    }
  };

  const handleContinue = () => {
    navigate("/next-step");
  };

  const RequirementBox = ({ met, text }) => (
    <div
      style={{
        display: "inline-block",
        marginRight: "10px",
        borderRadius: "100px",
        backgroundColor: hasStartedTyping
          ? met
            ? "#34c759"
            : "#ff3b30"
          : "#f2f2f2",
        color: hasStartedTyping ? "white" : "#606060",
      }}
    >
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          whiteSpace: "nowrap",
          padding: "10px 14px",
        }}
      >
        {text}
      </span>
    </div>
  );

  if (isLoading) {
    return <SplashPage />;
  }

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
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="/images/logoblack.png"
            alt="Company Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "24px",
            color: "#222222",
          }}
        >
          Sign Up
        </h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <FormInput
            label="Full Name"
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            hint="e.g John Doe"
          />
          <FormInput
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            hint="name@email.com"
          />
          <FormInput
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setHasStartedTyping(true);
            }}
            required
            hint="Enter Password"
          />
          <FormInput
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            hint="Enter Password Again"
          />
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              <RequirementBox
                met={passwordRequirements.length}
                text="7-16 characters"
              />
              <RequirementBox
                met={passwordRequirements.uppercase}
                text="1 uppercase"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RequirementBox
                met={passwordRequirements.lowercase}
                text="1 lowercase"
              />
              <RequirementBox
                met={passwordRequirements.number}
                text="1 number"
              />
            </div>
          </div>
        </form>
        <div style={{ width: "100%", marginTop: "20px" }}>
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              width: "100%",
              height: "52px",
              backgroundColor: "#f564a9",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Continue
          </button>
        </div>
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          <span
            style={{
              color: "#5c5c5c",
              fontWeight: 500,
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Already have an account?{" "}
          </span>
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#f564a9",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
