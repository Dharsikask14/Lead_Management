import { Target, Trophy, UsersRound, WalletCards } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLeads } from "../api/leads.js";
import { getApiError } from "../api/http.js";
import { Layout } from "../components/Layout.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { STATUSES } from "../constants/leads.js";

export function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    setError("");
    try {
      const data = await fetchLeads({ page: 1, limit: 100 });
      setLeads(data.items);
      setTotal(data.pagination.total);
    } catch (apiError) {
      setError(getApiError(apiError));
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const metrics = useMemo(() => {
    const counts = STATUSES.reduce((next, status) => ({ ...next, [status]: 0 }), {});
    leads.forEach((lead) => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    });

    return {
      active: leads.filter((lead) => !["Won", "Lost"].includes(lead.status)).length,
      proposals: counts.Proposal || 0,
      won: counts.Won || 0
    };
  }, [leads]);

  return (
    <Layout>
      <main className="dashboard-page">
        <section className="main-hero">
          <div className="hero-copy">
            <p className="eyebrow">Lead workspace</p>
            <h1 className="animated-hero-text">
              {"Where Intuition Meets Intelligence.".split(" ").map((word, index) => (
                <span key={index} className="word" style={{ animationDelay: `${index * 0.15}s` }}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            <p>Seamlessly blend human connection with automated efficiency to maximize every single conversation.</p>
          </div>
        </section>

        {error ? <div className="alert">{error}</div> : null}

        <section className="stats-grid">
          <StatCard icon={UsersRound} label="Total leads" value={total} detail="All owned records" />
          <StatCard icon={Target} label="Active pipeline" value={metrics.active} detail="Open opportunities" tone="info" />
          <StatCard icon={WalletCards} label="Proposals" value={metrics.proposals} detail="Awaiting decision" tone="warning" />
          <StatCard icon={Trophy} label="Won" value={metrics.won} detail="Closed successfully" tone="success" />
        </section>
      </main>
    </Layout>
  );
}
