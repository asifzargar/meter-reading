import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Login.css";
import EmailJSON from "./email.json";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const onSubmit = (data) => {
    if (
      EmailJSON.find((val) => val.email === data.email) &&
      EmailJSON.find((val) => val.password === data.password)
    ) {
      localStorage.setItem("authTokenPassword", `${data.password}`);
      navigate("/meter-edit");
    } else {
      setError("Email password incorrect");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="login-button">
            Login
          </button>

          {error ? (
            <p className="error-text" style={{ textAlign: "center" }}>
              {error}
            </p>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
}
