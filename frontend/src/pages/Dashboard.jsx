import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Projects",
      value: stats?.totalProjects ?? 0,
      bg: "#eff6ff",
      color: "#2563eb",
      icon: "📁",
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      bg: "#f0fdf4",
      color: "#16a34a",
      icon: "✅",
    },
    {
      label: "To Do",
      value: stats?.todo ?? 0,
      bg: "#fefce8",
      color: "#ca8a04",
      icon: "📋",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      bg: "#fff7ed",
      color: "#ea580c",
      icon: "⚡",
    },
    {
      label: "Completed",
      value: stats?.done ?? 0,
      bg: "#f0fdf4",
      color: "#15803d",
      icon: "🎯",
    },
    {
      label: "Overdue",
      value: stats?.overdue ?? 0,
      bg: "#fef2f2",
      color: "#dc2626",
      icon: "⚠️",
    },
  ];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Page header */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "6px",
          }}
        >
          Dashboard
        </h2>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          Overview of all your projects and tasks
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: card.bg,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${card.color}22`,
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>
              {card.icon}
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: card.color,
                lineHeight: 1,
              }}
            >
              {card.value}
            </div>
            <div
              style={{ fontSize: "13px", color: "#64748b", marginTop: "6px" }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* My pending tasks */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
            My Pending Tasks
          </h3>
          <Link
            to="/projects"
            style={{
              fontSize: "13px",
              color: "#667eea",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            View Projects →
          </Link>
        </div>

        {stats?.myTasks?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              No pending tasks! You are all caught up.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {stats?.myTasks?.map((task) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1e293b",
                      marginBottom: "3px",
                    }}
                  >
                    {task.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {task.project?.name}
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background:
                        task.priority === "HIGH"
                          ? "#fef2f2"
                          : task.priority === "MEDIUM"
                            ? "#fefce8"
                            : "#f0fdf4",
                      color:
                        task.priority === "HIGH"
                          ? "#dc2626"
                          : task.priority === "MEDIUM"
                            ? "#ca8a04"
                            : "#16a34a",
                    }}
                  >
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
