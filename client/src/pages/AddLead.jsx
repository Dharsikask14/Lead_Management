import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createLead, fetchLead, updateLead } from "../api/leads.js";
import { getApiError } from "../api/http.js";
import { Layout } from "../components/Layout.jsx";
import { LeadForm } from "../components/LeadForm.jsx";

export function AddLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!id) {
      setLead(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    fetchLead(id)
      .then((currentLead) => {
        if (active) setLead(currentLead);
      })
      .catch((apiError) => {
        if (active) setError(getApiError(apiError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function saveLead(payload) {
    setSaving(true);
    setError("");

    try {
      if (id) {
        await updateLead(id, payload);
      } else {
        await createLead(payload);
      }
      navigate("/leads");
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <main className="dashboard-page narrow-page">
        <section className="page-heading">
          <div>
            <p className="eyebrow">{id ? "Edit lead" : "Add lead"}</p>
            <h1 className="script-font">{id ? "Update lead details" : "Lead details"}</h1>
          </div>
        </section>

        {error ? <div className="alert">{error}</div> : null}
        {loading ? <div className="panel-loader">Loading lead...</div> : <LeadForm editingLead={lead} onCancel={() => navigate("/leads")} onSubmit={saveLead} busy={saving} />}
      </main>
    </Layout>
  );
}
