import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Understanding Acute Lymphoblastic Leukemia in Children',
      excerpt: 'A comprehensive guide to understanding ALL, its symptoms, and modern treatment approaches for pediatric patients.',
      date: 'May 15, 2026',
      category: 'Medical Education',
      slug: 'understanding-all'
    },
    {
      id: 2,
      title: 'The Importance of Bone Marrow Registry',
      excerpt: 'Why registering as a bone marrow donor is crucial and how a simple swab can save a life.',
      date: 'June 2, 2026',
      category: 'Awareness',
      slug: 'bone-marrow-registry'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Blog & Resources</h1>
        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
          Educational resources, awareness articles, and helpful information about childhood cancer and medical crowdfunding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="font-medium text-primary px-2 py-1 bg-primary/10 rounded-md">{post.category}</span>
              <span>{post.date}</span>
            </div>
            <h2 className="text-xl font-bold mb-3 text-foreground line-clamp-2">{post.title}</h2>
            <p className="text-muted-foreground mb-6 line-clamp-3 text-sm flex-1">
              {post.excerpt}
            </p>
            <Button variant="outline" className="w-fit" onClick={() => {}}>Read Article</Button>
          </div>
        ))}
      </div>
    </div>
  );
}