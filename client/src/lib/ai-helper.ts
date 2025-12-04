
// utils/framing.ts
// ----------------------------------------------------------------------------------
// Production-ready utilities for analyzing artwork & providing frame/mat recommendations
// using image-driven features + catalog metadata + industry standards.
// ----------------------------------------------------------------------------------

import { FrameOption, MatOption, ArtworkAnalysis } from '@/types';

/* ---------------------------------------------
 * FETCH HELPERS (with timeout + safe error parsing)
 * --------------------------------------------- */

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10000
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = "Request failed";
      try {
        const errBody = await response.json();
        message = errBody?.message || message;
      } catch {
        /* ignore json parse errors */
      }
      throw new Error(message);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

/* ---------------------------------------------
 * CLIENT: Send artwork image → get analysis
 * --------------------------------------------- */

export async function analyzeArtworkImage(file: File): Promise<ArtworkAnalysis> {
  const formData = new FormData();
  formData.append('image', file);

  return await fetchWithTimeout('/api/artwork-analysis', {
    method: 'POST',
    body: formData,
  });
}

/* ---------------------------------------------
 * FRAME / MAT CATALOG METADATA (strongly typed)
 * --------------------------------------------- */

interface FrameCollectionInfo {
  style: string;
  features: string;
  bestFor: string;
  description: string;
}

interface MatTypeInfo {
  texture: string;
  finish: string;
  conservation: boolean;
  bestFor: string;
  description: string;
}

const FRAME_COLLECTIONS: Record<string, FrameCollectionInfo> = {
  Academie: {
    style: 'traditional',
    features: 'ornate, classic, decorative',
    bestFor: 'classical artwork, portraits, traditional decor',
    description: 'Elegant traditional designs with ornate details',
  },
  Allegra: {
    style: 'contemporary',
    features: 'sleek, clean lines, minimal',
    bestFor: 'modern art, photography, contemporary decor',
    description: 'Modern frames with clean lines and subtle details',
  },
  Alloy: {
    style: 'modern',
    features: 'metallic, industrial, sleek',
    bestFor: 'photography, abstract art, industrial decor',
    description: 'Metal-inspired frames with contemporary styling',
  },
  Alto: {
    style: 'minimalist',
    features: 'thin, sleek, lightweight',
    bestFor: 'photography, prints, minimalist decor',
    description: 'Slim profile frames for a subtle framing solution',
  },
  Ambrosia: {
    style: 'rustic',
    features: 'textured, natural, organic',
    bestFor: 'nature images, landscapes, rustic decor',
    description: 'Textured frames with natural, organic feel',
  },
  Andover: {
    style: 'transitional',
    features: 'versatile, refined, classic',
    bestFor: 'multi-purpose framing, transitional decor',
    description: 'Versatile frames bridging traditional & contemporary styles',
  },
};

const MAT_TYPES: Record<string, MatTypeInfo> = {
  Antique: {
    texture: 'textured',
    finish: 'matte',
    conservation: true,
    bestFor: 'historical artwork, antique prints, vintage photography',
    description: 'Subtle texture that mimics aged paper',
  },
  Suede: {
    texture: 'textured',
    finish: 'soft',
    conservation: true,
    bestFor: 'high-end artwork, photography, paintings',
    description: 'Soft velvety finish with rich depth',
  },
  Linen: {
    texture: 'textured',
    finish: 'woven',
    conservation: true,
    bestFor: 'traditional artwork, watercolors, sketches',
    description: 'Fine cloth-like woven texture',
  },
  White: {
    texture: 'smooth',
    finish: 'matte',
    conservation: true,
    bestFor: 'contemporary art, photography, general purpose',
    description: 'Clean bright neutral white',
  },
  Black: {
    texture: 'smooth',
    finish: 'matte',
    conservation: true,
    bestFor: 'bold artwork, photography, graphic art',
    description: 'Deep, rich black for dramatic presentation',
  },
  Ivory: {
    texture: 'smooth',
    finish: 'matte',
    conservation: true,
    bestFor: 'warmer artwork, historical pieces, vintage prints',
    description: 'Warm off-white tone with cream undertones',
  },
};

/* ---------------------------------------------
 * Safe matching helpers (case-insensitive, avoids collisions)
 * --------------------------------------------- */

function matchCatalogKey(name: string, catalog: Record<string, any>): string | null {
  const lower = name.toLowerCase();

  // Match only *whole* words, not partial substrings
  return (
    Object.keys(catalog).find(key => {
      const regex = new RegExp(`\\b${key.toLowerCase()}\\b`, "i");
      return regex.test(lower);
    }) || null
  );
}

/* ---------------------------------------------
 * ENRICH FRAME OPTIONS
 * --------------------------------------------- */

export function enrichFrameData(frames: FrameOption[]): FrameOption[] {
  return frames.map(frame => {
    const key = matchCatalogKey(frame.name, FRAME_COLLECTIONS);
    return key
      ? {
          ...frame,
          collection: key,
          collectionInfo: FRAME_COLLECTIONS[key],
        }
      : frame;
  });
}

/* ---------------------------------------------
 * ENRICH MAT OPTIONS
 * --------------------------------------------- */

export function enrichMatData(mats: MatOption[]): MatOption[] {
  return mats.map(mat => {
    const key = matchCatalogKey(mat.name, MAT_TYPES);
    return key
      ? {
          ...mat,
          matType: key,
          matInfo: MAT_TYPES[key],
        }
      : mat;
  });
}

/* ---------------------------------------------
 * GUIDELINES (industry standard framing rules)
 * --------------------------------------------- */

export const framingGuidelines = {
  photography: {
    recommended:
      "Clean, simple frames (matte black/white/metal). Avoid ornate styles. Consider metal for contemporary, warm woods for vintage.",
    matOptions:
      "Conservation mats (white/neutral). Double mats add depth. Avoid bright colors unless part of design.",
    glassOptions: "UV-protective for everything; museum glass for archival prints.",
  },
  paintings: {
    recommended:
      "Match style to period. Traditional paintings → ornate wood; modern → clean profiles.",
    matOptions:
      "Oil paintings: no mats. Watercolors/paper: conservation mats only.",
    glassOptions:
      "Oil: no glass. Watercolors/paper: UV-protective or museum glass.",
  },
  prints: {
    recommended:
      "Let the print's era + palette guide frame style. Limited editions → conservation framing.",
    matOptions:
      "Acid-free mats; consider double mats; complementary neutral colors.",
    glassOptions:
      "UV-protective recommended for all prints.",
  },
  documents: {
    recommended:
      "Clean, professional frames (blacks, silvers, dark woods).",
    matOptions:
      "Conservation matting mandatory; white/ivory/black preferred.",
    glassOptions:
      "Museum or conservation glass.",
  },
  memorabilia: {
    recommended:
      "Shadowboxes for 3D items; depth required.",
    matOptions:
      "Acid-free backing/mats; creative cuts to highlight elements.",
    glassOptions:
      "UV-protective glass essential.",
  },
};

/* ----------------------------------------------------------------------------------
 * MAIN ENTRY: Generate a full framing recommendation using image analysis + catalogs
 * ---------------------------------------------------------------------------------- */

export function generateFrameDesign(
  analysis: ArtworkAnalysis,
  availableFrames: FrameOption[],
  availableMats: MatOption[]
) {
  const enrichedFrames = enrichFrameData(availableFrames);
  const enrichedMats = enrichMatData(availableMats);

  const {
    dominantColors,
    medium,
    style,
    contrastLevel,
    brightness,
    subject,
  } = analysis;

  /* ---- FRAME SELECTION LOGIC (image-aware) ---- */

  const isModern = ['modern', 'abstract', 'minimalist'].includes(style);
  const isTraditional = ['classical', 'portrait', 'realism'].includes(style);

  const recommendedFrames = enrichedFrames.filter(f => {
    const c = f.collectionInfo?.style;

    if (isModern && ['minimalist', 'modern', 'contemporary'].includes(c)) return true;
    if (isTraditional && ['traditional', 'transitional'].includes(c)) return true;

    // fallback: match brightness/contrast
    if (contrastLevel === 'high' && f.color === 'black') return true;
    if (brightness === 'light' && f.color === 'white') return true;

    return false;
  });

  /* ---- MAT SELECTION LOGIC (image-aware) ---- */

  const recommendedMats = enrichedMats.filter(m => {
    if (medium === 'oil') return false; // oils don't get mats

    // Match neutral to dominant colors
    const name = m.matType?.toLowerCase() || "";
    if (dominantColors.some(c => name.includes(c))) return true;

    // fallback: white/black/ivory neutral standards
    if (['white', 'black', 'ivory'].includes(name)) return true;

    return false;
  });

  return {
    frames: recommendedFrames,
    mats: recommendedMats,
    guidelines: framingGuidelines[medium] || framingGuidelines.prints,
  };
}
