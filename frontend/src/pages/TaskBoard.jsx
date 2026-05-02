import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const STATUS_COLUMNS = ["TODO", "IN_PROGRESS", "DONE"];

const statusConfig = {
  TODO: { label: "To Do", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "#fffbeb",
    color: "#d97706",
    dot: "#f59e0b",
  },
  DONE: { label: "Done", bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
};

const priorityConfig = {
  HIGH: { bg: "#fef2f2", color: "#dc2626", label: "High" },
  MEDIUM: { bg: "#fffbeb", color: "#d97706", label: "Medium" },
  LOW: { bg: "#f0fdf4", color: "#16a34a", label: "Low" },
};

const TaskBoard = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("MEMBER");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
  });

  const isAdmin = project?.members?.some(
    (m) => m.user.id === user?.id && m.role === "ADMIN",
  );

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/${projectId}/tasks`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      toast.error("Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      toast.error("Task title is required.");
      return;
    }
    setCreating(true);
    try {
      await api.post(`/${projectId}/tasks`, {
        ...taskForm,
        assigneeId: taskForm.assigneeId || undefined,
        dueDate: taskForm.dueDate || undefined,
      });
      toast.success("Task created!");
      setShowTaskModal(false);
      setTaskForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        assigneeId: "",
      });
      fetchProjectData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task.");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/${projectId}/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );
      toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/${projectId}/tasks/${taskId}`);
      toast.success("Task deleted.");
      fetchProjectData();
    } catch (err) {
      toast.error("Failed to delete task.");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) {
      toast.error("Email is required.");
      return;
    }
    try {
      await api.post(`/projects/${projectId}/members`, {
        email: memberEmail,
        role: memberRole,
      });
      toast.success("Member added!");
      setShowMemberModal(false);
      setMemberEmail("");
      fetchProjectData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member.");
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
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading project...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Project header */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <button
              onClick={() => navigate("/projects")}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "13px",
                cursor: "pointer",
                marginBottom: "8px",
                padding: 0,
              }}
            >
              ← Back to Projects
            </button>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "4px",
              }}
            >
              {project?.name}
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8" }}>
              {project?.description || "No description"}
            </p>
          </div>

          {isAdmin && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowMemberModal(true)}
                style={{
                  background: "white",
                  border: "1.5px solid #667eea",
                  color: "#667eea",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                + Add Member
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(102,126,234,0.35)",
                }}
              >
                + Add Task
              </button>
            </div>
          )}
        </div>

        {/* Members */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Team:</span>
          {project?.members?.map((m, i) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "4px 12px 4px 6px",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: `hsl(${i * 60 + 200}, 65%, 55%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                {m.user.name?.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#475569",
                  fontWeight: "500",
                }}
              >
                {m.user.name}
              </span>
              {m.role === "ADMIN" && (
                <span
                  style={{
                    fontSize: "10px",
                    color: "#667eea",
                    fontWeight: "700",
                  }}
                >
                  ADMIN
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {STATUS_COLUMNS.map((status) => {
          const config = statusConfig[status];
          const columnTasks = tasks.filter((t) => t.status === status);

          return (
            <div
              key={status}
              style={{
                background: "#f8fafc",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "16px",
                minHeight: "400px",
              }}
            >
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: config.dot,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: config.color,
                    }}
                  >
                    {config.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    background: config.bg,
                    color: config.color,
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>

              {/* Task cards */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      padding: "14px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Priority badge */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: priorityConfig[task.priority]?.bg,
                          color: priorityConfig[task.priority]?.color,
                        }}
                      >
                        {priorityConfig[task.priority]?.label}
                      </span>
                      {task.dueDate && (
                        <span
                          style={{
                            fontSize: "11px",
                            color:
                              new Date(task.dueDate) < new Date() &&
                              task.status !== "DONE"
                                ? "#ef4444"
                                : "#94a3b8",
                          }}
                        >
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Task title */}
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "6px",
                        lineHeight: "1.4",
                      }}
                    >
                      {task.title}
                    </p>

                    {/* Description */}
                    {task.description && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          marginBottom: "10px",
                          lineHeight: "1.5",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Assignee */}
                    {task.assignee && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "9px",
                            fontWeight: "700",
                            color: "white",
                          }}
                        >
                          {task.assignee.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {task.assignee.name}
                        </span>
                      </div>
                    )}

                    {/* Move buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginTop: "10px",
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "10px",
                      }}
                    >
                      {STATUS_COLUMNS.filter((s) => s !== status).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(task.id, s)}
                          style={{
                            fontSize: "11px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: "#f1f5f9",
                            color: "#64748b",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                          }}
                        >
                          → {statusConfig[s].label}
                        </button>
                      ))}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          style={{
                            fontSize: "11px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: "#fef2f2",
                            color: "#ef4444",
                            border: "none",
                            cursor: "pointer",
                            marginLeft: "auto",
                            fontWeight: "500",
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px 16px",
                      color: "#cbd5e1",
                      fontSize: "13px",
                    }}
                  >
                    No tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
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
              maxWidth: "480px",
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
              Create New Task
            </h3>
            <form onSubmit={handleCreateTask}>
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
                  Title *
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  placeholder="e.g. Design homepage"
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
                  Description
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  placeholder="Optional details..."
                  rows={2}
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, priority: e.target.value })
                    }
                    style={{
                      width: "100%",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, dueDate: e.target.value })
                    }
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
                  Assign To
                </label>
                <select
                  value={taskForm.assigneeId}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, assigneeId: e.target.value })
                  }
                  style={{
                    width: "100%",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Unassigned</option>
                  {project?.members?.map((m) => (
                    <option key={m.user.id} value={m.user.id}>
                      {m.user.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
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
                  {creating ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
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
              maxWidth: "400px",
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
              Add Team Member
            </h3>
            <form onSubmit={handleAddMember}>
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
                  Member Email *
                </label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="member@example.com"
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
                  Role
                </label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
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
                  }}
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
