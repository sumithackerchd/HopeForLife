import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { Heart, Users, FileText, Activity } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRaised: 0,
    donationCount: 0,
    campaignCount: 0,
    activeCampaigns: 0,
    recentDonations: [] as any[],
    monthlyData: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 1. Get Donations
      const { data: donations } = await supabase
        .from('donations')
        .select('*')
        .eq('payment_status', 'completed');

      const totalRaised = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
      
      // 2. Get Campaigns
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*');
        
      const activeCampaigns = campaigns?.filter(c => c.status === 'published').length || 0;

      // 3. Process chart data (last 6 months)
      const monthlyMap = new Map();
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        monthlyMap.set(monthName, { name: monthName, total: 0 });
      }

      donations?.forEach(d => {
        const dDate = new Date(d.created_at);
        const diffMonths = (now.getFullYear() - dDate.getFullYear()) * 12 + (now.getMonth() - dDate.getMonth());
        if (diffMonths <= 5 && diffMonths >= 0) {
          const monthName = dDate.toLocaleString('default', { month: 'short' });
          if (monthlyMap.has(monthName)) {
            monthlyMap.get(monthName).total += Number(d.amount);
          }
        }
      });

      setStats({
        totalRaised,
        donationCount: donations?.length || 0,
        campaignCount: campaigns?.length || 0,
        activeCampaigns,
        recentDonations: donations?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5) || [],
        monthlyData: Array.from(monthlyMap.values()),
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here is what's happening on HopeForLife today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">₹{stats.totalRaised.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+14% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations</CardTitle>
            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{stats.donationCount}</div>
            <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center">
              <Activity className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {stats.campaignCount} total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2 border shadow-sm">
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly donation volume over the past 6 months.</p>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <p className="text-sm text-muted-foreground">Latest successful transactions.</p>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              {stats.recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border group-hover:border-primary/50 transition-colors">
                      <Heart className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{donation.is_anonymous ? 'Anonymous' : donation.donor_name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(donation.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-foreground">
                      ₹{Number(donation.amount).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Completed</div>
                  </div>
                </div>
              ))}
              {stats.recentDonations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <FileText className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm">No recent donations</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}