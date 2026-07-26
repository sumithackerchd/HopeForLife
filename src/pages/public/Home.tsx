import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Help Aryan Fight Leukemia"
        description="Aryan is a brave 5-year-old fighting Acute Lymphoblastic Leukemia. He needs an urgent bone marrow transplant to survive. Please donate."
        keywords="cancer crowdfunding, donate, leukemia, medical help, help aryan"
      />
      {/* Hero Section */}
      <section className="relative w-full px-4 pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-muted/40 z-0 pointer-events-none" />
        <div className="container relative z-10 mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Shield className="mr-2 h-4 w-4" />
              Verified Campaign
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
              Help us save little <span className="text-primary">Aryan's</span> life from Leukemia
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl text-pretty max-w-2xl mx-auto md:mx-0">
              Aryan is a brave 5-year-old fighting Acute Lymphoblastic Leukemia. He needs an urgent bone marrow transplant to survive. Every contribution counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/donate">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                  Donate Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/story">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-background">
                  Read His Story
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md md:max-w-none">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border">
              {/* Note: In real app, this would be an actual image fetched from Supabase */}
              <img 
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop" 
                alt="Child playing happily before diagnosis" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/10">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Raised</p>
                      <p className="text-2xl font-bold text-foreground">₹2,45,000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Goal</p>
                      <p className="text-xl font-semibold text-foreground">₹15,00,000</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '16%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium text-right">16% Funded • 42 Donors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-24 bg-card px-4 border-y">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-balance">Why we need your help</h2>
            <p className="text-muted-foreground text-pretty">
              The treatment for Acute Lymphoblastic Leukemia is long, intensive, and extremely costly. Here is how your donation will be used.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Chemotherapy Sessions",
                desc: "Multiple rounds of intensive chemotherapy are required to eliminate cancer cells."
              },
              {
                icon: Heart,
                title: "Bone Marrow Transplant",
                desc: "The critical final step of the treatment to rebuild his immune system."
              },
              {
                icon: Users,
                title: "Supportive Care",
                desc: "Medications, specialized diet, and hospital stays during the 6-month treatment."
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
      
      {/* Testimonials / Recent Donors Placeholder */}
      <section className="py-24 bg-background px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Join our community of supporters</h2>
          <p className="text-muted-foreground mb-8 text-pretty">
            "We are overwhelmed by the kindness of strangers. Your support gives us hope when we need it the most." <br/>— Aryan's Parents
          </p>
          <Link to="/donate">
            <Button size="lg" className="h-12 px-8 text-base">Make a Donation</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}