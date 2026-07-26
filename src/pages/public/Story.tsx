import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Story() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-6">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-6 text-foreground text-balance">The Story of Aryan's Brave Fight</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-6">
          <span>Published on: July 20, 2026</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Written by: Aryan's Parents</span>
        </div>
      </div>

      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-10 border">
        {/* Placeholder for real image */}
        <img 
          src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop" 
          alt="Aryan playing with his toys" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed mb-6 font-medium text-foreground">
          Just a few months ago, our 5-year-old son Aryan was a joyful, energetic child who loved playing with his toy cars and coloring books. Our world turned upside down on March 15, 2026.
        </p>

        <p className="leading-relaxed mb-6 text-muted-foreground">
          It started with a fever that wouldn't go away and unusual bruising on his arms. We thought it was just a severe viral infection. But when the pediatrician looked at his blood test results, her expression changed. We were immediately referred to an oncologist.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">The Diagnosis</h2>
        
        <p className="leading-relaxed mb-6 text-muted-foreground">
          The words "Acute Lymphoblastic Leukemia" echoed in the small clinic room. We were paralyzed with fear. Blood cancer. Our little boy, who hadn't even started first grade, was now facing the biggest battle of his life.
        </p>

        <p className="leading-relaxed mb-6 text-muted-foreground">
          Leukemia is a cancer of the blood-forming tissues, hindering the body's ability to fight infection. For Aryan, it meant immediate hospitalization and the start of an aggressive chemotherapy regimen.
        </p>

        <div className="bg-muted p-6 rounded-xl border my-8 italic text-foreground text-center">
          "Watching your child endure pain and not being able to take it away is the most helpless feeling a parent can experience."
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">The Treatment Plan</h2>

        <p className="leading-relaxed mb-6 text-muted-foreground">
          The doctors at City Hospital have outlined a rigorous treatment plan. He has already completed his first phase of chemotherapy, which was incredibly hard on him. He lost his hair, his appetite, and his energy, but never his bright smile.
        </p>

        <p className="leading-relaxed mb-6 text-muted-foreground">
          While the chemotherapy has pushed the cancer into remission, the doctors have advised that given his specific sub-type of leukemia, a Bone Marrow Transplant (BMT) is absolutely critical to ensure the cancer does not return and to give him a chance at a long, healthy life.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Why We Need Your Help</h2>

        <p className="leading-relaxed mb-6 text-muted-foreground">
          We have exhausted all our savings, sold our assets, and borrowed from family and friends to cover the initial hospital stays and chemotherapy sessions. However, the Bone Marrow Transplant and the subsequent supportive care will cost an estimated ₹15,00,000.
        </p>

        <p className="leading-relaxed mb-8 text-muted-foreground">
          This is an amount we simply cannot raise on our own in the short time frame we have. The transplant needs to happen next month while he is still in remission. Every day counts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-12 border-t">
          <Link to="/donate">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              Donate to Aryan
            </Button>
          </Link>
          <Link to="/reports">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
              View Medical Reports
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}