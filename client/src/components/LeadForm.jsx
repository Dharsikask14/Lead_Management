import { ClipboardList, Save, X } from "lucide-react";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { SERVICES, STATUSES } from "../constants/leads.js";

const emptyLead = {
  leadName: "",
  companyName: "",
  email: "",
  phoneNumber: "",
  serviceInterested: "",
  status: "New",
  notes: ""
};

function validate(values) {
  const errors = {};

  if (!values.leadName.trim()) errors.leadName = "Lead name is required";
  if (!values.companyName.trim()) errors.companyName = "Company name is required";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Valid email is required";
  if (!/^[+()\-\s\d.]{7,30}$/.test(values.phoneNumber)) errors.phoneNumber = "Valid phone number is required";
  if (!values.serviceInterested.trim()) errors.serviceInterested = "Service is required";

  return errors;
}

export const LeadForm = forwardRef(function LeadForm({ editingLead, onCancel, onSubmit, busy, resetSignal }, ref) {
  const [values, setValues] = useState(emptyLead);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setValues(editingLead || emptyLead);
    setTouched({});
  }, [editingLead, resetSignal]);

  const errors = useMemo(() => validate(values), [values]);
  const isInvalid = Object.keys(errors).length > 0;

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setTouched(Object.keys(values).reduce((next, key) => ({ ...next, [key]: true }), {}));

    if (!isInvalid) {
      onSubmit(values);
    }
  }

  return (
    <form className="lead-form" id="lead-form" ref={ref} onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="form-title-row">
          <span className="section-icon">
            <ClipboardList size={19} />
          </span>
          <div>
            <h2>{editingLead ? "Edit lead" : "Add lead"}</h2>
            <p className="muted">{editingLead ? "Keep this opportunity current." : "Capture qualification details clearly."}</p>
          </div>
        </div>
        {editingLead ? (
          <button type="button" className="icon-button" title="Cancel editing" onClick={onCancel}>
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="field-grid">
        <label className="form-field">
          Lead Name
          <input name="leadName" placeholder="Anika Sharma" value={values.leadName} onBlur={() => setTouched((t) => ({ ...t, leadName: true }))} onChange={updateField} />
          {touched.leadName && errors.leadName ? <span>{errors.leadName}</span> : null}
        </label>

        <label className="form-field">
          Company Name
          <input name="companyName" placeholder="Northstar Labs" value={values.companyName} onBlur={() => setTouched((t) => ({ ...t, companyName: true }))} onChange={updateField} />
          {touched.companyName && errors.companyName ? <span>{errors.companyName}</span> : null}
        </label>

        <label className="form-field">
          Email
          <input name="email" type="email" placeholder="lead@company.com" value={values.email} onBlur={() => setTouched((t) => ({ ...t, email: true }))} onChange={updateField} />
          {touched.email && errors.email ? <span>{errors.email}</span> : null}
        </label>

        <label className="form-field">
          Phone Number
          <input name="phoneNumber" placeholder="+91 98765 43210" value={values.phoneNumber} onBlur={() => setTouched((t) => ({ ...t, phoneNumber: true }))} onChange={updateField} />
          {touched.phoneNumber && errors.phoneNumber ? <span>{errors.phoneNumber}</span> : null}
        </label>

        <label className="form-field">
          Service Interested
          <select
            name="serviceInterested"
            value={values.serviceInterested}
            onBlur={() => setTouched((t) => ({ ...t, serviceInterested: true }))}
            onChange={updateField}
          >
            <option value="" disabled>Select a service</option>
            {SERVICES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {touched.serviceInterested && errors.serviceInterested ? <span>{errors.serviceInterested}</span> : null}
        </label>

        <label className="form-field">
          Status
          <select name="status" value={values.status} onChange={updateField}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-field notes-field">
        Notes
        <textarea name="notes" rows="4" placeholder="Add context, next steps, budget notes, or follow-up timing." value={values.notes || ""} onChange={updateField} />
      </label>

      <div className="form-actions">
        {editingLead ? (
          <button className="button secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button className="button primary" type="submit" disabled={busy || isInvalid}>
          <Save size={18} />
          {busy ? "Saving..." : editingLead ? "Save changes" : "Create lead"}
        </button>
      </div>
    </form>
  );
});
