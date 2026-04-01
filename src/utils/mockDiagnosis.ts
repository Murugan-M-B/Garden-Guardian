import { DiagnosisData } from '@/components/DiagnosisResult';

// Mock diagnosis data for demonstration
const mockDiagnoses: DiagnosisData[] = [
  {
    disease: 'Tomato Blight',
    confidence: 87,
    cause: 'Fungal infection caused by Phytophthora infestans, typically occurring in cool, wet conditions with poor air circulation.',
    severity: 'high',
    organicSolutions: [
      'Remove and destroy affected plant parts immediately',
      'Apply neem oil spray every 7-10 days',
      'Improve air circulation around plants',
      'Use copper-based fungicide as preventive measure',
      'Apply compost tea to boost plant immunity'
    ],
    chemicalSolutions: [
      'Mancozeb fungicide applied every 7-14 days',
      'Chlorothalonil-based spray during early infection',
      'Metalaxyl-M systemic fungicide for severe cases',
      'Copper sulfate solution as preventive treatment'
    ],
    prevention: [
      'Plant disease-resistant varieties',
      'Ensure proper spacing for air circulation',
      'Water at soil level to avoid wetting foliage',
      'Rotate crops annually to break disease cycle',
      'Remove plant debris at end of season',
      'Apply mulch to prevent soil splash'
    ]
  },
  {
    disease: 'Powdery Mildew',
    confidence: 92,
    cause: 'Fungal disease caused by various species of powdery mildew fungi, thriving in warm, dry conditions with high humidity.',
    severity: 'medium',
    organicSolutions: [
      'Spray with baking soda solution (1 tsp per quart water)',
      'Apply milk spray (1:10 ratio with water)',
      'Use horticultural oil to smother fungal spores',
      'Increase air circulation around plants',
      'Remove affected leaves and dispose properly'
    ],
    chemicalSolutions: [
      'Sulfur-based fungicide spray',
      'Propiconazole systemic fungicide',
      'Myclobutanil for severe infections',
      'Potassium bicarbonate spray'
    ],
    prevention: [
      'Choose resistant plant varieties',
      'Avoid overhead watering',
      'Provide adequate plant spacing',
      'Ensure good air circulation',
      'Keep garden clean of debris',
      'Monitor humidity levels'
    ]
  },
  {
    disease: 'Aphid Infestation',
    confidence: 95,
    cause: 'Small soft-bodied insects that feed on plant sap, often attracted to new growth and stressed plants.',
    severity: 'low',
    organicSolutions: [
      'Spray plants with strong water stream',
      'Apply insecticidal soap solution',
      'Release beneficial insects like ladybugs',
      'Use neem oil as natural pesticide',
      'Plant companion plants like marigolds'
    ],
    chemicalSolutions: [
      'Imidacloprid systemic insecticide',
      'Malathion spray for quick knockdown',
      'Pyrethroid-based insecticides',
      'Acetamiprid for resistant populations'
    ],
    prevention: [
      'Inspect plants regularly for early detection',
      'Encourage beneficial insects in garden',
      'Avoid over-fertilizing with nitrogen',
      'Use reflective mulch to deter aphids',
      'Remove weeds that harbor aphids',
      'Practice companion planting'
    ]
  },
  {
    disease: 'Cucumber Mosaic Virus',
    confidence: 79,
    cause: 'Viral infection transmitted by aphids, affecting cucumbers, melons, and other cucurbit family plants.',
    severity: 'high',
    organicSolutions: [
      'Remove and destroy infected plants immediately',
      'Control aphid populations with beneficial insects',
      'Use reflective mulch to deter virus vectors',
      'Plant virus-resistant varieties when available',
      'Maintain good garden hygiene'
    ],
    chemicalSolutions: [
      'No direct chemical treatment for viruses',
      'Use systemic insecticides to control aphid vectors',
      'Apply mineral oil to reduce virus transmission',
      'Imidacloprid soil drench for aphid control'
    ],
    prevention: [
      'Plant certified disease-free seeds',
      'Control aphid populations early',
      'Remove infected plants promptly',
      'Use row covers during vulnerable growth stages',
      'Practice crop rotation',
      'Keep garden weed-free'
    ]
  }
];

export const getMockDiagnosis = (): Promise<DiagnosisData> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const randomDiagnosis = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];
      resolve(randomDiagnosis);
    }, 2000);
  });
};