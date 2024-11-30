import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate, // Make sure this is included if you're using it
} from "react-router-dom";
import MobileBlocker from "./components/MobileBlocker";
import SignUp from "./pages/onboarding/SignUp";
import OtpConfirmation from "./pages/onboarding/OtpConfirmation";
import BusinessInformation from "./pages/onboarding/BusinessInformation";
import LinkYourPOSAccount from "./pages/onboarding/LinkYourPOSAccount";
import AccountCreatedSuccessly from "./pages/onboarding/AccountCreatedSuccessly";
import MainMenu from "./pages/main_menu/MainMenu";
import Dashboard from "./pages/main_menu/Dashboard";
import Reports from "./pages/main_menu/Reports";
import Settings from "./pages/main_menu/Settings";
import Login from "./pages/login/Login";
import ForgetPassword from "./pages/login/ForgetPassword";
import PasswordReset from "./pages/login/PasswordReset";
import SetNewPassword from "./pages/login/SetNewPassword";
import AllDone from "./pages/login/AllDone";
import LinkYourPOS from "./pages/onboarding/LinkYourPOS";
import QueuedPOSLinks from "./pages/onboarding/QueuedPOSLinks";
import LinkBusinessBankAccount from "./pages/onboarding/LinkBusinessBankAccount";
import GoCardlessRedirect from "./pages/onboarding/GoCardlessRedirect";
import StripeRedirect from "./pages/onboarding/StripeRedirect";
import SquareRedirect from "./pages/onboarding/SquareRedirect";
import SumUpRedirect from "./pages/onboarding/SumUpRedirect";
import Profile from "./pages/main_menu/Profile"; // Import the new Profile component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp-confirmation" element={<OtpConfirmation />} />
          <Route
            path="/business-information"
            element={<BusinessInformation />}
          />
          <Route path="/link-your-pos" element={<LinkYourPOS />} />
          <Route path="/queued-pos-links" element={<QueuedPOSLinks />} />
          <Route
            path="/link-your-pos-account"
            element={<LinkYourPOSAccount />}
          />
          <Route
            path="/account-created-success"
            element={<AccountCreatedSuccessly />}
          />
          <Route
            path="/link-business-bank"
            element={<LinkBusinessBankAccount />}
          />
          <Route path="/main-menu" element={<MainMenu />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />{" "}
            {/* Add this new route */}
          </Route>
          <Route path="/" element={<Navigate replace to="/signup" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/all-done" element={<AllDone />} />
          <Route path="/gocardless-redirect" element={<GoCardlessRedirect />} />
          <Route path="/stripe-redirect" element={<StripeRedirect />} />
          <Route path="/square-redirect" element={<SquareRedirect />} />
          <Route path="/sumup-redirect" element={<SumUpRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
