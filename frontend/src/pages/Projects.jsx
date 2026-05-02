import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required.");
      return;
    }
    setCreating(true);
    try {
      await api.post("/projects", formData);
      toast.success("Project created!");
      setShowModal(false);
      setFormData({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      toast.success("Project deleted.");
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project.");
    }
  };

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
          Loading projects...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "6px",
            }}
          >
            Projects
          </h2>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Manage your projects and teams
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
          }}
        >
          + New Project
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "white",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>📂</div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            No projects yet
          </h3>
          <p
            style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "24px" }}
          >
            Create your first project to get started
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "12px 28px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create Project
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {projects.map((project) => {
            const totalTasks = project.tasks?.length || 0;
            const doneTasks =
              project.tasks?.filter((t) => t.status === "DONE").length || 0;
            const progress =
              totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

            return (
              <div
                key={project.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "all 0.2s",
                  cursor: "default",
                }}
              >
                {/* Project header */}
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        marginBottom: "12px",
                      }}
                    >
                      📁
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: "#eff6ff",
                        color: "#2563eb",
                      }}
                    >
                      {project.members?.length} member
                      {project.members?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#1e293b",
                      marginBottom: "6px",
                    }}
                  >
                    {project.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#94a3b8",
                      lineHeight: "1.5",
                    }}
                  >
                    {project.description || "No description provided."}
                  </p>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      {doneTasks}/{totalTasks} tasks done
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#667eea",
                      }}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#f1f5f9",
                      borderRadius: "999px",
                      height: "6px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        height: "6px",
                        borderRadius: "999px",
                        width: `${progress}%`,
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>

                {/* Members avatars */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "20px",
                  }}
                >
                  {project.members?.slice(0, 4).map((m, i) => (
                    <div
                      key={m.id}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: `hsl(${i * 60 + 200}, 70%, 55%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "white",
                        border: "2px solid white",
                        marginLeft: i > 0 ? "-8px" : "0",
                      }}
                    >
                      {m.user.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project.members?.length > 4 && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginLeft: "4px",
                      }}
                    >
                      +{project.members.length - 4} more
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    style={{
                      flex: 1,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Open Project
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    style={{
                      background: "#fef2f2",
                      color: "#ef4444",
                      border: "1px solid #fecaca",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "460px",
              padding: "32px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "24px",
              }}
            >
              Create New Project
            </h3>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Website Redesign"
                  style={{
                    width: "100%",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
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
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What is this project about?"
                  rows={3}
                  style={{
                    width: "100%",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    border: "1.5px solid #e2e8f0",
                    background: "white",
                    color: "#64748b",
                    padding: "12px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 1,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    opacity: creating ? 0.7 : 1,
                  }}
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
