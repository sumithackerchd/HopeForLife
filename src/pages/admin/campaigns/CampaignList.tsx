import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Archive } from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      toast.error('Error fetching campaigns: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Campaign marked as ${newStatus}`);
      fetchCampaigns();
    } catch (error: any) {
      toast.error('Error updating status: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Campaign deleted successfully');
      fetchCampaigns();
    } catch (error: any) {
      toast.error('Error deleting campaign: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button asChild>
          <Link to="/admin/campaigns/new">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="w-full max-w-full overflow-x-auto">
          <Table className="[&>div]:max-w-full min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Title</TableHead>
                <TableHead className="whitespace-nowrap">Beneficiary</TableHead>
                <TableHead className="whitespace-nowrap">Goal / Raised</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading campaigns...</TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No campaigns found</TableCell>
                </TableRow>
              ) : (
                campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium whitespace-nowrap">{c.title}</TableCell>
                    <TableCell className="whitespace-nowrap">{c.beneficiary}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      ₹{c.current_raised_amount} / ₹{c.goal_amount}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={c.status === 'published' ? 'default' : c.status === 'draft' ? 'secondary' : 'outline'}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap space-x-2">
                      {c.status === 'published' ? (
                        <Button variant="ghost" size="icon" onClick={() => handleStatusChange(c.id, c.status, 'draft')} title="Unpublish">
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleStatusChange(c.id, c.status, 'published')} title="Publish">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {c.status !== 'archived' && (
                        <Button variant="ghost" size="icon" onClick={() => handleStatusChange(c.id, c.status, 'archived')} title="Archive">
                          <Archive className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/campaigns/edit/${c.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}