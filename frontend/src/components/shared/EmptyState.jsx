export default function EmptyState({ title, description, action }) {
  return (
    <div className="glass-panel mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-brand-muted dark:text-brand-dark-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
