import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, History as HistoryIcon } from "lucide-react";

const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not logged in");
          setLoading(false);
          return;
        }
        const BASE_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:5000";
        const response = await fetch(`${BASE_URL}/api/history`, {
          headers: { Authorization: token }
        });
        const data = await response.json();
        if (data.success) {
          setHistory(data.history);
        } else {
          setError(data.error || "Failed to fetch history");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 shadow-[var(--hero-shadow)]">
            <HistoryIcon className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Diagnosis History</h1>
          <p className="text-muted-foreground mt-1">Review your previous analysis results</p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-lg shadow-[var(--card-shadow)] p-6 animate-scale-in">
          {loading && (
            <div className="flex items-center justify-center gap-3 text-muted-foreground py-8">
              <Activity className="w-5 h-5 animate-pulse" /> Loading history...
            </div>
          )}
          {error && <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}
          {!loading && !error && history.length === 0 && (
            <div className="text-muted-foreground">No previous results found.</div>
          )}

          <ul className="space-y-4">
            {history.map((entry, idx) => (
              <li key={idx} className="p-4 rounded-lg border border-border/60 bg-background/60">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-foreground">{entry.most_probable_disease}</div>
                  <div className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleString()}</div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div><span className="font-medium text-foreground">Probability:</span> {(() => {
                    const raw = Number(entry.most_probable_probability || 0);
                    const pct = raw <= 1 ? raw * 100 : raw;
                    return `${pct.toFixed(2)}%`;
                  })()}</div>
                  <div className="mt-1"><span className="font-medium text-foreground">Symptoms:</span> {Object.entries(entry.symptoms || {}).map(([k,v]) => `${k} (${v})`).join(", ")}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary-hover" onClick={() => navigate("/")}>Return to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
