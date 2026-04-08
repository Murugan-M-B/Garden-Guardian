// Image analysis utility with TensorFlow AI classification
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

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
    img.onload = async () => {
      clearTimeout(timeout);
      
      // Setup AI verification flags
      let isFormallyAPlant = false;
      let aiClassifications = '';
      
      try {
        console.log('Loading AI model for strict object verification...');
        await tf.ready();
        const model = await mobilenet.load();
        const predictions = await model.classify(img);
        aiClassifications = predictions.map(p => p.className.toLowerCase()).join(' ');
        console.log('TensorFlow AI Predictions:', predictions);
        
        // Comprehensive list of nature/plant identifiers
        const plantKeywords = [
          'plant', 'leaf', 'flower', 'tree', 'grass', 'garden', 'pot', 'vase', 
          'broccoli', 'cabbage', 'cauliflower', 'cucumber', 'zucchini', 'squash', 
          'tomato', 'vegetable', 'fruit', 'bell pepper', 'strawberry', 'apple', 
          'lemon', 'orange', 'weed', 'vine', 'bush', 'fern', 'moss', 'produce', 
          'crop', 'soil', 'earth', 'ground', 'mushroom', 'fungus', 'wood', 'plantain', 
          'daisy', 'rose', 'greenhouse'
        ];
        
        // Extremely powerful check to block dogs, people, cars, furniture, etc.
        isFormallyAPlant = plantKeywords.some(kw => aiClassifications.includes(kw));
        
        if (!isFormallyAPlant) {
           console.warn("AI definitively confirms this is NOT a plant object. Found:", aiClassifications);
        }
      } catch (e) {
        console.error('AI classification failed, falling back to color logic only', e);
        // Fallback flag if network issue prevents AI model download
        isFormallyAPlant = true; 
      }

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

        // Acknowledge neutral colors (white, grey, black, sky)
        if (lightness > 0.85 || saturation < 0.15) {
          colorCategory = 'neutral';
        }
        else if (lightness < 0.15) {
          colorCategory = 'dark'; // Could be necrosis or deep shadow
        }
        // Green tones (healthy or partially healthy leaves/stems)
        else if (hue >= 60 && hue <= 165) {
          colorCategory = 'green';
        }
        // Yellow tones (chlorosis, yellowing from disease/stress)
        else if (hue >= 35 && hue < 60) {
          colorCategory = 'yellow';
        }
        // Brown tones (necrosis, blight, fungus, disease spots)
        else if (hue >= 10 && hue < 35) {
          if (saturation > 0.2 && lightness < 0.6) {
            colorCategory = 'brown';
          } else {
            colorCategory = 'neutral'; // dusty colors
          }
        }
        // Red tones (some healthy fruits, but de-emphasize if not diseased)
        else if ((hue >= 0 && hue < 10) || (hue >= 345 && hue <= 360)) {
           colorCategory = 'red';
        }
        // Blue/Purple/cyan (skies, jeans, artificial objects)
        else if (hue > 165 && hue < 345) {
          colorCategory = 'blue_purple';
        }

        colorCounts[colorCategory] = (colorCounts[colorCategory] || 0) + 1;
      }

      // Calculate percentages
      const greenPercentage = (colorCounts.green || 0) / totalPixels;
      const yellowPercentage = (colorCounts.yellow || 0) / totalPixels;
      const brownPercentage = (colorCounts.brown || 0) / totalPixels;
      const darkPercentage = (colorCounts.dark || 0) / totalPixels;
      const redPercentage = (colorCounts.red || 0) / totalPixels;
      const bluePurplePercentage = (colorCounts.blue_purple || 0) / totalPixels;

      const plantColorsTotal = greenPercentage + yellowPercentage + brownPercentage + redPercentage;

      // 1. MUST literally look like a plant scene overall
      const hasPlantColors = plantColorsTotal > 0.25 && (greenPercentage > 0.08 || yellowPercentage > 0.12);
      const isPlantColors = (isFormallyAPlant && plantColorsTotal > 0.1) || hasPlantColors;
      
      // 2. Reject if obviously unnatural (too much artificial blue/purple compared to nature colors)
      const isNotUnnatural = bluePurplePercentage < 0.15 || plantColorsTotal > (bluePurplePercentage * 2);

      // 3. Must show distinct disease signs but not be purely a brown/dark object
      const hasDiseaseSigns = (brownPercentage > 0.03 && brownPercentage < 0.45) 
                           || (darkPercentage > 0.04 && darkPercentage < 0.4) 
                           || (yellowPercentage > 0.12 && greenPercentage > 0.05);

      // 4. Ultimate Enforcement: if the AI model ran and didn't find any plant-related objects (e.g. it saw a dog) -> rigid rejection
      const aiEnforcement = aiClassifications === '' || isFormallyAPlant;

      // Check for minimum image quality (not too small)
      const minPixels = 10000;
      const hasMinimumSize = totalPixels > minPixels;

      const isValidPlant = aiEnforcement && isPlantColors && isNotUnnatural && hasDiseaseSigns && hasMinimumSize;
      
      // Calculate a confidence score for UI based on how strongly it matches a diseased plant profile
      const plantScore = greenPercentage * 1.5 + yellowPercentage + brownPercentage * 2 + darkPercentage * 1.5;
      const confidence = Math.min(plantScore * 100, 100);

      console.log('AI + Strict Image Analysis:', {
        totalPixels,
        greenPercentage: (greenPercentage * 100).toFixed(2) + '%',
        yellowPercentage: (yellowPercentage * 100).toFixed(2) + '%',
        brownPercentage: (brownPercentage * 100).toFixed(2) + '%',
        darkPercentage: (darkPercentage * 100).toFixed(2) + '%',
        bluePurplePercentage: (bluePurplePercentage * 100).toFixed(2) + '%',
        plantColorsTotal: (plantColorsTotal * 100).toFixed(2) + '%',
        aiEnforcement,
        aiFoundPlant: isFormallyAPlant,
        isPlantColors,
        isNotUnnatural,
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