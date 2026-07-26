import { FileText, Download, ShieldCheck, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function MedicalReports() {
  const reports = [
    {
      id: 1,
      title: 'Initial Diagnosis Report',
      date: 'March 15, 2026',
      type: 'PDF',
      size: '2.4 MB',
      verified: true,
      url: '#'
    },
    {
      id: 2,
      title: 'Bone Marrow Aspiration Result',
      date: 'March 18, 2026',
      type: 'PDF',
      size: '1.8 MB',
      verified: true,
      url: '#'
    },
    {
      id: 3,
      title: 'Treatment Plan Estimate',
      date: 'March 25, 2026',
      type: 'PDF',
      size: '1.1 MB',
      verified: true,
      url: '#'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Medical Reports</h1>
        <p className="text-lg text-muted-foreground text-balance">
          We believe in complete transparency. All medical documents related to Aryan's diagnosis and treatment plan are available for review.
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">
          All documents bearing the "Verified" badge have been authenticated by our team directly with the issuing hospital.
        </p>
      </div>

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
                  <span>{report.date}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{report.type}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{report.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-4xl h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>{report.title}</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 bg-muted rounded-md flex items-center justify-center border">
                    <p className="text-muted-foreground flex flex-col items-center">
                      <FileText className="w-12 h-12 mb-4 opacity-20" />
                      PDF Preview Placeholder
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button className="flex-1 md:flex-none" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}