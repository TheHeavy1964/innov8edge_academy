import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Metadata } from "next";
import SandboxCTA from "@/components/mdx/SandboxCTA";
import Image from "next/image";

// Custom MDX Components mapping
const mdxComponents = {
  // Map standard image tags to responsive containers
  img: (props: any) => (
    <div className="my-8 rounded-2xl overflow-hidden border border-[var(--border-color)] relative aspect-video">
      <Image {...props} fill className="object-cover" />
    </div>
  ),
  // Add support for an explicit Video component inside MDX
  Video: (props: { src: string }) => (
    <div className="my-8 rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black">
      <video 
        src={props.src} 
        controls 
        className="w-full max-h-[600px] object-contain"
        poster=""
      />
    </div>
  ),
  // Custom Interactive Components
  SandboxCTA: (props: any) => <SandboxCTA {...props} />,
  // Styled headings
  h1: (props: any) => <h1 className="text-4xl font-black mt-12 mb-6 text-white" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-10 mb-5 text-white" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold mt-8 mb-4 text-white" {...props} />,
  p: (props: any) => <p className="text-lg leading-relaxed text-[var(--muted)] mb-6" {...props} />,
  a: (props: any) => <a className="text-[var(--primary-light)] hover:text-[var(--accent)] transition-colors underline decoration-white/20 underline-offset-4" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-6 text-lg text-[var(--muted)] space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-6 text-lg text-[var(--muted)] space-y-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-[var(--accent)] bg-[var(--accent)]/5 pl-6 py-4 pr-4 my-8 rounded-r-xl italic text-white/90" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-[#111D13] border border-white/10 rounded-xl p-4 overflow-x-auto my-8 text-sm" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-[#111D13] text-[var(--celadon)] px-1.5 py-0.5 rounded-md border border-white/5 font-mono text-sm" {...props} />
  )
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Innov8Edge'],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A120B] text-white pt-32 pb-24 relative">
      {/* Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(65,93,67,0.15),transparent_70%)] pointer-events-none" />
      
      <article className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Hero Section */}
        <header className="mb-12 md:mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[10px] md:text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
              <Calendar className="w-3 md:w-3.5 h-3 md:h-3.5" />
              {post.date}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
              <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" />
              {post.readTime}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-3xl mb-8 md:mb-12">
            {post.excerpt}
          </p>

          {/* Featured Media (Video preferred over image if both exist) */}
          <div className="w-full rounded-[32px] overflow-hidden border border-[var(--border-color)] bg-[#111D13] shadow-2xl">
            {post.featuredVideo ? (
              <video 
                src={post.featuredVideo} 
                poster={post.image}
                controls 
                autoPlay 
                muted 
                loop 
                className="w-full h-auto object-cover max-h-[600px]"
              />
            ) : (
              <div className="relative aspect-video">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </header>

        {/* MDX Content Rendering */}
        <div className="prose prose-invert prose-lg max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-4 text-[var(--muted)] font-bold text-sm">
              <Tag className="w-4 h-4" /> Tags:
            </div>
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[var(--muted)] uppercase tracking-wider font-bold">
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
