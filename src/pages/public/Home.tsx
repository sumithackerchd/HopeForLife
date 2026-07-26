import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { supabase } from '@/lib/supabase/client';
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
      <section className="relative w-full px-4 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-50 dark:opacity-20" />
        </div>
        <div className="container relative z-10 mx-auto max-w-5xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
            <Shield className="mr-2 h-4 w-4" />
            100% Verified Medical Campaigns
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground text-balance">
            Give the gift of <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Life</span>
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl text-pretty max-w-2xl mx-auto leading-relaxed">
            Join thousands of donors making a real difference. Browse active medical campaigns and help patients fund life-saving treatments.
          </p>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-20 bg-muted/30 px-4 border-y">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Featured Campaigns</h2>
            <Link to="/campaigns" className="text-primary font-medium hover:underline flex items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          {campaigns.length === 0 ? (
            <div className="text-center text-muted-foreground py-24 bg-card/50 backdrop-blur-sm rounded-3xl border border-dashed">
              No active campaigns at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => {
                const percentFunded = campaign.goal_amount > 0 
                  ? Math.min(100, Math.round((campaign.current_raised_amount / campaign.goal_amount) * 100))
                  : 0;

                return (
                  <div key={campaign.id} className="group flex flex-col overflow-hidden rounded-3xl border bg-card/60 backdrop-blur-xl text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {campaign.cover_image ? (
                        <img 
                          src={campaign.cover_image} 
                          alt={campaign.title} 
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                          <Heart className="h-12 w-12 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 rounded-full bg-background/95 backdrop-blur-md px-3 py-1 text-xs font-semibold border shadow-sm flex items-center gap-1 text-foreground">
                        <Activity className="w-3 h-3 text-primary" />
                        {campaign.category || 'Medical'}
                      </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold tracking-tight mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        <Link to={`/story/${campaign.slug}`} className="focus:outline-none focus-visible:underline">
                          {campaign.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                        {campaign.seo_description || campaign.story?.substring(0, 150) || `Help support ${campaign.beneficiary}'s medical treatment.`}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-border/50">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Raised</p>
                            <p className="text-xl font-bold text-foreground">₹{campaign.current_raised_amount.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Goal</p>
                            <p className="text-sm font-semibold text-foreground">₹{campaign.goal_amount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden mb-5">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${percentFunded}%` }} 
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Link to={`/donate?campaign=${campaign.slug}`} className="flex-1">
                            <Button className="w-full shadow-sm hover:shadow-md transition-all">Donate</Button>
                          </Link>
                          <Link to={`/story/${campaign.slug}`} className="flex-1">
                            <Button variant="outline" className="w-full bg-transparent hover:bg-muted/50 transition-colors">Read Story</Button>
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
      <section className="py-24 bg-background px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-balance">Why we need your help</h2>
            <p className="text-muted-foreground text-pretty text-lg">
              Medical treatments can be overwhelmingly expensive. Your contribution ensures that patients receive the care they deserve without financial ruin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Direct Support",
                desc: "Funds go directly to verified medical needs and treatments, bypassing unnecessary middlemen."
              },
              {
                icon: Heart,
                title: "Verified Cases",
                desc: "Every campaign is rigorously reviewed and verified by our medical team and hospital partners."
              },
              {
                icon: Users,
                title: "Community Backed",
                desc: "Join thousands of donors making a real, measurable impact in people's lives every single day."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 rotate-3">
                  <feature.icon className="h-8 w-8 -rotate-3" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm text-balance leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight">Ready to make a difference?</h2>
          <p className="text-xl opacity-90 text-pretty max-w-2xl mx-auto">
            Your support can save a life today. Browse our campaigns or start one for someone in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/campaigns">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold shadow-lg">
                Browse Campaigns
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Start a Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}