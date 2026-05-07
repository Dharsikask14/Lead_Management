import { Download, Plus, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteLead, fetchLeads } from "../api/leads.js";
import { getApiError } from "../api/http.js";
import { EmptyState } from "../components/EmptyState.jsx";
import { Layout } from "../components/Layout.jsx";
import { LeadTable } from "../components/LeadTable.jsx";
import { STATUSES } from "../constants/leads.js";

function downloadCsv(leads) {
  const headers = ["Lead Name", "Company Name", "Email", "Phone Number", "Service Interested", "Status", "Notes"];
  const rows = leads.map((lead) => [lead.leadName, lead.companyName, lead.email, lead.phoneNumber, lead.serviceInterested, lead.status, lead.notes || ""]);
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "leads.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [filters, setFilters] = useState({ q: "", status: "", page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(
    () => ({
      q: filters.q || undefined,
      status: filters.status || undefined,
      page: filters.page,
      limit: filters.limit
    }),
    [filters]
  );

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchLeads(query);
      setLeads(data.items);
      setPagination(data.pagination);
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function removeLead(lead) {
    const confirmed = window.confirm(`Delete ${lead.leadName}?`);
    if (!confirmed) return;

    setError("");
    try {
      await deleteLead(lead.id);
      await loadLeads();
    } catch (apiError) {
      setError(getApiError(apiError));
    }
  }

  return (
    <Layout>
      <main className="dashboard-page">
        <section className="page-heading row-heading">
          <div>
            <p className="eyebrow">Display leads</p>
            <h1 className="script-font">Lead records</h1>
          </div>
          <div className="page-actions">
            <Link className="button primary" to="/leads/new">
              <Plus size={18} />
              Add lead
            </Link>
          </div>
        </section>

        <section className="leads-panel">
          <div className="toolbar">
            <div className="searchbox">
              <Search size={18} />
              <input placeholder="Search leads" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value, page: 1 }))} />
            </div>

            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))}>
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button className="button secondary" onClick={() => downloadCsv(leads)} disabled={leads.length === 0}>
              <Download size={18} />
              Export CSV
            </button>
            <button className="icon-button" title="Refresh leads" onClick={loadLeads}>
              <RefreshCw size={18} />
            </button>
          </div>

          {error ? <div className="alert">{error}</div> : null}

          {!loading && leads.length === 0 ? (
            <EmptyState
              title="No leads found"
              message="Add your first lead or clear the search and status filters."
              actionLabel="Add lead"
              onAction={() => navigate("/leads/new")}
            />
          ) : (
            <LeadTable leads={leads} loading={loading} onEdit={(lead) => navigate(`/leads/${lead.id}/edit`)} onDelete={removeLead} />
          )}

          <div className="pagination">
            <button className="button secondary" disabled={pagination.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button className="button secondary" disabled={pagination.page >= pagination.pages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>
              Next
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
}
