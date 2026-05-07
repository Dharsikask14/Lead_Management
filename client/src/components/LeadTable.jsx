import { Edit3, Mail, Phone, Trash2 } from "lucide-react";

const statusClass = {
  New: "new",
  Contacted: "contacted",
  Qualified: "qualified",
  Proposal: "proposal",
  Won: "won",
  Lost: "lost"
};

export function LeadTable({ leads, loading, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="table-state">
                Loading leads...
              </td>
            </tr>
          ) : leads.length === 0 ? (
            <tr>
              <td colSpan="8" className="table-state">
                No leads found.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong className="lead-name">{lead.leadName}</strong>
                </td>
                <td>{lead.companyName}</td>
                <td>
                  <a className="table-link" href={`mailto:${lead.email}`}>
                    <Mail size={14} />
                    {lead.email}
                  </a>
                </td>
                <td>
                  <a className="table-link" href={`tel:${lead.phoneNumber}`}>
                    <Phone size={14} />
                    {lead.phoneNumber}
                  </a>
                </td>
                <td>{lead.serviceInterested}</td>
                <td>
                  <span className={`status ${statusClass[lead.status]}`}>{lead.status}</span>
                </td>
                <td className="notes-cell">{lead.notes || "-"}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-button" title="Edit lead" onClick={() => onEdit(lead)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="icon-button danger" title="Delete lead" onClick={() => onDelete(lead)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
