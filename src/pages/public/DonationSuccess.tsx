import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DonationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">Thank You!</h1>
        
        <p className="text-muted-foreground">
          Your donation has been received successfully. Your support means the world to Aryan and his family.
        </p>
        
        <div className="bg-muted p-6 rounded-2xl border text-sm text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-medium">HFL-892348</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between border-t pt-3 mt-3">
            <span className="text-muted-foreground">Status</span>
            <span className="text-primary font-medium">Completed</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link to="/">
            <Button className="w-full h-12">Return to Home</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="w-full h-12">View My Donations</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}