export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Accessibility</h1>
      <p className="text-text-secondary text-sm mb-8">Last updated: June 2025</p>
      <div className="space-y-6 text-text-secondary text-sm">
        <p>
          MyCareerKits is committed to making our platform accessible to everyone,
          including people with disabilities.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Our Standards</h2>
        <p>
          We aim to meet WCAG 2.1 Level AA standards across our platform and continuously
          work to improve accessibility.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Known Issues</h2>
        <p>
          We are actively working to resolve any accessibility issues. If you encounter
          a barrier, please let us know.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
        <p>
          For accessibility support, contact us at{" "}
          <a href="mailto:accessibility@mycareerkits.com" className="text-accent hover:underline">
            accessibility@mycareerkits.com
          </a>
        </p>
      </div>
    </div>
  );
}