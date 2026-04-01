// Image analysis utility for tomato detection
export interface ImageAnalysisResult {
  isTomato: boolean;
  confidence: number;
  dominantColors: string[];
}

/**
 * Analyzes an image to determine if it likely contains a tomato
 * Uses color analysis to detect tomato-like colors (reds, greens, yellows)
 */
export const analyzeImageForTomato = (imageUrl: string): Promise<ImageAnalysisResult> => {
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
        resolve({ isTomato: false, confidence: 0, dominantColors: [] });
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

        // Classify colors - more specific to tomato characteristics
        let colorCategory = 'other';

        // Red tones (tomato red/pink) - more specific range
        if ((hue >= 0 && hue <= 15) || (hue >= 345 && hue <= 360)) {
          if (saturation > 0.4 && lightness > 0.25 && lightness < 0.75) {
            colorCategory = 'red';
          }
        }
        // Green tones (tomato leaves/stems) - more specific range
        else if (hue >= 90 && hue <= 140) {
          if (saturation > 0.25 && lightness > 0.2 && lightness < 0.65) {
            colorCategory = 'green';
          }
        }
        // Yellow/Orange tones (ripe tomatoes) - more specific range
        else if (hue >= 35 && hue <= 65) {
          if (saturation > 0.4 && lightness > 0.35 && lightness < 0.85) {
            colorCategory = 'yellow';
          }
        }

        if (colorCategory !== 'other') {
          colorCounts[colorCategory] = (colorCounts[colorCategory] || 0) + 1;
        }
      }

      // Calculate percentages
      const redPercentage = (colorCounts.red || 0) / totalPixels;
      const greenPercentage = (colorCounts.green || 0) / totalPixels;
      const yellowPercentage = (colorCounts.yellow || 0) / totalPixels;

      // Tomato detection logic - more strict criteria
      const tomatoColorScore = redPercentage * 2 + yellowPercentage * 1.5 + greenPercentage * 0.5;

      // Additional check: ensure there's a reasonable balance of colors
      // Tomato images typically have both fruit colors (red/yellow) and plant colors (green)
      const fruitColors = redPercentage + yellowPercentage;
      const hasBalancedColors = fruitColors > 0.12 && greenPercentage > 0.04;
      const hasHighFruitContent = fruitColors > 0.25;

      // Check for minimum image quality (not too small)
      const minPixels = 10000; // Minimum 100x100 pixels roughly
      const hasMinimumSize = totalPixels > minPixels;

      // More strict threshold and additional checks
      const strongTomato =
        tomatoColorScore > 0.35 &&
        hasMinimumSize &&
        (hasBalancedColors || hasHighFruitContent);

      // Fallback path for close tomato images (e.g., fruits dominate, leaves may be low in frame)
      const fallbackTomato =
        tomatoColorScore > 0.27 &&
        hasMinimumSize &&
        (fruitColors > 0.16 || redPercentage > 0.16);

      const isTomato = strongTomato || fallbackTomato;
      const confidence = Math.min(tomatoColorScore * 100, 100);

      console.log('Image Analysis:', {
        totalPixels,
        redPercentage: (redPercentage * 100).toFixed(2) + '%',
        greenPercentage: (greenPercentage * 100).toFixed(2) + '%',
        yellowPercentage: (yellowPercentage * 100).toFixed(2) + '%',
        fruitColors: (fruitColors * 100).toFixed(2) + '%',
        tomatoColorScore: (tomatoColorScore * 100).toFixed(2) + '%',
        hasBalancedColors,
        hasHighFruitContent,
        hasMinimumSize,
        strongTomato,
        fallbackTomato,
        finalIsTomato: isTomato
      });

      const dominantColors = Object.entries(colorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([color]) => color);

      resolve({
        isTomato,
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