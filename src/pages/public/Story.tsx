import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { SEO } from '@/components/common/SEO';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

export default function Story() {
  const { slug } = useParams<{ slug: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setCampaign(data);
      } catch (error) {
        console.error('Error fetching campaign story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [slug]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
        <Link to="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <SEO 
        title={campaign.seo_title || campaign.title}
        description={campaign.seo_description || `Read the story of ${campaign.beneficiary}`}
        keywords={campaign.seo_keywords || "crowdfunding, donate, medical help"}
      />
      <div className="mb-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-6">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-6 text-foreground text-balance">{campaign.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-6">
          <span>Published on: {new Date(campaign.created_at).toLocaleDateString()}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Beneficiary: {campaign.beneficiary}</span>
          {campaign.hospital && (
            <>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Hospital: {campaign.hospital}</span>
            </>
          )}
        </div>
      </div>

      {campaign.cover_image && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-10 border">
          <img 
            src={campaign.cover_image} 
            alt={campaign.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap leading-relaxed text-foreground text-lg">
          {campaign.story || "No story has been provided for this campaign yet."}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-12 border-t">
          <Link to={`/donate?campaign=${campaign.slug}`}>
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              Donate Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}