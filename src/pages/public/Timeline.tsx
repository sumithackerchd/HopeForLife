import { Calendar, CheckCircle2 } from 'lucide-react';

export default function Timeline() {
  const events = [
    {
      date: 'March 15, 2026',
      title: 'Initial Diagnosis',
      description: 'Aryan was taken to the hospital for persistent fever and fatigue. After a series of blood tests, he was diagnosed with Acute Lymphoblastic Leukemia.',
      status: 'completed'
    },
    {
      date: 'April 2, 2026',
      title: 'First Chemotherapy Cycle',
      description: 'Started the induction phase of chemotherapy at City Hospital. The treatment lasted for 28 days and was extremely tough on his small body.',
      status: 'completed'
    },
    {
      date: 'May 10, 2026',
      title: 'Remission Achieved',
      description: 'Post-induction bone marrow tests showed that the cancer was in remission. However, further treatment is necessary to prevent relapse.',
      status: 'completed'
    },
    {
      date: 'June 5, 2026',
      title: 'Consolidation Therapy',
      description: 'Started the second phase of treatment. High doses of chemotherapy to kill any remaining undetected leukemia cells.',
      status: 'completed'
    },
    {
      date: 'August 2026',
      title: 'Bone Marrow Transplant',
      description: 'Scheduled for a life-saving bone marrow transplant. A matching donor has been found, but we need funds to proceed with the surgery.',
      status: 'pending'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4 text-foreground">Treatment Timeline</h1>
      <p className="text-lg text-muted-foreground mb-12 text-balance">
        A chronological overview of Aryan's medical journey and the critical steps ahead.
      </p>

      <div className="relative border-l border-border ml-4 md:ml-6 space-y-12 pb-8">
        {events.map((event, index) => (
          <div key={index} className="relative pl-8 md:pl-12">
            {event.status === 'completed' ? (
              <div className="absolute -left-3.5 md:-left-3.5 bg-background text-primary p-1 rounded-full border border-primary/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="absolute -left-3.5 md:-left-3.5 bg-background text-muted-foreground p-1 rounded-full border border-border">
                <Calendar className="w-5 h-5" />
              </div>
            )}
            
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <span className="text-sm font-medium text-primary mb-2 block">{event.date}</span>
              <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
              <p className="text-muted-foreground text-sm text-pretty leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}