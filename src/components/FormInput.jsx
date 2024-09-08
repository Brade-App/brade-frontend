import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const FormInput = ({
  label,
  type,
  id,
  value,
  onChange,
  required,
  hint,
  options,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputStyle = {
    width: "100%",
    height: "52px",
    padding: "0 16px",
    borderRadius: "8px",
    border: "1px solid #efefef",
    boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "400",
    color: "#606060",
    backgroundColor: "#f2f2f2",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage:
      "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23606060%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 16px top 50%",
    backgroundSize: "12px auto",
    paddingRight: "48px",
  };

  return (
    <div style={{ marginBottom: "15px", textAlign: "left" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "5px",
          fontWeight: "500",
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          color: "#606060",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {type === "select" ? (
          <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            style={selectStyle}
          >
            <option value="" disabled>
              {hint}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={hint}
            style={inputStyle}
          />
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            {showPassword ? (
              <FiEyeOff size={20} color="#606060" />
            ) : (
              <FiEye size={20} color="#606060" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;
