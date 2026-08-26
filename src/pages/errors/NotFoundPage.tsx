import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="error-page container" aria-labelledby="not-found-title">
      <p className="eyebrow">Error 404 / Form Not Found</p>
      <h1 id="not-found-title">This piece does not exist.</h1>
      <p>The silhouette or page you are seeking has been moved, archived, or is not in this edition of the atelier.</p>
      <div className="error-page__actions">
        <Link className="button button--primary" to="/">
          Return to storefront
        </Link>
        <Link className="button button--secondary" to="/shop">
          Explore collection
        </Link>
        <Link className="text-link" to="/assistant" style={{ marginInlineStart: '12px' }}>
          Ask Falcon AI &rarr;
        </Link>
      </div>
    </main>
  );
}
