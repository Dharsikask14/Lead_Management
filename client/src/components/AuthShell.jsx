export function AuthShell({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <section className="auth-brand">
        <img src="/Lead_Management/event-marketing.svg" alt="Event marketing illustration" />
      </section>
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Lead Portal</p>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
