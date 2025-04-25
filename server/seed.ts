import { db } from "./db";
import { frameOptions, matOptions, glassOptions } from "@shared/schema";

/**
 * Seed script to populate the database with initial sample data
 */
export async function seed() {
  console.log("Starting database seed process...");

  // Check if db is available
  if (!db) {
    console.error("Database connection not available, cannot seed database");
    return;
  }

  try {
    // Check if we already have frame options in the database
    const existingFrames = await db.select().from(frameOptions);
    if (existingFrames.length === 0) {
      console.log("Inserting frame options...");
      await db?.insert(frameOptions).values([
        {
          name: "Walnut Classic",
          color: "#8B4513",
          material: "Wood",
          pricePerInch: 150, // $1.50 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Gold Leaf",
          color: "#D4AF37",
          material: "Metal",
          pricePerInch: 200, // $2.00 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Matte Black",
          color: "#2D2D2D",
          material: "Metal",
          pricePerInch: 165, // $1.65 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Rustic Barnwood",
          color: "#8A7F6C",
          material: "Wood",
          pricePerInch: 175, // $1.75 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Silver Modern",
          color: "#C0C0C0",
          material: "Metal",
          pricePerInch: 180, // $1.80 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "White Minimalist",
          color: "#FFFFFF",
          material: "Wood",
          pricePerInch: 145, // $1.45 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Mahogany",
          color: "#4E1500",
          material: "Wood",
          pricePerInch: 175, // $1.75 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Bronze",
          color: "#CD7F32",
          material: "Metal",
          pricePerInch: 185, // $1.85 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Distressed Blue",
          color: "#4A6D8C",
          material: "Wood",
          pricePerInch: 160, // $1.60 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Espresso Dark",
          color: "#3C2A21",
          material: "Wood",
          pricePerInch: 155, // $1.55 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Midnight Blue",
          color: "#191970",
          material: "Metal",
          pricePerInch: 170, // $1.70 per inch
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
      ]);
      console.log("Frame options inserted successfully");
    } else {
      console.log(`Found ${existingFrames.length} existing frame options, skipping insertion`);
    }

    // Check if we already have mat options in the database
    const existingMats = await db.select().from(matOptions);
    if (existingMats.length === 0) {
      console.log("Inserting mat options...");
      await db?.insert(matOptions).values([
        {
          name: "White",
          color: "#FFFFFF",
          price: 3500, // $35.00
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Ivory",
          color: "#FFFFF0",
          price: 3500, // $35.00
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Black",
          color: "#000000",
          price: 3800, // $38.00
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Navy Blue",
          color: "#000080",
          price: 3800, // $38.00
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Forest Green",
          color: "#228B22",
          price: 3800, // $38.00
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Burgundy",
          color: "#800020",
          price: 3800, // $38.00
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Charcoal Grey",
          color: "#36454F",
          price: 3800, // $38.00
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Cream",
          color: "#FFFDD0",
          price: 3500, // $35.00
          imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
      ]);
      console.log("Mat options inserted successfully");
    } else {
      console.log(`Found ${existingMats.length} existing mat options, skipping insertion`);
    }

    // Check if we already have glass options in the database
    const existingGlass = await db.select().from(glassOptions);
    if (existingGlass.length === 0) {
      console.log("Inserting glass options...");
      await db?.insert(glassOptions).values([
        {
          name: "Standard Clear",
          description: "Basic clear glass with no UV protection",
          price: 2500 // $25.00
        },
        {
          name: "UV Protection",
          description: "Blocks up to 97% of UV rays to protect your artwork",
          price: 4500 // $45.00
        },
        {
          name: "Museum Glass",
          description: "Premium anti-reflective glass with 99% UV protection",
          price: 8500 // $85.00
        },
        {
          name: "Non-Glare",
          description: "Reduces reflections for better viewing in bright environments",
          price: 5500 // $55.00
        },
        {
          name: "Conservation Clear",
          description: "Protects against 99% of UV light without changing the appearance",
          price: 6500 // $65.00
        },
        {
          name: "Acrylic Plexi",
          description: "Lightweight alternative to glass, shatter-resistant",
          price: 4000 // $40.00
        }
      ]);
      console.log("Glass options inserted successfully");
    } else {
      console.log(`Found ${existingGlass.length} existing glass options, skipping insertion`);
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Execute the seed function only when run directly (not when imported)
// This is left here for manual seeding via: npx tsx server/seed.ts
// The main app will import and call the seed function directly