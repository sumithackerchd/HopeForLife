import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function DonationList() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, [statusFilter]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('donations')
        .select(`
          *,
          campaign:campaigns(title)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('payment_status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDonations(data || []);
    } catch (error: any) {
      toast.error('Error fetching donations: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(d => {
    const search = searchTerm.toLowerCase();
    return (
      (d.donor_name && d.donor_name.toLowerCase().includes(search)) ||
      (d.email && d.email.toLowerCase().includes(search)) ||
      (d.transaction_id && d.transaction_id.toLowerCase().includes(search))
    );
  });

  const exportCSV = () => {
    if (filteredDonations.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const headers = ['ID', 'Date', 'Donor Name', 'Email', 'Amount', 'Currency', 'Status', 'Gateway', 'Transaction ID', 'Anonymous'];
    const csvData = filteredDonations.map(d => [
      d.id,
      new Date(d.created_at).toISOString(),
      d.donor_name || '',
      d.email || '',
      d.amount,
      d.currency,
      d.payment_status,
      d.payment_gateway || '',
      d.transaction_id || '',
      d.is_anonymous ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `donations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Donations</h1>
        <Button onClick={exportCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or transaction ID..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48 shrink-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="w-full max-w-full overflow-x-auto">
          <Table className="[&>div]:max-w-full min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Donor</TableHead>
                <TableHead className="whitespace-nowrap">Campaign</TableHead>
                <TableHead className="whitespace-nowrap">Amount</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Gateway/Txn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading donations...</TableCell>
                </TableRow>
              ) : filteredDonations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No donations found</TableCell>
                </TableRow>
              ) : (
                filteredDonations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(d.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-medium">{d.is_anonymous ? 'Anonymous' : d.donor_name || 'Anonymous'}</div>
                      {!d.is_anonymous && d.email && <div className="text-xs text-muted-foreground">{d.email}</div>}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {d.campaign?.title || 'General'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {d.currency} {d.amount}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={d.payment_status === 'completed' ? 'default' : d.payment_status === 'failed' ? 'destructive' : 'secondary'}>
                        {d.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm capitalize">{d.payment_gateway || '-'}</div>
                      <div className="text-xs text-muted-foreground font-mono">{d.transaction_id || '-'}</div>
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