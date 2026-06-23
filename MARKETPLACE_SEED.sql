-- Seed script for Automation Marketplace
-- Run this in your Supabase SQL Editor to populate the live marketplace

INSERT INTO marketplace_listings (title, type, description, stars, downloads, image_url, tags, content, status, is_vetted)
VALUES 
(
    'Market Researcher Pro', 
    'agent_squad', 
    'A 3-agent squad designed to scrape, analyze, and summarize market trends for any industry.', 
    124, 
    1200, 
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400', 
    ARRAY['Research', 'GPT-4o', 'Web Scraping'],
    '[{"id": "a1", "name": "Researcher", "role": "Scrapes and collects data"}, {"id": "a2", "name": "Analyst", "role": "Finds patterns and insights"}, {"id": "a3", "name": "Writer", "role": "Drafts the final report"}]'::jsonb,
    'published',
    true
),
(
    'SaaS Cold Outreach', 
    'prompt_template', 
    'Highly optimized prompt for generating personalized LinkedIn outreach based on target profile data.', 
    89, 
    3400, 
    'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80&w=400', 
    ARRAY['Sales', 'Copywriting'],
    '{"system": "You are a world-class sales copywriter.", "user": "Write a LinkedIn message to {{prospect_name}} about {{product}}."}'::jsonb,
    'published',
    true
),
(
    'Enterprise MCP Bridge', 
    'workflow', 
    'A complex workflow connecting local Excel files to GPT-4o using a custom MCP server bridge.', 
    256, 
    842, 
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400', 
    ARRAY['Enterprise', 'Automation', 'MCP'],
    '{"nodes": [{"id": "1", "type": "excel_source"}, {"id": "2", "type": "mcp_bridge"}, {"id": "3", "type": "llm_process"}], "edges": [{"source": "1", "target": "2"}, {"source": "2", "target": "3"}]}'::jsonb,
    'published',
    true
),
(
    'Creative Writer Suite', 
    'agent_squad', 
    'Orchestrator and Editor agents that collaborate to turn a 1-sentence prompt into a 2000-word story.', 
    412, 
    5100, 
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400', 
    ARRAY['Creative', 'Claude 3.5'],
    '[{"id": "a1", "name": "Plotter", "role": "Creates story arcs"}, {"id": "a2", "name": "Drafter", "role": "Writes narrative text"}, {"id": "a3", "name": "Editor", "role": "Polishes and refines"}]'::jsonb,
    'published',
    true
);
