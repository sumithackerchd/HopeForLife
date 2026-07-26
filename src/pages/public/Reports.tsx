import { FileText, Download, ShieldCheck, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Database } from '@/types/database';
import { useLocation } from 'react-router-dom';

type Report = Database['public']['Tables']['medical_reports']['Row'];

export default function MedicalReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const campaignSlug = searchParams.get('campaign');

        let query = supabase.from('medical_reports').select('*, campaigns!inner(slug)').eq('verified', true).order('created_at', { ascending: false });
        
        if (campaignSlug) {
          query = query.eq('campaigns.slug', campaignSlug);
        }

        const { data, error } = await query;

        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Medical Reports</h1>
        <p className="text-lg text-muted-foreground text-balance">
          We believe in complete transparency. All verified medical documents are available for review.
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">
          All documents bearing the "Verified" badge have been authenticated by our team directly with the issuing hospital.
        </p>
      </div>

      {loading ? (
        <div>Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-muted-foreground">No verified reports available at the moment.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-card border rounded-2xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-4 min-w-0">
                <div className="p-3 bg-muted rounded-xl text-muted-foreground shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground truncate">{report.title}</h3>
                    {report.verified && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                <Button className="flex-1 md:flex-none" onClick={() => window.open(report.file_url, '_blank')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}