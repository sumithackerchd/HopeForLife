import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-xl font-bold tracking-tight text-primary mb-4 block">
              HopeForLife
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm leading-relaxed">
              A dedicated platform helping a brave soul fight against cancer. Every contribution brings us one step closer to victory.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/story" className="text-sm text-muted-foreground hover:text-foreground">Medical Story</Link></li>
              <li><Link to="/updates" className="text-sm text-muted-foreground hover:text-foreground">Latest Updates</Link></li>
              <li><Link to="/reports" className="text-sm text-muted-foreground hover:text-foreground">Medical Reports</Link></li>
              <li><Link to="/hospital" className="text-sm text-muted-foreground hover:text-foreground">Hospital Info</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/refund" className="text-sm text-muted-foreground hover:text-foreground">Refund Policy</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} HopeForLife. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Secure Payments via</span>
            <span className="font-medium text-foreground">Stripe & PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
