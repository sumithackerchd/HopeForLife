import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CampaignForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      beneficiary: '',
      hospital: '',
      goal_amount: 0,
      current_raised_amount: 0,
      category: 'medical',
      status: 'draft',
      story: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
    }
  });

  const watchTitle = watch('title');

  // Auto-generate slug from title if not explicitly set
  useEffect(() => {
    if (!isEdit && watchTitle) {
      const slug = watchTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  }, [watchTitle, isEdit, setValue]);

  useEffect(() => {
    if (isEdit) {
      fetchCampaign();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) {
        reset(data);
      }
    } catch (error: any) {
      toast.error('Error fetching campaign: ' + error.message);
      navigate('/admin/campaigns');
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('campaigns')
          .update(data)
          .eq('id', id);
        if (error) throw error;
        toast.success('Campaign updated successfully');
      } else {
        const { error } = await supabase
          .from('campaigns')
          .insert([data]);
        if (error) throw error;
        toast.success('Campaign created successfully');
      }
      navigate('/admin/campaigns');
    } catch (error: any) {
      toast.error('Error saving campaign: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Campaign' : 'Create Campaign'}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/campaigns')}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input id="title" {...register('title', { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input id="slug" {...register('slug', { required: true })} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="beneficiary">Beneficiary Name *</Label>
                <Input id="beneficiary" {...register('beneficiary', { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital / Location</Label>
                <Input id="hospital" {...register('hospital')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal_amount">Goal Amount (₹) *</Label>
                <Input id="goal_amount" type="number" min="0" step="0.01" {...register('goal_amount', { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_raised_amount">Current Raised Amount (₹)</Label>
                <Input id="current_raised_amount" type="number" min="0" step="0.01" {...register('current_raised_amount')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(val) => setValue('category', val)} value={watch('category')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(val) => setValue('status', val)} value={watch('status')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Campaign Story / Details</Label>
              <Textarea id="story" className="min-h-[200px]" {...register('story')} />
            </div>
            
            <h3 className="text-lg font-medium pt-4 border-t">SEO Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input id="seo_title" {...register('seo_title')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_keywords">SEO Keywords</Label>
                <Input id="seo_keywords" {...register('seo_keywords')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea id="seo_description" {...register('seo_description')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/campaigns')}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
}