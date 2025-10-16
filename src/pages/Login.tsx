import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:5000";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Registration successful! Please log in.");
        setRegisterMode(false);
        setUsername("");
        setPassword("");
        setName("");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 animate-fade-in">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 shadow-[var(--hero-shadow)]">
            <Activity className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {registerMode ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {registerMode ? "Join to save and view your diagnosis history" : "Sign in to continue your diagnosis journey"}
          </p>
        </div>

        <form onSubmit={registerMode ? handleRegister : handleLogin} className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-lg shadow-[var(--card-shadow)] p-6 space-y-5 animate-scale-in">
          {error && <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}
          {success && <div className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">{success}</div>}

          {registerMode && (
            <div>
              <label className="block mb-1 text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-border/70 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium text-foreground">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-border/70 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border/70 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
              placeholder="Enter password"
              required
              autoComplete={registerMode ? "new-password" : "current-password"}
            />
          </div>

          <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-md hover:bg-primary-hover transition-colors font-semibold disabled:opacity-60" disabled={loading}>
            {loading ? "Please wait..." : registerMode ? "Create account" : "Login"}
          </button>

          <div className="text-center text-sm text-muted-foreground">
            {registerMode ? (
              <span>
                Already have an account?{' '}
                <button type="button" className="text-primary underline" onClick={() => { setRegisterMode(false); setError(""); setSuccess(""); }}>
                  Login
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button type="button" className="text-primary underline" onClick={() => { setRegisterMode(true); setError(""); setSuccess(""); }}>
                  Create one
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
