import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { supabase } from '@/db/supabase';
import { Database } from '@/types/database';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:campaigns')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => {
        fetchCampaigns();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading campaigns...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="HopeForLife - Medical Crowdfunding"
        description="Help patients fight critical illnesses. Every contribution counts."
        keywords="crowdfunding, donate, medical help, campaigns"
      />
      
      {/* Hero Section */}
      <section className="relative w-full px-4 pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-background border-b">
        <div className="absolute inset-0 bg-muted/40 z-0 pointer-events-none" />
        <div className="container relative z-10 mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Shield className="mr-2 h-4 w-4" />
            Verified Campaigns
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
            Help them fight for their <span className="text-primary">Life</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl text-pretty max-w-2xl mx-auto">
            Browse our active medical campaigns and make a difference today. Your support gives them hope.
          </p>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-16 bg-background px-4">
        <div className="container mx-auto max-w-5xl">
          {campaigns.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No active campaigns at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => {
                const percentFunded = campaign.goal_amount > 0 
                  ? Math.min(100, Math.round((campaign.current_raised_amount / campaign.goal_amount) * 100))
                  : 0;

                return (
                  <div key={campaign.id} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {campaign.cover_image ? (
                        <img 
                          src={campaign.cover_image} 
                          alt={campaign.title} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                          <Heart className="h-12 w-12 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 rounded-full bg-background/95 backdrop-blur-sm px-3 py-1 text-xs font-medium border shadow-sm">
                        {campaign.category || 'Medical'}
                      </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold tracking-tight mb-2 line-clamp-2">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {campaign.seo_description || campaign.story || `Help support ${campaign.beneficiary}'s medical treatment.`}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Raised</p>
                            <p className="text-lg font-bold text-foreground">₹{campaign.current_raised_amount.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Goal</p>
                            <p className="text-sm font-semibold text-foreground">₹{campaign.goal_amount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                            style={{ width: `${percentFunded}%` }} 
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Link to={`/donate?campaign=${campaign.slug}`} className="flex-1">
                            <Button className="w-full">Donate</Button>
                          </Link>
                          <Link to={`/story/${campaign.slug}`} className="flex-1">
                            <Button variant="outline" className="w-full">Read Story</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-24 bg-card px-4 border-t">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-balance">Why we need your help</h2>
            <p className="text-muted-foreground text-pretty">
              Medical treatments can be overwhelmingly expensive. Your contribution ensures that patients receive the care they deserve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Direct Support",
                desc: "Funds go directly to verified medical needs and treatments."
              },
              {
                icon: Heart,
                title: "Verified Cases",
                desc: "Every campaign is reviewed and verified by our medical team."
              },
              {
                icon: Users,
                title: "Community Backed",
                desc: "Join thousands of donors making a real impact in people's lives."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm text-balance">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}