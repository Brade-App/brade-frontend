import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StripeFinancialConnect from "./components/StripeFinancialConnect";
import TransactionHistory from "./components/TransactionHistory";
import SuccessPage from "./components/SuccessPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StripeFinancialConnect />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
