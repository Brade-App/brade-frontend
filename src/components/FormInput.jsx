import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
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
  multiple,
  error,
  style,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionValue) => {
    const newValue =
      type === "multiselect"
        ? value.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue]
        : optionValue;
    onChange({ target: { value: newValue } });
    if (type === "select") setIsOpen(false);
  };

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
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...style,
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    maxHeight: "200px",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    border: "1px solid #efefef",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  };

  const optionStyle = {
    padding: "8px 16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  };

  const checkboxStyle = {
    marginRight: "8px",
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
      <div style={{ position: "relative" }} ref={dropdownRef}>
        {type === "select" || type === "multiselect" ? (
          <>
            <div style={inputStyle} onClick={toggleDropdown}>
              <span>
                {value && value.length > 0
                  ? type === "multiselect"
                    ? value
                        .map((v) => options.find((o) => o.value === v).label)
                        .join(", ")
                    : options.find((o) => o.value === value)?.label
                  : hint}
              </span>
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {isOpen && (
              <div style={dropdownStyle}>
                {options.map((option) => (
                  <div
                    key={option.value}
                    style={optionStyle}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {type === "multiselect" && (
                      <input
                        type="checkbox"
                        checked={value.includes(option.value)}
                        onChange={() => {}}
                        style={checkboxStyle}
                      />
                    )}
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <input
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              id={id}
              value={value}
              onChange={onChange}
              required={required}
              placeholder={hint}
              style={{
                ...inputStyle,
                paddingRight: type === "password" ? "40px" : "16px",
              }}
              {...props}
            />
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
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEyeOff />}
              </button>
            )}
          </div>
        )}
      </div>
      {error && (
        <p
          style={{
            margin: "5px 0 0",
            fontSize: "12px",
            color: "red",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
