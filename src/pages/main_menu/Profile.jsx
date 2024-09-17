import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlinePencil, HiOutlineCamera } from "react-icons/hi";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || {});
  const [profilePhoto, setProfilePhoto] = useState(
    user.profilePhoto || "/images/profileplaceholder.png"
  );
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [personalError, setPersonalError] = useState("");
  const [personalSuccess, setPersonalSuccess] = useState("");
  const [businessError, setBusinessError] = useState("");
  const [businessSuccess, setBusinessSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [originalUser, setOriginalUser] = useState({});
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
      setOriginalUser(location.state.user);
    } else {
      navigate("/main-menu");
    }
  }, [location.state, navigate]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    const userId = localStorage.getItem("id");
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!userId || !access_token || !refresh_token) {
      console.error("User ID or access token not found in local storage");
      return;
    }

    try {
      if (isEditingPersonal) {
        setPersonalError("");
        setPersonalSuccess("");
        try {
          const personalResponse = await axios.post(
            "/api/database/update-personal-info",
            {
              id: userId,
              details: {
                full_name: document.getElementById("fullName").value,
              },
            }
          );
          console.log("Personal information updated:", personalResponse.data);

          const newEmail = document.getElementById("email").value;
          let emailChanged = false;
          if (newEmail !== user.email) {
            const emailResponse = await fetch("/api/database/update-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${access_token}`,
              },
              body: JSON.stringify({
                id: userId,
                email: newEmail,
                refresh_token: refresh_token,
              }),
            });

            const emailData = await emailResponse.json();

            if (!emailResponse.ok) {
              throw new Error(emailData.error || "Failed to update email");
            }

            console.log("Email updated:", emailData);
            emailChanged = true;
          }

          setPersonalSuccess(
            emailChanged
              ? "Please check your inbox to confirm your new email address"
              : "Personal information updated successfully"
          );
        } catch (error) {
          console.error("Error updating personal information:", error);
          setPersonalError(
            error.response?.data?.error ||
              error.message ||
              "Failed to update personal information. Please try again."
          );
          handleCancelPersonal(); // Revert to original values
          return; // Exit the function to prevent further updates
        }
      }

      if (isEditingBusiness) {
        setBusinessError("");
        setBusinessSuccess("");
        try {
          const businessResponse = await axios.post(
            "/api/database/update-business-info",
            {
              id: userId,
              details: {
                salon_name: document.getElementById("salonName").value,
                business_address:
                  document.getElementById("businessAddress").value,
                postcode: document.getElementById("postcode").value,
                state: document.getElementById("state").value,
                country: document.getElementById("country").value,
              },
            }
          );
          console.log("Business information updated:", businessResponse.data);
          setBusinessSuccess("Business information updated successfully");
        } catch (error) {
          console.error("Error updating business information:", error);
          setBusinessError(
            error.response?.data?.error ||
              error.message ||
              "Failed to update business information. Please try again."
          );
          handleCancelBusiness(); // Revert to original values
          return; // Exit the function to prevent further updates
        }
      }

      if (isEditingPassword) {
        setPasswordError("");
        setPasswordSuccess("");
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword =
          document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
          setPasswordError("Passwords do not match");
          return;
        }

        try {
          const passwordResponse = await axios.post(
            "/api/database/update-password",
            {
              id: userId,
              new_password: newPassword,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          console.log("Password updated:", passwordResponse.data);
          setPasswordSuccess("Password updated successfully");
        } catch (error) {
          console.error("Error updating password:", error);
          setPasswordError(
            error.response?.data?.error ||
              error.message ||
              "Failed to update password. Please try again."
          );
          return;
        }
      }

      setIsEditingPersonal(false);
      setIsEditingBusiness(false);
      setIsEditingPassword(false);
      setHasChanges(false);

      // Update the user state with the new values
      setUser((prevUser) => ({
        ...prevUser,
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        profilePhoto: profilePhoto,
        salonName: document.getElementById("salonName").value,
        businessAddress: document.getElementById("businessAddress").value,
        postcode: document.getElementById("postcode").value,
        state: document.getElementById("state").value,
        country: document.getElementById("country").value,
      }));

      // Update the originalUser state with the new values
      setOriginalUser((prevUser) => ({
        ...prevUser,
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        profilePhoto: profilePhoto,
        salonName: document.getElementById("salonName").value,
        businessAddress: document.getElementById("businessAddress").value,
        postcode: document.getElementById("postcode").value,
        state: document.getElementById("state").value,
        country: document.getElementById("country").value,
      }));

      console.log("Changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleCancelPersonal = () => {
    setIsEditingPersonal(false);
    document.getElementById("fullName").value = originalUser.fullName;
    document.getElementById("email").value = originalUser.email;
    setProfilePhoto(originalUser.profilePhoto);
    setHasChanges(false);
  };

  const handleCancelBusiness = () => {
    setIsEditingBusiness(false);
    document.getElementById("salonName").value = originalUser.salonName;
    document.getElementById("businessAddress").value =
      originalUser.businessAddress;
    document.getElementById("postcode").value = originalUser.postcode;
    document.getElementById("state").value = originalUser.state;
    document.getElementById("country").value = originalUser.country;
    setHasChanges(false);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!access_token || !refresh_token) {
      console.error("Access token or refresh token not found in local storage");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post("/api/signout_user", {
        refresh_token: refresh_token,
        access_token: access_token,
      });

      if (response.status === 200) {
        // Clear local storage
        localStorage.clear();

        // Navigate to login page
        navigate("/login");
      } else {
        console.error("Logout failed:", response.data);
        // Handle logout failure (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <div style={{ margin: "0 auto", position: "relative", minHeight: "100vh" }}>
      <h1 style={titleStyle}>My Profile</h1>

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Personal Information</h2>
          <button
            onClick={() =>
              isEditingPersonal
                ? handleCancelPersonal()
                : setIsEditingPersonal(true)
            }
            style={editButtonStyle}
          >
            <HiOutlinePencil /> {isEditingPersonal ? "Cancel" : "Edit"}
          </button>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={profilePhoto}
            alt="Profile"
            style={profilePhotoStyle}
            onClick={() => document.getElementById("photoInput").click()}
          />
          <div style={{ marginLeft: "20px", flex: 1 }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input
                id="fullName"
                type="text"
                defaultValue={user.fullName}
                style={inputStyle}
                disabled={!isEditingPersonal}
                placeholder="e.g John Doe"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                id="email"
                type="email"
                defaultValue={user.email}
                style={inputStyle}
                disabled={!isEditingPersonal}
                placeholder="e.g john@example.com"
              />
            </div>
          </div>
          <input
            id="photoInput"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />
        </div>
        {personalError && <p style={errorMessageStyle}>{personalError}</p>}
        {personalSuccess && (
          <p style={successMessageStyle}>{personalSuccess}</p>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Business Information</h2>
          <button
            onClick={() =>
              isEditingBusiness
                ? handleCancelBusiness()
                : setIsEditingBusiness(true)
            }
            style={editButtonStyle}
          >
            <HiOutlinePencil /> {isEditingBusiness ? "Cancel" : "Edit"}
          </button>
        </div>
        <div style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Salon Name</label>
            <input
              id="salonName"
              type="text"
              defaultValue={user.salonName}
              style={inputStyle}
              disabled={!isEditingBusiness}
              placeholder="e.g Heavens Salon"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Business Address</label>
            <input
              id="businessAddress"
              type="text"
              defaultValue={user.businessAddress}
              style={inputStyle}
              disabled={!isEditingBusiness}
              placeholder="e.g 10 Alex Avenue"
            />
          </div>
          <div style={formRowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Postcode</label>
              <input
                id="postcode"
                type="text"
                defaultValue={user.postcode}
                style={inputStyle}
                disabled={!isEditingBusiness}
                placeholder="e.g 101 020"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>State</label>
              <select
                id="state"
                style={inputStyle}
                disabled={!isEditingBusiness}
                defaultValue={user.state}
              >
                <option value="England">England</option>
                <option value="Scotland">Scotland</option>
                <option value="Wales">Wales</option>
                <option value="Northern Ireland">Northern Ireland</option>
              </select>
            </div>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Country</label>
            <select
              id="country"
              style={inputStyle}
              disabled={!isEditingBusiness}
              defaultValue={user.country}
            >
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
        </div>
        {businessError && <p style={errorMessageStyle}>{businessError}</p>}
        {businessSuccess && (
          <p style={successMessageStyle}>{businessSuccess}</p>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Change Password</h2>
          <button
            onClick={() => setIsEditingPassword(!isEditingPassword)}
            style={editButtonStyle}
          >
            <HiOutlinePencil /> {isEditingPassword ? "Cancel" : "Edit"}
          </button>
        </div>
        <div style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              style={inputStyle}
              disabled={!isEditingPassword}
            />
          </div>
          <div style={{ ...formGroupStyle, marginTop: "10px" }}>
            <label style={labelStyle}>Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              style={inputStyle}
              disabled={!isEditingPassword}
            />
          </div>
        </div>
        {passwordError && <p style={errorMessageStyle}>{passwordError}</p>}
        {passwordSuccess && (
          <p style={successMessageStyle}>{passwordSuccess}</p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
        }}
      >
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
        {(isEditingPersonal ||
          isEditingBusiness ||
          isEditingPassword ||
          hasChanges) && (
          <button onClick={handleSaveChanges} style={saveButtonStyle}>
            Save changes
          </button>
        )}
      </div>

      {showLogoutDialog && (
        <div style={dialogOverlayStyle}>
          <div style={dialogBoxStyle}>
            <h2 style={dialogTitleStyle}>Logout</h2>
            <p style={dialogMessageStyle}>Are you sure you want to sign out?</p>
            <div style={dialogButtonContainerStyle}>
              <button onClick={cancelLogout} style={dialogCancelButtonStyle}>
                Cancel
              </button>
              <button onClick={confirmLogout} style={dialogConfirmButtonStyle}>
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const titleStyle = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  fontSize: "18px",
  color: "#222222",
  marginBottom: "20px",
};

const sectionStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #efefef",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  width: "100%",
  boxSizing: "border-box",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const sectionTitleStyle = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  color: "#222222",
};

const profilePhotoStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
};

const nameStyle = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  fontSize: "18px",
  color: "#222222",
  margin: 0,
};

const roleStyle = {
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  color: "#5c5c5c",
  margin: "5px 0 0 0",
};

const changePhotoButtonStyle = {
  backgroundColor: "#ffffff",
  color: "#222222",
  border: "0.6px solid #606060",
  borderRadius: "100px",
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px", // Reduced from 20px
};

const formRowStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  flexWrap: "wrap",
};

const formGroupStyle = {
  flex: "1 1 20px",
  display: "flex",
  flexDirection: "column",
  marginBottom: "10px",
};

const labelStyle = {
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  color: "#5c5c5c",
  marginBottom: "5px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #efefef",
  fontSize: "14px",
  fontFamily: "Inter, sans-serif",
};

const editButtonStyle = {
  backgroundColor: "#ffffff",
  color: "#222222",
  border: "0.6px solid #606060",
  borderRadius: "100px",
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const logoutButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#f1f2f3",
  color: "#222222",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  fontFamily: "Inter, sans-serif",
  cursor: "pointer",
};

const saveButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#f564a9",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  fontFamily: "Inter, sans-serif",
  cursor: "pointer",
};

const errorMessageStyle = {
  color: "#ff0000",
  fontSize: "14px",
  marginTop: "10px",
};

const successMessageStyle = {
  color: "#008000",
  fontSize: "14px",
  marginTop: "10px",
};

const dialogOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(5px)",
};

const dialogBoxStyle = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  maxWidth: "300px",
  width: "100%",
  textAlign: "center",
};

const dialogTitleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "12px",
  color: "#333",
};

const dialogMessageStyle = {
  fontSize: "14px",
  marginBottom: "24px",
  color: "#666",
};

const dialogButtonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const dialogButtonBaseStyle = {
  padding: "10px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.2s",
  border: "none",
  width: "48%",
};

const dialogCancelButtonStyle = {
  ...dialogButtonBaseStyle,
  backgroundColor: "#f0f0f0",
  color: "#333",
};

const dialogConfirmButtonStyle = {
  ...dialogButtonBaseStyle,
  backgroundColor: "#ff4d4f",
  color: "#fff",
};

export default Profile;
