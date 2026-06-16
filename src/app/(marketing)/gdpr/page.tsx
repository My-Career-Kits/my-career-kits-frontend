export default function GdprPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">GDPR</h1>
      <p className="text-text-secondary text-sm mb-8">Last updated: June 2025</p>
      <div className="space-y-6 text-text-secondary text-sm">
        <p>
          MyCareerKits is committed to full compliance with the UK General Data Protection
          Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Your Rights</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Right to access your personal data</li>
          <li>Right to correct inaccurate data</li>
          <li>Right to erasure ("right to be forgotten")</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
        </ul>
        <h2 className="text-lg font-semibold text-text-primary">Data Controller</h2>
        <p>
          Shenmibox Ltd is the data controller for MyCareerKits, registered in England
          and Wales.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
        <p>
          To exercise your rights, contact us at{" "}
          <a href="mailto:gdpr@mycareerkits.com" className="text-accent hover:underline">
            gdpr@mycareerkits.com
          </a>
        </p>
      </div>
    </div>
  );
}