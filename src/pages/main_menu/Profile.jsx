import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlinePencil, HiOutlineCamera } from "react-icons/hi";

const Profile = () => {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(
    "/images/profileplaceholder.png"
  );
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  const handleSaveChanges = () => {
    // Implement save changes functionality
    console.log("Changes saved");
    setIsEditingPersonal(false);
    setIsEditingBusiness(false);
    setIsEditingPassword(false);
    setHasChanges(false);
  };

  const handleLogout = () => {
    // Implement logout functionality
    navigate("/login");
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <h1 style={titleStyle}>My Profile</h1>

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Personal Information</h2>
          <button
            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
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
                type="text"
                defaultValue="Hair Force one"
                style={inputStyle}
                disabled={!isEditingPersonal}
                placeholder="e.g John Doe"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                defaultValue="hairforceone@example.com"
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
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Business Information</h2>
          <button
            onClick={() => setIsEditingBusiness(!isEditingBusiness)}
            style={editButtonStyle}
          >
            <HiOutlinePencil /> {isEditingBusiness ? "Cancel" : "Edit"}
          </button>
        </div>
        <div style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Salon Name</label>
            <input
              type="text"
              defaultValue="Heavens Salon"
              style={inputStyle}
              disabled={!isEditingBusiness}
              placeholder="e.g Heavens Salon"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Business Address</label>
            <input
              type="text"
              defaultValue="10 Alex Avenue"
              style={inputStyle}
              disabled={!isEditingBusiness}
              placeholder="e.g 10 Alex Avenue"
            />
          </div>
          <div style={formRowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Postcode</label>
              <input
                type="text"
                defaultValue="101 020"
                style={inputStyle}
                disabled={!isEditingBusiness}
                placeholder="e.g 101 020"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>State</label>
              <select
                style={inputStyle}
                disabled={!isEditingBusiness}
                defaultValue="England"
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
              style={inputStyle}
              disabled={!isEditingBusiness}
              defaultValue="United Kingdom"
            >
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
        </div>
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
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              style={inputStyle}
              disabled={!isEditingPassword}
            />
          </div>
          <div style={{ ...formGroupStyle, marginTop: "10px" }}>
            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              style={inputStyle}
              disabled={!isEditingPassword}
            />
          </div>
        </div>
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

export default Profile;
