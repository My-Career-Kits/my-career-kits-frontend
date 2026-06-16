export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Cookie Policy</h1>
      <p className="text-text-secondary text-sm mb-8">Last updated: June 2025</p>
      <div className="space-y-6 text-text-secondary text-sm">
        <p>
          We use cookies to ensure our platform works correctly and to improve your experience.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Essential Cookies</h2>
        <p>
          These are required for the platform to function. They include session management
          and authentication cookies.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Analytics Cookies</h2>
        <p>
          We use analytics cookies to understand how users interact with our platform so
          we can improve it over time. These are only set with your consent.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Managing Cookies</h2>
        <p>
          You can control cookies through your browser settings. Disabling essential
          cookies may affect platform functionality.
        </p>
      </div>
    </div>
  );
}