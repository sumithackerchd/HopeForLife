import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-foreground text-balance">About HopeForLife</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          HopeForLife is a dedicated medical crowdfunding platform created with a single, focused mission: to gather support and funds for Aryan's life-saving cancer treatment.
        </p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          We believe that no family should have to choose between their child's life and financial ruin. The cost of complex medical treatments like Bone Marrow Transplants can be overwhelming for ordinary families. HopeForLife bridges the gap between those who need urgent medical financial assistance and those who have the heart to help.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">Transparency & Trust</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          We understand that trust is the foundation of any crowdfunding initiative. That is why we are committed to complete transparency:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
          <li>All medical reports are verified by our team before being uploaded to the platform.</li>
          <li>Regular updates on Aryan's health and treatment progress are shared directly from the hospital.</li>
          <li>Every donation is tracked and the progress bar is updated in real-time.</li>
          <li>Funds are directly channeled to the hospital for treatment expenses.</li>
        </ul>

        <div className="bg-muted p-8 rounded-2xl mt-12 border">
          <h3 className="text-xl font-bold mb-4 text-foreground">Need to reach out?</h3>
          <p className="text-muted-foreground mb-4">
            If you have any questions about the campaign, the medical reports, or how your donation will be used, please don't hesitate to contact us.
          </p>
          <Link to="/contact" className="text-primary font-medium hover:underline inline-flex items-center">
            Contact Support Team <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}