// Image analysis utility for tomato detection
export interface ImageAnalysisResult {
  isValidPlant: boolean;
  confidence: number;
  dominantColors: string[];
}

/**
 * Analyzes an image to determine if it likely contains an infected plant
 * Uses color analysis to detect typical disease symptoms (brown spots, chlorosis/yellowing, necrosis)
 */
export const analyzeImageForDisease = (imageUrl: string): Promise<ImageAnalysisResult> => {
  return new Promise((resolve, reject) => {
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      reject(new Error('Image analysis timeout'));
    }, 10000); // 10 second timeout

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      clearTimeout(timeout);
      // ... rest of the function
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({ isValidPlant: false, confidence: 0, dominantColors: [] });
        return;
      }

      // Set canvas size to image size (but limit for performance)
      const maxSize = 800;
      let { width, height } = img;

      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas with scaling
      ctx.drawImage(img, 0, 0, width, height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Analyze colors
      const colorCounts: { [key: string]: number } = {};
      let totalPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Skip transparent pixels
        if (alpha < 128) continue;

        totalPixels++;

        // Convert to HSL for better color classification
        const hsl = rgbToHsl(r, g, b);
        const hue = hsl.h;
        const saturation = hsl.s;
        const lightness = hsl.l;

        // Classify colors - looking for plant features and disease symptoms
        let colorCategory = 'other';

        // Green tones (healthy or partially healthy leaves/stems)
        if (hue >= 60 && hue <= 160) {
          if (saturation > 0.15 && lightness > 0.15 && lightness < 0.8) {
            colorCategory = 'green';
          }
        }
        // Yellow tones (chlorosis, yellowing from disease/stress)
        else if (hue >= 35 && hue <= 60) {
          if (saturation > 0.2 && lightness > 0.3 && lightness < 0.85) {
            colorCategory = 'yellow';
          }
        }
        // Brown/Dark tones (necrosis, blight, fungus, disease spots)
        else if (hue >= 10 && hue <= 45) {
          if (saturation > 0.05 && lightness > 0.05 && lightness < 0.45) {
            colorCategory = 'brown';
          }
        }
        else if (lightness < 0.15) {
          colorCategory = 'dark'; // Severe rot or fungus
        }
        // Red tones (some healthy fruits, but we want to de-emphasize if not diseased)
        else if ((hue >= 0 && hue <= 15) || (hue >= 345 && hue <= 360)) {
           if (saturation > 0.4 && lightness > 0.25 && lightness < 0.75) {
            colorCategory = 'red';
          }
        }

        if (colorCategory !== 'other') {
          colorCounts[colorCategory] = (colorCounts[colorCategory] || 0) + 1;
        }
      }

      // Calculate percentages
      const greenPercentage = (colorCounts.green || 0) / totalPixels;
      const yellowPercentage = (colorCounts.yellow || 0) / totalPixels;
      const brownPercentage = (colorCounts.brown || 0) / totalPixels;
      const darkPercentage = (colorCounts.dark || 0) / totalPixels;

      // Infected plant logic
      // Must show signs of being a plant
      const isPlant = greenPercentage > 0.03 || (greenPercentage > 0.01 && yellowPercentage > 0.05);
      
      // Must show disease signs (brown necrotic spots, very dark patches, or high chlorosis/yellowing mixed with green)
      const hasDiseaseSigns = brownPercentage > 0.015 || darkPercentage > 0.03 || (yellowPercentage > 0.05 && greenPercentage > 0.02);

      // Check for minimum image quality (not too small)
      const minPixels = 10000;
      const hasMinimumSize = totalPixels > minPixels;

      const isValidPlant = isPlant && hasDiseaseSigns && hasMinimumSize;
      
      // Calculate a confidence score for UI based on how strongly it matches a diseased plant profile
      const plantScore = greenPercentage * 1.5 + yellowPercentage + brownPercentage * 2 + darkPercentage * 1.5;
      const confidence = Math.min(plantScore * 100, 100);

      console.log('Image Analysis:', {
        totalPixels,
        greenPercentage: (greenPercentage * 100).toFixed(2) + '%',
        yellowPercentage: (yellowPercentage * 100).toFixed(2) + '%',
        brownPercentage: (brownPercentage * 100).toFixed(2) + '%',
        darkPercentage: (darkPercentage * 100).toFixed(2) + '%',
        isPlant,
        hasDiseaseSigns,
        hasMinimumSize,
        isValidPlant
      });

      const dominantColors = Object.entries(colorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([color]) => color);

      resolve({
        isValidPlant,
        confidence: Math.round(confidence),
        dominantColors
      });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to load image for analysis'));
    };

    img.src = imageUrl;
  });
};

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s, l };
}