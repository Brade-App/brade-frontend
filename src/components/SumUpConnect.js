import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SumUpConnect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const htmlContent = location.state?.htmlContent;

  if (!htmlContent) {
    return (
      <div>
        <h1>Error: No SumUp content available</h1>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Connect Your SumUp Account</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default SumUpConnect;
