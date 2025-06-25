
import { Footprints, Shield, GraduationCap, Leaf, Gamepad2, ShoppingCart } from "lucide-react";

export const regionOrder = [
  'central-athens',
  'piraeus-coast',
  'north-attica',
  'east-attica',
  'west-attica',
  'south-athens',
  'northeast-athens'
];

export const regionColors: Record<string, string> = {
  'central-athens': '#ff4444',
  'piraeus-coast': '#9933CC',
  'north-attica': '#3366ff',
  'east-attica': '#33b5e5',
  'west-attica': '#00C851',
  'south-athens': '#FF8800',
  'northeast-athens': '#2BBBAD'
};

export const regionNames: Record<string, string> = {
  'central-athens': 'Central Athens',
  'piraeus-coast': 'Piraeus & Coast',
  'north-attica': 'North Attica',
  'east-attica': 'East Attica',
  'west-attica': 'West Attica',
  'south-athens': 'South Athens',
  'northeast-athens': 'Northeast Athens'
};

export const scoreIcons = {
  walkability: Footprints,
  safety: Shield,
  education: GraduationCap,
  green_spaces: Leaf,
  entertainment: Gamepad2,
  retail: ShoppingCart,
};

export const scoreLabels = {
  walkability: 'Walkability',
  safety: 'Safety',
  education: 'Education',
  green_spaces: 'Green Spaces',
  entertainment: 'Entertainment',
  retail: 'Retail'
};
