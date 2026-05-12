export default function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-primary">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-3 text-sm leading-6 text-brand-muted dark:text-brand-dark-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
