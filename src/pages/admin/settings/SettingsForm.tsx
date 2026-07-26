import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      hero_title: '',
      hero_subtitle: '',
      child_name: '',
      about_text: '',
      target_amount: 0,
      currency: 'INR'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        reset(data);
      }
    } catch (error: any) {
      toast.error('Error fetching settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('platform_settings')
        .upsert({ id: 1, ...data });

      if (error) throw error;
      toast.success('Settings saved successfully');
    } catch (error: any) {
      toast.error('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Platform Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section / Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input id="hero_title" {...register('hero_title')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="child_name">Child's Name</Label>
                <Input id="child_name" {...register('child_name')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Input id="hero_subtitle" {...register('hero_subtitle')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_amount">Global Target Amount</Label>
                <Input id="target_amount" type="number" min="0" step="0.01" {...register('target_amount')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Global Currency</Label>
                <Input id="currency" {...register('currency')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="about_text">About Text (Footer/Short desc)</Label>
                <Textarea id="about_text" className="h-32" {...register('about_text')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}