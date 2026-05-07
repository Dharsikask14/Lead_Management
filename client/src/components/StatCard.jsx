export function StatCard({ label, value, detail, icon: Icon, tone = "default" }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-icon" aria-hidden="true">
        <Icon size={20} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}
