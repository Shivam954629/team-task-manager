import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "28px",
              fontWeight: "800",
              color: "white",
            }}
          >
            T
          </div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "white",
              marginBottom: "8px",
            }}
          >
            TaskFlow
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px" }}>
            Manage your team's work, effortlessly
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "36px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "6px",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "28px" }}
          >
            Sign in to continue to your workspace
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                  color: "#1e293b",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#1e293b",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading
                  ? "#a5b4fc"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div
            style={{
              margin: "24px 0",
              borderTop: "1px solid #f1f5f9",
              paddingTop: "24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "14px", color: "#94a3b8" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#667eea",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Feature hints */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {["Project Management", "Task Tracking", "Team Roles"].map((f) => (
              <div
                key={f}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#667eea",
                  }}
                />
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
