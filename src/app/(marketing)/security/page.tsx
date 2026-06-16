export default function SecurityPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Security</h1>
      <p className="text-text-secondary text-sm mb-8">Last updated: June 2025</p>
      <div className="space-y-6 text-text-secondary text-sm">
        <p>
          We take the security of your data seriously and implement industry-standard
          measures to protect it.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Encryption</h2>
        <p>All data is encrypted in transit using TLS and at rest using AES-256.</p>
        <h2 className="text-lg font-semibold text-text-primary">Access Control</h2>
        <p>
          Access to user data is restricted to authorised personnel only, on a
          need-to-know basis.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Reporting a Vulnerability</h2>
        <p>
          If you discover a security vulnerability, please report it responsibly to{" "}
          <a href="mailto:security@mycareerkits.com" className="text-accent hover:underline">
            security@mycareerkits.com
          </a>
        </p>
      </div>
    </div>
  );
}