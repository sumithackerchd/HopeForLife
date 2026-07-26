import { format } from 'date-fns';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Updates() {
  const updates = [
    {
      id: 1,
      title: 'First week of Chemotherapy completed',
      date: 'April 9, 2026',
      content: 'Aryan has successfully completed his first week of intensive chemotherapy. He has been incredibly brave despite the nausea and fatigue. The doctors are closely monitoring his blood counts. Thank you everyone for your continued prayers and support.',
      image: null
    },
    {
      id: 2,
      title: 'Moving to the general ward',
      date: 'March 22, 2026',
      content: 'Great news! Aryan is responding well to the initial medications and his fever has finally subsided. The doctors have moved him from the ICU to the pediatric oncology general ward. We are hoping to start the main chemotherapy regimen soon.',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Latest Updates</h1>
        <p className="text-lg text-muted-foreground text-balance">
          Follow Aryan's journey. We post regular updates here so you can see the impact of your support.
        </p>
      </div>

      <div className="space-y-12">
        {updates.map((update) => (
          <article key={update.id} className="bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {update.image && (
              <div className="w-full h-64 md:h-80 bg-muted overflow-hidden">
                <img src={update.image} alt={update.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <time dateTime={update.date}>{update.date}</time>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">{update.title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {update.content}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}