export default function Legal() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Legal Information</h1>
      
      <div className="space-y-12">
        <section id="privacy">
          <h2 className="text-2xl font-bold mb-6 text-foreground border-b pb-2">Privacy Policy</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-sm">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <h3>1. Information We Collect</h3>
            <p>When you make a donation or register on HopeForLife, we collect your name, email address, and payment information. We do not store your full credit card details on our servers; payments are processed securely through our payment partners.</p>
            <h3>2. How We Use Your Information</h3>
            <p>We use your information to process donations, send receipts, provide updates on the campaign (if you opt-in), and maintain the security of our platform.</p>
            <h3>3. Data Protection</h3>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </div>
        </section>

        <section id="terms">
          <h2 className="text-2xl font-bold mb-6 text-foreground border-b pb-2">Terms of Service</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-sm">
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using HopeForLife, you agree to be bound by these Terms of Service.</p>
            <h3>2. Donations</h3>
            <p>All donations made through the platform are voluntary. By donating, you acknowledge that you are providing funds to assist with medical expenses without expectation of goods or services in return.</p>
            <h3>3. User Conduct</h3>
            <p>You agree not to use the platform for any unlawful purpose, or to submit false information, or to harass or abuse other users or administrators.</p>
          </div>
        </section>

        <section id="refund">
          <h2 className="text-2xl font-bold mb-6 text-foreground border-b pb-2">Refund Policy</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-sm">
            <p>Given the nature of medical crowdfunding, donations are generally considered non-refundable.</p>
            <p>However, we understand that errors can happen. We will process a refund if:</p>
            <ul>
              <li>A donation was made in error (e.g., wrong amount entered) and requested within 48 hours.</li>
              <li>A fraudulent transaction occurred using your payment method.</li>
            </ul>
            <p>To request a refund, please contact our support team with your transaction ID and details of the error.</p>
          </div>
        </section>
      </div>
    </div>
  );
}