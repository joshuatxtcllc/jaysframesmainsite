
import { storage } from "../storage";
import { ContentBlock, ContentImage, InsertContentBlock, UpdateContentBlock } from "../../shared/content-schema";
import fs from 'fs/promises';
import path from 'path';

class ContentManager {
  private contentBlocks: Map<string, ContentBlock> = new Map();
  private images: Map<string, ContentImage> = new Map();
  private contentCounter = 1;
  private imageCounter = 1;

  constructor() {
    this.initializeDefaultContent();
  }

  // Initialize with current site content
  private initializeDefaultContent() {
    const defaultContent: InsertContentBlock[] = [
      // Hero Section
      {
        key: 'hero_title',
        type: 'text',
        title: 'Hero Title',
        value: 'Houston\'s Premier Custom Framing Studio',
        description: 'Main headline on the homepage',
        section: 'hero',
        page: 'home'
      },
      {
        key: 'hero_subtitle',
        type: 'text',
        title: 'Hero Subtitle',
        value: 'Where Art Meets Innovation',
        description: 'Subtitle below the main headline',
        section: 'hero',
        page: 'home'
      },
      {
        key: 'hero_description',
        type: 'rich_text',
        title: 'Hero Description',
        value: 'Experience the future of custom framing with our AI-powered design tools, museum-quality preservation techniques, and expert craftsmanship. From consultation to installation, we make framing effortless.',
        description: 'Main description text in hero section',
        section: 'hero',
        page: 'home'
      },
      {
        key: 'hero_cta_primary',
        type: 'button',
        title: 'Primary CTA Button',
        value: 'Design Your Frame',
        description: 'Primary call-to-action button text',
        section: 'hero',
        page: 'home'
      },
      {
        key: 'hero_cta_secondary',
        type: 'button',
        title: 'Secondary CTA Button',
        value: 'Learn More',
        description: 'Secondary call-to-action button text',
        section: 'hero',
        page: 'home'
      },

      // About Section
      {
        key: 'about_title',
        type: 'text',
        title: 'About Section Title',
        value: 'Experience & Expertise',
        description: 'Title for the about section',
        section: 'about',
        page: 'home'
      },
      {
        key: 'about_description',
        type: 'rich_text',
        title: 'About Description',
        value: 'With decades of experience in custom framing, Jay\'s Frames combines traditional craftsmanship with cutting-edge technology to deliver exceptional results.',
        description: 'Description text for about section',
        section: 'about',
        page: 'home'
      },

      // Process Section
      {
        key: 'process_title',
        type: 'text',
        title: 'Process Section Title',
        value: 'Our Streamlined Process',
        description: 'Title for the process section',
        section: 'process',
        page: 'home'
      },
      {
        key: 'process_step1_title',
        type: 'text',
        title: 'Process Step 1 Title',
        value: 'Design Online',
        description: 'Title for first process step',
        section: 'process',
        page: 'home'
      },
      {
        key: 'process_step1_description',
        type: 'rich_text',
        title: 'Process Step 1 Description',
        value: 'Use our AI-powered frame designer to find the perfect combination of frame, mat, and glass for your artwork.',
        description: 'Description for first process step',
        section: 'process',
        page: 'home'
      },

      // Custom Framing Page
      {
        key: 'custom_framing_title',
        type: 'text',
        title: 'Custom Framing Page Title',
        value: 'Custom Framing Services',
        description: 'Main title for custom framing page',
        section: 'header',
        page: 'custom-framing'
      },
      {
        key: 'custom_framing_description',
        type: 'rich_text',
        title: 'Custom Framing Description',
        value: 'Transform your artwork, photographs, and memorabilia with our expert custom framing services.',
        description: 'Main description for custom framing page',
        section: 'header',
        page: 'custom-framing'
      },

      // Contact Information
      {
        key: 'contact_phone',
        type: 'text',
        title: 'Contact Phone',
        value: '(713) 555-FRAME',
        description: 'Primary phone number',
        section: 'contact',
        page: 'global'
      },
      {
        key: 'contact_email',
        type: 'text',
        title: 'Contact Email',
        value: 'info@jaysframes.com',
        description: 'Primary email address',
        section: 'contact',
        page: 'global'
      },
      {
        key: 'contact_address',
        type: 'text',
        title: 'Contact Address',
        value: '123 Art Street, Houston Heights, TX 77008',
        description: 'Physical address',
        section: 'contact',
        page: 'global'
      }
    ];

    defaultContent.forEach(content => {
      const id = this.contentCounter++;
      const now = new Date().toISOString();
      const contentBlock: ContentBlock = {
        ...content,
        id: id.toString(),
        createdAt: now,
        updatedAt: now
      };
      this.contentBlocks.set(contentBlock.key, contentBlock);
    });
  }

  // Get all content blocks
  async getAllContent(): Promise<ContentBlock[]> {
    return Array.from(this.contentBlocks.values());
  }

  // Get content by page
  async getContentByPage(page: string): Promise<ContentBlock[]> {
    return Array.from(this.contentBlocks.values()).filter(
      block => block.page === page || block.page === 'global'
    );
  }

  // Get content by section
  async getContentBySection(page: string, section: string): Promise<ContentBlock[]> {
    return Array.from(this.contentBlocks.values()).filter(
      block => block.page === page && block.section === section
    );
  }

  // Get single content block
  async getContent(key: string): Promise<ContentBlock | undefined> {
    return this.contentBlocks.get(key);
  }

  // Update content block
  async updateContent(key: string, updates: UpdateContentBlock): Promise<ContentBlock | undefined> {
    const existing = this.contentBlocks.get(key);
    if (!existing) return undefined;

    const updated: ContentBlock = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.contentBlocks.set(key, updated);
    return updated;
  }

  // Create new content block
  async createContent(content: InsertContentBlock): Promise<ContentBlock> {
    const id = this.contentCounter++;
    const now = new Date().toISOString();
    
    const newContent: ContentBlock = {
      ...content,
      id: id.toString(),
      createdAt: now,
      updatedAt: now
    };

    this.contentBlocks.set(newContent.key, newContent);
    return newContent;
  }

  // Delete content block
  async deleteContent(key: string): Promise<boolean> {
    return this.contentBlocks.delete(key);
  }

  // Image management
  async uploadImage(file: any, alt: string = ''): Promise<ContentImage> {
    const id = this.imageCounter++;
    const filename = `${Date.now()}-${file.originalname}`;
    const uploadPath = path.join(process.cwd(), 'client/public/uploads', filename);
    
    // Ensure uploads directory exists
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });
    
    // Save file
    await fs.writeFile(uploadPath, file.buffer);
    
    const image: ContentImage = {
      id: id.toString(),
      filename,
      originalName: file.originalname,
      url: `/uploads/${filename}`,
      alt,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    this.images.set(image.id, image);
    return image;
  }

  async getAllImages(): Promise<ContentImage[]> {
    return Array.from(this.images.values());
  }

  async getImage(id: string): Promise<ContentImage | undefined> {
    return this.images.get(id);
  }

  async deleteImage(id: string): Promise<boolean> {
    const image = this.images.get(id);
    if (!image) return false;

    // Delete file
    try {
      const filePath = path.join(process.cwd(), 'client/public', image.url);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting image file:', error);
    }

    return this.images.delete(id);
  }

  // Get all pages and sections for organization
  async getContentStructure(): Promise<{ pages: string[], sections: Record<string, string[]> }> {
    const content = Array.from(this.contentBlocks.values());
    const pages = [...new Set(content.map(block => block.page))];
    const sections: Record<string, string[]> = {};

    pages.forEach(page => {
      sections[page] = [...new Set(
        content
          .filter(block => block.page === page)
          .map(block => block.section)
      )];
    });

    return { pages, sections };
  }
}

export const contentManager = new ContentManager();
