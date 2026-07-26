import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Hospital() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Hospital Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Contact Details</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="block text-foreground mb-1">City Hospital & Research Centre</strong>
                  123 Healthcare Avenue,<br />
                  Medical District,<br />
                  New Delhi, 110001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+91 11 2345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>oncology@cityhospital.example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  Visiting Hours:<br />
                  Mon-Sun: 4:00 PM - 7:00 PM<br />
                  <span className="text-xs italic mt-1 block">*Subject to patient condition</span>
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Treating Doctor</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                {/* Note: Placeholder image in code */}
                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" alt="Dr. Sharma" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Dr. Rajiv Sharma</h3>
                <p className="text-sm text-muted-foreground">Senior Pediatric Oncologist</p>
                <p className="text-xs text-muted-foreground mt-1">15+ years experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[400px] md:h-auto bg-muted rounded-2xl border overflow-hidden relative">
           <iframe 
             title="Hospital Location"
             width="100%" 
             height="100%" 
             frameBorder="0" 
             style={{border:0}} 
             referrerPolicy="no-referrer-when-downgrade" 
             src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB_LJOYJL-84SMuxNB7LtRGhxEQLjswvy0&q=City+Hospital,New+Delhi&language=en&region=cn" 
             allowFullScreen
           ></iframe>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Treatment Estimate</h2>
        <p className="text-muted-foreground mb-6">
          The estimated cost of treatment provided by the hospital covers chemotherapy, the bone marrow transplant procedure, hospital stay, medications, and necessary supportive care for a duration of 6 months.
        </p>
        <div className="flex justify-between items-center py-4 border-b border-primary/10">
          <span className="font-medium">Chemotherapy (Multiple Cycles)</span>
          <span className="font-bold">₹4,00,000</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-primary/10">
          <span className="font-medium">Bone Marrow Transplant</span>
          <span className="font-bold">₹8,00,000</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-primary/10">
          <span className="font-medium">Medication & Supportive Care</span>
          <span className="font-bold">₹3,00,000</span>
        </div>
        <div className="flex justify-between items-center py-4 text-lg">
          <span className="font-bold text-foreground">Total Estimate</span>
          <span className="font-bold text-primary">₹15,00,000</span>
        </div>
      </div>
    </div>
  );
}