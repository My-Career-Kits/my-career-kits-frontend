export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Privacy Policy</h1>
      <p className="text-text-secondary text-sm mb-8">Last updated: June 2025</p>
      <div className="prose prose-sm text-text-secondary space-y-6">
        <p>
          At MyCareerKits, we take your privacy seriously. This policy explains how we
          collect, use, and protect your personal data in compliance with UK GDPR and
          applicable data protection laws.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">What we collect</h2>
        <p>
          We collect information you provide directly, such as your name, email address,
          resume content, and job preferences, as well as usage data to improve our services.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">How we use it</h2>
        <p>
          Your data is used to provide and improve our services, personalise your experience,
          and communicate important updates. We never sell your data to third parties.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
        <p>
          For privacy-related queries, contact us at{" "}
          <a href="mailto:privacy@mycareerkits.com" className="text-accent hover:underline">
            privacy@mycareerkits.com
          </a>
        </p>
      </div>
    </div>
  );
}