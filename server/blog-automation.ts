import OpenAI from "openai";
import { storage } from "./storage";
import { insertBlogPostSchema, type InsertBlogPost } from "../shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Houston framing keywords to target for SEO recovery
const TARGET_KEYWORDS = [
  "picture framing houston",
  "houston frame shop", 
  "custom framing houston",
  "houston heights framing",
  "museum quality framing houston",
  "art framing houston",
  "professional framing houston",
  "conservation framing houston"
];

// Weekly blog post topics focused on Houston framing
const WEEKLY_TOPICS = [
  {
    theme: "Local Houston Art Scene",
    focus: "Featuring local Houston artists and galleries",
    keywords: ["houston art framing", "local artist framing", "houston gallery framing"]
  },
  {
    theme: "Conservation & Climate",
    focus: "Houston humidity and artwork preservation",
    keywords: ["houston climate framing", "humidity protection frames", "conservation framing houston"]
  },
  {
    theme: "Neighborhood Spotlight",
    focus: "Framing services in specific Houston areas",
    keywords: ["houston heights framing", "montrose picture framing", "river oaks custom frames"]
  },
  {
    theme: "Seasonal Projects",
    focus: "Seasonal framing projects and trends",
    keywords: ["seasonal framing houston", "holiday picture frames", "custom framing trends"]
  },
  {
    theme: "Behind the Scenes",
    focus: "Framing process and craftsmanship in Houston",
    keywords: ["custom framing process", "houston frame shop", "professional framing techniques"]
  }
];

interface BlogPostContent {
  title: string;
  content: string;
  excerpt: string;
  keywords: string[];
  slug: string;
}

export async function generateWeeklyBlogPost(): Promise<BlogPostContent | null> {
  try {
    // Get current week number to rotate topics
    const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7)) % WEEKLY_TOPICS.length;
    const topic = WEEKLY_TOPICS[weekNumber];
    
    // Select primary keyword for this week
    const primaryKeyword = TARGET_KEYWORDS[weekNumber % TARGET_KEYWORDS.length];
    
    const prompt = `Write a comprehensive blog post for Jay's Frames, a custom framing business in Houston Heights, Texas. 

TOPIC FOCUS: ${topic.theme} - ${topic.focus}
PRIMARY SEO KEYWORD: "${primaryKeyword}" (must appear 3-5 times naturally)
SECONDARY KEYWORDS: ${topic.keywords.join(", ")} (use 1-2 times each)

BUSINESS CONTEXT:
- Location: 218 W 27th St, Houston Heights, TX 77008
- Specializes in museum-quality, conservation framing
- Serves Houston's art collectors, galleries, and professionals
- Known for handling Houston's humidity challenges with proper conservation techniques

REQUIREMENTS:
1. Write 800-1000 words
2. Include Houston-specific references and local landmarks
3. Mention specific Houston neighborhoods (Heights, Montrose, River Oaks, etc.)
4. Include practical framing advice relevant to Houston's climate
5. End with a call-to-action for Houston customers
6. Write in a professional but approachable tone
7. Include specific examples related to the topic theme

STRUCTURE:
- Engaging title with primary keyword
- Introduction mentioning Houston location
- 3-4 main sections with subheadings
- Practical tips section
- Conclusion with local call-to-action

Focus on providing real value while naturally incorporating Houston framing keywords for SEO recovery.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional content writer specializing in local SEO and custom framing. Write engaging, informative blog posts that naturally incorporate target keywords while providing genuine value to readers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    // Extract title from the content (assuming it starts with # Title)
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.startsWith('#'));
    const title = titleLine ? titleLine.replace('#', '').trim() : `${topic.theme}: Houston Custom Framing Guide`;
    
    // Create excerpt from first paragraph
    const excerpt = content.split('\n\n')[1]?.substring(0, 200) + '...' || 
                   `Professional ${topic.theme.toLowerCase()} framing services in Houston Heights. Expert conservation techniques for Houston's unique climate.`;

    // Generate SEO-friendly slug
    const slug = title.toLowerCase()
                     .replace(/[^a-z0-9\s]/g, '')
                     .replace(/\s+/g, '-')
                     .substring(0, 60);

    // Combine all keywords
    const allKeywords = [primaryKeyword, ...topic.keywords, "houston framing", "custom frames"];

    return {
      title,
      content,
      excerpt,
      keywords: allKeywords,
      slug
    };

  } catch (error) {
    console.error("Error generating weekly blog post:", error);
    return null;
  }
}

export async function createAutomatedBlogPost(): Promise<boolean> {
  try {
    const blogContent = await generateWeeklyBlogPost();
    if (!blogContent) {
      console.error("Failed to generate blog content");
      return false;
    }

    // Check if a post with this slug already exists
    const existingPosts = await storage.getBlogPosts();
    const existingPost = existingPosts.find(post => post.slug === blogContent.slug);
    
    if (existingPost) {
      console.log(`Blog post with slug "${blogContent.slug}" already exists, skipping creation`);
      return false;
    }

    // Create the blog post
    const newPost: InsertBlogPost = {
      title: blogContent.title,
      slug: blogContent.slug,
      content: blogContent.content,
      excerpt: blogContent.excerpt,
      status: "published",
      categoryId: 1, // Assuming category 1 exists for framing tips
      keywords: blogContent.keywords.join(", "),
      metaTitle: blogContent.title.substring(0, 60),
      metaDescription: blogContent.excerpt.substring(0, 160),
      publishedAt: new Date()
    };

    await storage.createBlogPost(newPost);
    console.log(`Successfully created automated blog post: "${blogContent.title}"`);
    return true;

  } catch (error) {
    console.error("Error creating automated blog post:", error);
    return false;
  }
}

// Generate a preview of what the next blog post would be
export async function previewNextBlogPost(): Promise<BlogPostContent | null> {
  return await generateWeeklyBlogPost();
}