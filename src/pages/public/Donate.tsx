import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, CreditCard, AlertCircle, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Database } from '@/types/database';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

const QUICK_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];

export default function Donate() {
  const [amount, setAmount] = useState<string>('2500');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState('stripe');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const campaignSlug = searchParams.get('campaign');

    if (campaignSlug) {
      const fetchCampaign = async () => {
        try {
          const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('slug', campaignSlug)
            .single();

          if (error) throw error;
          setCampaign(data);
        } catch (err) {
          console.error('Error fetching campaign:', err);
        }
      };

      fetchCampaign();
    }
  }, [location]);

  const handleAmountSelect = (val: string) => {
    setIsCustomAmount(false);
    setAmount(val);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!campaign) {
      toast.error('No campaign selected. Please start a donation from a campaign page.');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const payload = {
        amount: Number(amount),
        currency,
        donor_name: name,
        email,
        message,
        is_anonymous: isAnonymous,
        gateway: paymentGateway,
        user_id: session?.user?.id || null,
        campaign_id: campaign.id
      };

      const { data, error } = await supabase.functions.invoke('payment_adapter', {
        body: payload
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Simulate the redirect and processing that would happen with a real gateway
      setTimeout(() => {
        toast.success('Donation successful!');
        navigate('/donation/success');
        setIsLoading(false);
      }, 1500);

    } catch (err: any) {
      toast.error(err.message || 'An error occurred during payment setup');
      setIsLoading(false);
    }
  };

  const percentFunded = campaign && campaign.goal_amount > 0 
    ? Math.min(100, Math.round((campaign.current_raised_amount / campaign.goal_amount) * 100))
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">Make a Donation</h1>
            <p className="text-lg text-muted-foreground text-balance">
              {campaign ? `Your contribution will directly fund ${campaign.beneficiary}'s medical needs.` : 'Please select a campaign to donate to.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-foreground">1. Select Amount</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {QUICK_AMOUNTS.map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant={!isCustomAmount && amount === amt.toString() ? 'default' : 'outline'}
                    className={`h-14 text-base ${!isCustomAmount && amount === amt.toString() ? 'border-primary' : 'bg-background'}`}
                    onClick={() => handleAmountSelect(amt.toString())}
                  >
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}{amt}
                  </Button>
                ))}
              </div>

              <div className="pt-4">
                <Label htmlFor="custom-amount" className="mb-3 block">Or enter a custom amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
                  </span>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    className="h-14 pl-8 bg-muted/50 text-lg font-medium"
                    value={isCustomAmount ? amount : ''}
                    onChange={(e) => {
                      setIsCustomAmount(true);
                      setAmount(e.target.value);
                    }}
                    onFocus={() => setIsCustomAmount(true)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-foreground">2. Your Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Jane Doe" 
                      className="bg-muted/50" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isAnonymous}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="jane@example.com" 
                      className="bg-muted/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="anonymous" 
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Label htmlFor="anonymous" className="font-normal text-muted-foreground">Make my donation anonymous</Label>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="message">Leave a message of support (Optional)</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Stay strong, Aryan! We are praying for you." 
                    className="resize-none h-24 bg-muted/50"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-foreground">3. Payment Method</h2>
              
              <RadioGroup value={paymentGateway} onValueChange={setPaymentGateway} className="space-y-3">
                <div className="flex items-center space-x-3 border rounded-xl p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex-1 cursor-pointer font-medium flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    Credit / Debit Card (Stripe)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-xl p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex-1 cursor-pointer font-medium flex items-center gap-2">
                    UPI / Netbanking (Razorpay)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-xl p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer font-medium flex items-center gap-2">
                    PayPal
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isLoading || !amount || Number(amount) <= 0}>
                  <Heart className="w-5 h-5 mr-2" />
                  {isLoading ? 'Processing...' : `Donate ${currency} ${amount || 0}`}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Payments are secure and encrypted
                </p>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-muted/30 border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Campaign Summary</h3>
            {campaign ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground line-clamp-2">{campaign.title}</h4>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Raised</span>
                    <span className="font-medium">₹{campaign.current_raised_amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percentFunded}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">{percentFunded}% of Goal</span>
                    <span className="text-muted-foreground">₹{campaign.goal_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No campaign selected.
              </div>
            )}
          </div>
          
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              HopeForLife does not charge any platform fee. 100% of your donation (minus payment gateway charges) goes directly to the patient's hospital account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}