import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="container-shell section-gap">
      <div className="mx-auto max-w-xl glass-panel p-10 text-center">
        <h1 className="text-4xl font-extrabold">404</h1>
        <p className="mt-4 text-sm text-brand-muted dark:text-brand-dark-muted">The page you requested does not exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white">
          Return home
        </Link>
      </div>
    </section>
  );
}
