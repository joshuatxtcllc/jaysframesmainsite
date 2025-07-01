// AI Helper Utilities
import { FrameOption, MatOption } from '@/types';

/**
 * Client-side function to get frame recommendations from the server API
 * @param artworkDescription Text description of the artwork
 */
export async function getFrameRecommendations(artworkDescription: string) {
  try {
    const response = await fetch('/api/frame-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: artworkDescription }),
    });

    if (!response.ok) {
      throw new Error('Failed to get frame recommendations');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting frame recommendations:', error);
    throw error;
  }
}

/**
 * Provides enhanced information about frame options based on the Larson-Juhl catalog
 * This helps the AI make more informed recommendations
 */
export function enrichFrameData(frameOptions: FrameOption[]): FrameOption[] {
  // Map of frame collection info from Larson-Juhl catalog
  const frameCollections: Record<string, any> = {
    'Academie': {
      style: 'traditional',
      features: 'ornate, classic, decorative',
      bestFor: 'classical artwork, portraits, traditional decor',
      description: 'Elegant traditional designs with ornate details'
    },
    'Allegra': {
      style: 'contemporary',
      features: 'sleek, clean lines, minimal',
      bestFor: 'modern art, photography, contemporary decor',
      description: 'Modern frames with clean lines and subtle details'
    },
    'Alloy': {
      style: 'modern',
      features: 'metallic, industrial, sleek',
      bestFor: 'photography, abstract art, industrial decor',
      description: 'Metal-inspired frames with contemporary styling'
    },
    'Alto': {
      style: 'minimalist',
      features: 'thin, sleek, lightweight',
      bestFor: 'photography, prints, minimalist decor',
      description: 'Slim profile frames for a subtle framing solution'
    },
    'Ambrosia': {
      style: 'rustic',
      features: 'textured, natural, organic',
      bestFor: 'nature images, landscapes, rustic decor',
      description: 'Textured frames with natural, organic feel'
    },
    'Andover': {
      style: 'transitional',
      features: 'versatile, refined, classic',
      bestFor: 'multi-purpose framing, transitional decor',
      description: 'Versatile frames that bridge traditional and contemporary styles'
    }
  };

  // Enhance frame options with catalog information
  return frameOptions.map(frame => {
    // Try to identify collection by name pattern matching
    const collectionName = Object.keys(frameCollections).find(
      collection => frame.name.includes(collection)
    );

    if (collectionName) {
      return {
        ...frame,
        collection: collectionName,
        collectionInfo: frameCollections[collectionName]
      };
    }

    return frame;
  });
}

/**
 * Provides enhanced information about mat options based on the Crescent Select catalog
 * This helps the AI make more informed recommendations
 */
export function enrichMatData(matOptions: MatOption[]): MatOption[] {
  // Information from Crescent Select® matboards catalog
  const matProperties: Record<string, any> = {
    'Antique': {
      texture: 'textured',
      finish: 'matte',
      conservation: true,
      bestFor: 'historical artwork, antique prints, vintage photography',
      description: 'Subtle texture that mimics aged paper'
    },
    'Suede': {
      texture: 'textured',
      finish: 'soft',
      conservation: true,
      bestFor: 'high-end artwork, photography, paintings',
      description: 'Soft, velvety finish with rich depth'
    },
    'Linen': {
      texture: 'textured',
      finish: 'woven',
      conservation: true,
      bestFor: 'traditional artwork, watercolors, sketches',
      description: 'Fine cloth-like texture similar to woven fabric'
    },
    'White': {
      texture: 'smooth',
      finish: 'matte',
      conservation: true,
      bestFor: 'contemporary art, photography, general purpose',
      description: 'Clean, bright white with neutral undertones'
    },
    'Black': {
      texture: 'smooth',
      finish: 'matte',
      conservation: true,
      bestFor: 'bold artwork, photography, graphic art',
      description: 'Deep, rich black for dramatic presentation'
    },
    'Ivory': {
      texture: 'smooth',
      finish: 'matte',
      conservation: true,
      bestFor: 'warmer artwork, historical pieces, vintage prints',
      description: 'Warm off-white tone with subtle cream undertones'
    }
  };

  // Enhance mat options with catalog information
  return matOptions.map(mat => {
    // Try to identify mat type by name pattern matching
    const matType = Object.keys(matProperties).find(
      type => mat.name.includes(type)
    );

    if (matType) {
      return {
        ...mat,
        matType: matType,
        matInfo: matProperties[matType]
      };
    }

    return mat;
  });
}

/**
 * Provides context about framing choices based on artwork type
 * Sourced from professional framing knowledge
 */
export const framingGuidelines = {
  photography: {
    recommended: "Clean, simple frames that don't compete with the image. Consider metal frames for contemporary photos and wood for vintage or warm-toned images.",
    matOptions: "Conservation mats are essential for valuable photos. Double or triple matting can add depth. Consider white, black, or neutral colors that complement but don't compete with the image.",
    glassOptions: "UV-protective glass is recommended to prevent fading, especially for color photography."
  },
  paintings: {
    recommended: "Frame style should complement the painting's period and style. Traditional paintings often work well with classic profiles, while modern works pair with simpler frames.",
    matOptions: "Oil paintings typically don't require mats. For watercolors and other works on paper, acid-free conservation mats are essential.",
    glassOptions: "Oil paintings don't require glass. Watercolors and works on paper should use UV-protective glass or museum glass for valuable works."
  },
  prints: {
    recommended: "Frame choice should be guided by the print's style and color palette. Limited editions deserve conservation-quality framing.",
    matOptions: "Acid-free, lignin-free mats are essential. Decorative cuts can enhance certain prints. Mat color should complement, not compete with, the artwork.",
    glassOptions: "UV-protective glass is recommended for all prints to prevent fading."
  },
  documents: {
    recommended: "Clean, professional frames work best. Consider the document's importance and formality.",
    matOptions: "Conservation-quality, acid-free mats are essential. Neutral colors like white, ivory, or black are typically most appropriate.",
    glassOptions: "Museum glass or conservation glass is recommended for important documents."
  },
  memorabilia: {
    recommended: "Frame depth should accommodate the items. Shadowbox frames work well for dimensional objects.",
    matOptions: "Acid-free backing and mats are essential. Consider creative mat cutting to highlight specific elements.",
    glassOptions: "UV-protective glass is important to prevent fading of ephemera."
  }
};