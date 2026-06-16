export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Terms of Service</h1>
      <p className="text-text-secondary text-sm mb-8">Last updated: June 2025</p>
      <div className="space-y-6 text-text-secondary text-sm">
        <p>
          By using MyCareerKits, you agree to these terms. Please read them carefully
          before using our platform.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Use of Service</h2>
        <p>
          You may use MyCareerKits for personal, non-commercial career development purposes.
          You must not misuse our services or attempt to access them using methods other
          than the interface we provide.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Your Account</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials
          and for all activity that occurs under your account.
        </p>
        <h2 className="text-lg font-semibold text-text-primary">Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms
          without prior notice.
        </p>
      </div>
    </div>
  );
}