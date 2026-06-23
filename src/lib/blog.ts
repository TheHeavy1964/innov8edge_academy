import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  image: string;
  featuredVideo?: string;
  featured?: boolean;
  status: string;
  content: string;
}

// Ensure directory exists
if (!fs.existsSync(contentDirectory)) {
  fs.mkdirSync(contentDirectory, { recursive: true });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const realSlug = slug.replace(/\.mdx$/, "");
    const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: realSlug,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      category: data.category || "Uncategorized",
      tags: data.tags || [],
      date: data.date || "",
      readTime: data.readTime || "",
      image: data.image || "",
      featuredVideo: data.featuredVideo || "",
      featured: data.featured || false,
      status: data.status || "draft",
      content,
    };
  } catch (error) {
    console.error(`Error reading blog post: ${slug}`, error);
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = fs.readdirSync(contentDirectory);
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => getPostBySlug(file))
    );

    // Filter out nulls and sort by date descending (naive string sort for now, better to parse Dates)
    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((post1, post2) => (new Date(post1.date) > new Date(post2.date) ? -1 : 1));
  } catch (error) {
    console.error("Error reading blog posts directory", error);
    return [];
  }
}
