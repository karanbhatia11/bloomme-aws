import type { SubscriptionPlan, AddOn } from './types'

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'traditional',
    name: 'Traditional',
    price: 59,
    description: 'Daily puja flowers',
    features: [
      '80-100g fresh flowers',
      'Daily delivery 5:30-7:30 AM',
      'Basic varieties',
      'Standard packaging',
    ],
    flowerWeight: 90,
    varieties: 3,
    packaging: 'Standard',
  },
  {
    id: 'divine',
    name: 'Divine',
    price: 89,
    description: 'Enhanced spiritual experience',
    features: [
      '150g premium flowers',
      'Daily delivery 5:30-7:30 AM',
      'Varied seasonal flowers',
      'Premium packaging',
      'Priority service',
    ],
    flowerWeight: 150,
    varieties: 5,
    packaging: 'Premium',
  },
  {
    id: 'celestial',
    name: 'Celestial',
    price: 179,
    description: 'Premium experience',
    features: [
      '200g exotic flowers',
      'Daily delivery 5:30-7:30 AM',
      'Rare seasonal varieties',
      'Luxury packaging',
      'VIP support',
    ],
    flowerWeight: 200,
    varieties: 8,
    packaging: 'Luxury',
  },
]

export const ADD_ONS: AddOn[] = [
  {
    id: 'lotus',
    name: 'Sacred Lotus',
    price: 30,
    icon: '🪷',
    category: 'flowers',
    description: 'Pure white lotus flower',
  },
  {
    id: 'extra-flowers',
    name: 'Extra Flowers',
    price: 20,
    icon: '💐',
    category: 'flowers',
    description: 'Additional mixed flowers',
  },
  {
    id: 'ghee-diya',
    name: 'Desi Ghee Diya',
    price: 30,
    icon: '🕯️',
    category: 'essentials',
    description: 'Traditional ghee diya',
  },
  {
    id: 'rose-mala',
    name: 'Rose Mala',
    price: 300,
    icon: '🌹',
    category: 'accessories',
    description: 'Premium rose flower garland',
  },
  {
    id: 'flower-mala',
    name: 'Flower Mala',
    price: 35,
    icon: '💐',
    category: 'accessories',
    description: 'Mixed flower garland',
  },
  {
    id: 'incense',
    name: 'Premium Incense',
    price: 50,
    icon: '🌫️',
    category: 'essentials',
    description: 'Aromatic incense sticks',
  },
]

export const DELIVERY_TIME = {
  start: '5:30 AM',
  end: '7:30 AM',
  timezone: 'IST',
}

export const LOCATIONS = ['NIT 1', 'NIT 2', 'NIT 3', 'NIT 5']

export const TAX_RATE = 0.05
