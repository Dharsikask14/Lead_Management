import { PlusCircle } from "lucide-react";

export function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        <PlusCircle size={24} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onAction ? (
        <button className="button primary" type="button" onClick={onAction}>
          <PlusCircle size={18} />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
