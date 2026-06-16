export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Contact Us</h1>
      <p className="text-text-secondary text-sm mb-8">
        We would love to hear from you. Reach out and we will get back to you as soon as possible.
      </p>
      <div className="space-y-4 text-text-secondary text-sm">
        <div>
          <p className="text-text-primary font-medium">General Enquiries</p>
          <a href="mailto:hello@mycareerkits.com" className="text-accent hover:underline">
            hello@mycareerkits.com
          </a>
        </div>
        <div>
          <p className="text-text-primary font-medium">Support</p>
          <a href="mailto:support@mycareerkits.com" className="text-accent hover:underline">
            support@mycareerkits.com
          </a>
        </div>
        <div>
          <p className="text-text-primary font-medium">Press</p>
          <a href="mailto:press@mycareerkits.com" className="text-accent hover:underline">
            press@mycareerkits.com
          </a>
        </div>
        <div>
          <p className="text-text-primary font-medium">Registered Address</p>
          <p>Shenmibox Ltd, England & Wales</p>
        </div>
      </div>
    </div>
  );
}