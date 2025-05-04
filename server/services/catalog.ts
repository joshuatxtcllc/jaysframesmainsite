import { FrameOption, InsertFrameOption } from "@shared/schema";
import { storage } from "../storage";

interface LarsonJuhlCatalogItem {
  collection: string;
  style: string;
  sku: string;
  color: string;
  material: string;
  pricePerInch: number;
  width: number;
  description?: string;
  imageUrl?: string;
}

// This is a sample of the Larson Juhl catalog entries
// In a production environment, you would parse the DOCX file or 
// connect to their API for real-time pricing
const larsonJuhlCatalog: LarsonJuhlCatalogItem[] = [
  // Classic Collections
  {
    collection: "Academie",
    style: "traditional",
    sku: "ACAD-001",
    color: "#6E4C1E",
    material: "Wood",
    pricePerInch: 195, // $1.95 per inch
    width: 30,
    description: "Ornate gold leaf traditional frame with floral pattern"
  },
  {
    collection: "Academie",
    style: "traditional",
    sku: "ACAD-002",
    color: "#8B5A2B",
    material: "Wood",
    pricePerInch: 210, // $2.10 per inch
    width: 35,
    description: "Wide traditional frame with deep brown finish"
  },
  {
    collection: "Allure",
    style: "contemporary",
    sku: "ALLU-001",
    color: "#2C2C2C",
    material: "Metal",
    pricePerInch: 175, // $1.75 per inch
    width: 22,
    description: "Sleek black metal frame with subtle texture"
  },
  {
    collection: "Allure",
    style: "contemporary",
    sku: "ALLU-002",
    color: "#C0C0C0",
    material: "Metal",
    pricePerInch: 180, // $1.80 per inch
    width: 22,
    description: "Brushed silver metal frame for contemporary settings"
  },

  // Modern Collections
  {
    collection: "Metro",
    style: "modern",
    sku: "METR-001",
    color: "#000000",
    material: "Metal",
    pricePerInch: 150, // $1.50 per inch
    width: 18,
    description: "Minimalist black metal frame with clean lines"
  },
  {
    collection: "Metro",
    style: "modern",
    sku: "METR-002",
    color: "#FFFFFF",
    material: "Metal",
    pricePerInch: 155, // $1.55 per inch
    width: 18,
    description: "Clean white metal frame for gallery-style presentation"
  },

  // Premium Collections
  {
    collection: "Biltmore",
    style: "luxury",
    sku: "BILT-001",
    color: "#704214",
    material: "Wood",
    pricePerInch: 250, // $2.50 per inch
    width: 40,
    description: "Premium wide wood frame with gold leaf accents"
  },
  {
    collection: "Biltmore",
    style: "luxury",
    sku: "BILT-002",
    color: "#B87333",
    material: "Wood",
    pricePerInch: 265, // $2.65 per inch
    width: 45,
    description: "Copper-toned luxury frame with ornate detailing"
  },

  // Designer Collections
  {
    collection: "Linea",
    style: "minimalist",
    sku: "LINE-001",
    color: "#2E2E2E",
    material: "Wood",
    pricePerInch: 165, // $1.65 per inch
    width: 15,
    description: "Thin profile black wood frame for subtle framing"
  },
  {
    collection: "Linea",
    style: "minimalist",
    sku: "LINE-002",
    color: "#F5F5F5",
    material: "Wood",
    pricePerInch: 170, // $1.70 per inch
    width: 15,
    description: "Slim off-white frame for modern interiors"
  },

  // Natural Collections
  {
    collection: "Hanover",
    style: "rustic",
    sku: "HANO-001",
    color: "#8B4513",
    material: "Wood",
    pricePerInch: 185, // $1.85 per inch
    width: 28,
    description: "Rustic walnut frame with visible wood grain"
  },
  {
    collection: "Hanover",
    style: "rustic",
    sku: "HANO-002",
    color: "#A0522D",
    material: "Wood",
    pricePerInch: 190, // $1.90 per inch
    width: 28,
    description: "Natural wood frame with sienna finish"
  }
];

// Function to import Larson Juhl catalog into the system
export async function importLarsonJuhlCatalog(): Promise<FrameOption[]> {
  // Create frame options from the catalog
  const newFrameOptions: InsertFrameOption[] = larsonJuhlCatalog.map(item => ({
    name: `${item.collection} ${item.sku}`,
    color: item.color,
    material: item.material,
    pricePerInch: item.pricePerInch,
    imageUrl: item.imageUrl || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    // Add additional properties in the details field
    details: {
      collection: item.collection,
      style: item.style,
      sku: item.sku,
      description: item.description,
      details: {
        width: item.width
      }
    }
  }));

  // Import the new frame options to storage
  const importedFrames: FrameOption[] = [];
  for (const frameOption of newFrameOptions) {
    const newFrame = await storage.createFrameOption(frameOption);
    if (newFrame) {
      importedFrames.push(newFrame);
    }
  }

  return importedFrames;
}

// Function to get all Larson Juhl frames
export async function getLarsonJuhlFrames(): Promise<FrameOption[]> {
  const frameOptions = await storage.getFrameOptions();

  // Filter frames that belong to Larson Juhl collections
  const larsonJuhlCollections = new Set(larsonJuhlCatalog.map(item => item.collection));

  return frameOptions.filter(frame => {
    const details = frame.details as any;
    return details && details.collection && larsonJuhlCollections.has(details.collection);
  });
}

// Function to get frame options by collection
export async function getFrameOptionsByCollection(collection: string): Promise<FrameOption[]> {
  const frameOptions = await storage.getFrameOptions();

  return frameOptions.filter(frame => {
    const details = frame.details as any;
    return details && details.collection === collection;
  });
}

// Function to get all unique Larson Juhl collections
export async function getLarsonJuhlCollections(): Promise<string[]> {
  const frames = await getLarsonJuhlFrames();
  const collections = new Set<string>();

  frames.forEach(frame => {
    const details = frame.details as any;
    if (details && details.collection) {
      collections.add(details.collection);
    }
  });

  return Array.from(collections);
}

// Export helper functions for working with Larson Juhl catalog data
export const larsonJuhlCatalogService = {
  importCatalog: importLarsonJuhlCatalog,
  getFrames: getLarsonJuhlFrames,
  getFramesByCollection: getFrameOptionsByCollection,
  getCollections: getLarsonJuhlCollections
};