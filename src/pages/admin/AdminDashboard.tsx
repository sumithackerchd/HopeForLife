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
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRaised.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.donationCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">Out of {stats.campaignCount} total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Donation Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{donation.is_anonymous ? 'Anonymous' : donation.donor_name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(donation.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="font-medium text-sm">
                    {donation.currency} {donation.amount}
                  </div>
                </div>
              ))}
              {stats.recentDonations.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent donations</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}