import Link from "next/link";
import { ArrowRight, Calendar, Clock, ChevronRight, Tag } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import Image from "next/image";

const CATEGORIES = ["All", "AI Agents", "Engineering", "Guides", "Platform Updates"];

export default async function BlogIndexPage() {
  const allPosts = await getAllPosts();
  
  // Only show published posts, prioritize featured
  const publishedPosts = allPosts.filter(p => p.status === 'published');
  const featuredPost = publishedPosts.find(p => p.featured) || publishedPosts[0];
  const regularPosts = publishedPosts.filter(p => p.slug !== featuredPost?.slug);

  return (
    <div className="min-h-screen bg-[#0A120B] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(143,185,150,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[var(--hunter-green)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">The Edge</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Insights from the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--celadon)] to-[var(--muted-teal)]">
              Frontier of AI
            </span>
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Deep dives into autonomous agents, Model Context Protocol, workflow automation, and how to build the systems of tomorrow.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {CATEGORIES.map((cat, i) => (
            <button 
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                i === 0 
                  ? 'bg-[var(--accent)] text-[#0A120B] shadow-lg shadow-[var(--accent)]/20' 
                  : 'bg-white/5 border border-white/10 text-[var(--muted)] hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="group block mb-20">
            <div className="relative rounded-[32px] overflow-hidden border border-[var(--border-color)] bg-white/[0.02] grid grid-cols-1 lg:grid-cols-2 gap-0 lg:h-[500px]">
              <div className="relative h-[300px] lg:h-full overflow-hidden">
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A120B] to-transparent opacity-80 lg:opacity-0" />
              </div>
              
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-[#0A120B] lg:bg-transparent lg:bg-gradient-to-l from-[#0A120B] via-[#0A120B] to-transparent">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    {featuredPost.date}
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight group-hover:text-[var(--primary-light)] transition-colors">
                  {featuredPost.title}
                </h2>
                
                <p className="text-[var(--muted)] mb-8 text-lg leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center gap-6 mt-auto">
                  <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col glass-strong rounded-3xl border border-[var(--border-color)] overflow-hidden hover:border-[var(--primary)]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--primary)]/10">
              <div className="h-48 relative overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md bg-[#0A120B]/80 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-[var(--primary-light)] transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-[var(--muted)] text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)] mt-auto">
                  <div className="text-xs font-bold text-white group-hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                    Read More <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA to Sandbox/Trial */}
        <div className="mt-32 p-1 relative rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--hunter-green)] via-[var(--primary)] to-[var(--celadon)] opacity-30 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative bg-[#0A120B] rounded-[31px] p-12 md:p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] flex items-center justify-center mb-8 shadow-lg shadow-[var(--accent)]/20">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Stop reading. <br/>Start building.</h2>
            <p className="text-[var(--muted)] text-lg mb-10 max-w-2xl">
              Knowledge is power, but execution is everything. Jump into the Agent Simulator right now and start automating the boring stuff.
            </p>
            <Link href="/auth" className="btn-primary py-4 px-10 text-lg shadow-xl shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:-translate-y-1 transition-all">
              Start 7-Day Free Trial
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
