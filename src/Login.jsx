import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Api from "./services/api";
import { useSnackbar } from "notistack";
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let navigate = useNavigate();
  let { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    try {
      let res = await Api.post("/auth/login", data);
      // if (res?.token) {
      //   localStorage.setItem("token", res?.token);
      // }
      navigate("/");
    } catch (e) {
      console.log(e.message, "dhhej");
      enqueueSnackbar(
        e?.response ? e?.response?.data?.message : "Unautorized",
        {
          variant: "error",
        }
      );
      console.log(e);
    }
  };

  const getUsers = async () => {
    try {
      await Api.get("/auth/users");
    } catch (e) {
      console.log(e.message, "dhhej");
      enqueueSnackbar(
        e?.response ? e?.response?.data?.message : "Unautorized",
        {
          variant: "error",
        }
      );
      console.log(e);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

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
        </form>
      </div>
    </div>
  );
}
