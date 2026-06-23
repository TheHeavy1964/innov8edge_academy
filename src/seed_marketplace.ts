
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hyeadgajaysnxusgqvjk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZWFkZ2FqYXlzbnh1c2dxdmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTE2MTcsImV4cCI6MjA5NDEyNzYxN30.EkVPFjruEvkb9P-xdD9gn6I17oGBUKAVXOVIXRZ16Sc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const items = [
  {
    title: "Market Researcher Pro",
    type: "agent_squad",
    description: "A 3-agent squad designed to scrape, analyze, and summarize market trends for any industry.",
    stars: 124,
    downloads: 1200,
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
    tags: ["Research", "GPT-4o", "Web Scraping"],
    user_id: null // Will be assigned to a default user or anonymous
  },
  {
    title: "SaaS Cold Outreach",
    type: "prompt_template",
    description: "Highly optimized prompt for generating personalized LinkedIn outreach based on target profile data.",
    stars: 89,
    downloads: 3400,
    image_url: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80&w=400",
    tags: ["Sales", "Copywriting"],
    user_id: null
  },
  {
    title: "Enterprise MCP Bridge",
    type: "workflow",
    description: "A complex workflow connecting local Excel files to GPT-4o using a custom MCP server bridge.",
    stars: 256,
    downloads: 842,
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400",
    tags: ["Enterprise", "Automation", "MCP"],
    user_id: null
  }
];

async function seed() {
  console.log('Seeding marketplace...');
  
  const { data, error } = await supabase
    .from('marketplace_listings')
    .insert(items)
    .select();

  if (error) {
    console.error('Error seeding marketplace:', error.message);
  } else {
    console.log('Successfully seeded marketplace items:', data.length);
  }
}

seed();
