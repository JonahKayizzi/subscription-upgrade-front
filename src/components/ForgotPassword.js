import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../api/apiSlice";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, isSuccess, error }] =
    useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await forgotPassword({ email: email.trim() }).unwrap();
    } catch (err) {
      // Error message shown via error state
    }
  };

  return (
    <div
      className="app-landing"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 420, width: "100%" }}>
        <h2
          style={{
            marginBottom: 8,
            color: "#0f172a",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          Forgot password
        </h2>
        <p
          style={{
            marginBottom: 24,
            color: "#475569",
            fontSize: "0.95rem",
            lineHeight: 1.5,
          }}
        >
          Enter your email and we’ll send you a link to reset your password.
        </p>
        {isSuccess ? (
          <div
            style={{
              padding: 16,
              background: "rgba(16, 185, 129, 0.15)",
              borderRadius: 8,
              marginBottom: 16,
              color: "#047857",
              fontWeight: 500,
            }}
          >
            Check your inbox. If an account exists for that email, you’ll
            receive a password reset link shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-auth">
            <div className="form-field">
              <label
                htmlFor="forgot-email"
                className="form-label"
                style={{ color: "#334155", fontWeight: 600 }}
              >
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="form-input"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-auth">
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
            {error && (
              <div
                className="error-message"
                style={{ marginTop: 12, color: "#b91c1c" }}
              >
                {error.data?.error || "Something went wrong. Please try again."}
              </div>
            )}
          </form>
        )}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link
            to="/"
            style={{
              color: "#2563eb",
              fontSize: "0.95rem",
              fontWeight: 500,
              textDecoration: "underline",
            }}
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
