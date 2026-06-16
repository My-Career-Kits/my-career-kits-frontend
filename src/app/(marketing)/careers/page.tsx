export default function CareersPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Careers</h1>
      <p className="text-text-secondary text-sm mb-4">
        We are not currently hiring, but we are always open to hearing from talented people.
      </p>
      <p className="text-text-secondary text-sm">
        Send your CV to{" "}
        <a href="mailto:careers@mycareerkits.com" className="text-accent hover:underline">
          careers@mycareerkits.com
        </a>
      </p>
    </div>
  );
}