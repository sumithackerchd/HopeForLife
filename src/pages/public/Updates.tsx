import { format } from 'date-fns';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Database } from '@/types/database';

type Update = Database['public']['Tables']['updates']['Row'];

export default function Updates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const campaignSlug = searchParams.get('campaign');

        let query = supabase.from('updates').select('*, campaigns!inner(slug)').order('created_at', { ascending: false });
        
        if (campaignSlug) {
          query = query.eq('campaigns.slug', campaignSlug);
        }

        const { data, error } = await query;

        if (error) throw error;
        setUpdates(data || []);
      } catch (err) {
        console.error('Error fetching updates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Latest Updates</h1>
        <p className="text-lg text-muted-foreground text-balance">
          Follow the journey. We post regular updates here so you can see the impact of your support.
        </p>
      </div>

      {loading ? (
        <div>Loading updates...</div>
      ) : updates.length === 0 ? (
        <div className="text-muted-foreground">No updates available yet.</div>
      ) : (
        <div className="space-y-12">
          {updates.map((update) => (
            <article key={update.id} className="bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={update.created_at}>{new Date(update.created_at).toLocaleDateString()}</time>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">{update.title}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {update.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}