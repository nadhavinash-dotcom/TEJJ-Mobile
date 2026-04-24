export const SKILL_LIST = [
  { id: 'cook', label: 'Cook', labelEn: 'Cook', icon: 'ChefHat', keywords: ['cook', 'rasoi', 'chef', 'khana', 'cooking'] },
  { id: 'prep_cook', label: 'Prep', labelEn: 'Prep Cook', icon: 'Knife', keywords: ['prep', 'cutting', 'chopping'] },
  { id: 'tandoor', label: 'Tandoor', labelEn: 'Tandoor Cook', icon: 'Flame', keywords: ['tandoor', 'roti', 'naan', 'bread'] },
  { id: 'biryani', label: 'Biryani', labelEn: 'Biryani Chef', icon: 'Soup', keywords: ['biryani', 'pulao', 'rice'] },
  { id: 'baker', label: 'Baker', labelEn: 'Baker', icon: 'CakeSlice', keywords: ['baker', 'bakery', 'cake', 'bread', 'pastry'] },
  { id: 'continental', label: 'Continental', labelEn: 'Continental Chef', icon: 'Utensils', keywords: ['continental', 'western', 'pasta', 'italian'] },
  { id: 'waiter', label: 'Waiter', labelEn: 'Waiter / Server', icon: 'ConciergeBell', keywords: ['waiter', 'server', 'service', 'floor', 'serving'] },
  { id: 'steward', label: 'Steward', labelEn: 'Steward', icon: 'Brush', keywords: ['steward', 'cleaning', 'kitchen cleaning'] },
  { id: 'runner', label: 'Runner', labelEn: 'Food Runner', icon: 'Zap', keywords: ['runner', 'delivery', 'food runner'] },
  { id: 'cashier', label: 'Cashier', labelEn: 'Cashier', icon: 'Banknote', keywords: ['cashier', 'billing', 'cash', 'payment'] },
  { id: 'housekeeper', label: 'HK', labelEn: 'Housekeeper', icon: 'Bed', keywords: ['housekeeper', 'housekeeping', 'room cleaning', 'maid'] },
  { id: 'laundry', label: 'Laundry', labelEn: 'Laundry', icon: 'WashingMachine', keywords: ['laundry', 'washing', 'ironing', 'linen'] },
  { id: 'cleaner', label: 'Cleaner', labelEn: 'Cleaner', icon: 'SprayCan', keywords: ['cleaner', 'safai', 'cleaning', 'janitor'] },
  { id: 'bellboy', label: 'Bellboy', labelEn: 'Bellboy', icon: 'BellRing', keywords: ['bellboy', 'porter', 'luggage', 'hotel porter'] },
  { id: 'valet', label: 'Valet', labelEn: 'Valet', icon: 'Car', keywords: ['valet', 'parking', 'driver', 'car parking'] },
  { id: 'security', label: 'Security', labelEn: 'Security Guard', icon: 'ShieldCheck', keywords: ['security', 'guard', 'security guard', 'watchman'] },
  { id: 'barista', label: 'Barista', labelEn: 'Barista', icon: 'Coffee', keywords: ['barista', 'coffee', 'cafe', 'espresso'] },
  { id: 'bartender', label: 'Bartender', labelEn: 'Bartender', icon: 'Wine', keywords: ['bartender', 'bar', 'drinks', 'cocktail', 'mixologist'] },
  { id: 'banquet', label: 'Banquet', labelEn: 'Banquet Staff', icon: 'PartyPopper', keywords: ['banquet', 'events', 'catering events', 'hall'] },
  { id: 'maintenance', label: 'Maintenance', labelEn: 'Maintenance', icon: 'Wrench', keywords: ['maintenance', 'electrician', 'plumber', 'repair', 'technician'] },
  { id: 'spa', label: 'Spa', labelEn: 'Spa Therapist', icon: 'Flower2', keywords: ['spa', 'massage', 'therapist', 'wellness', 'beauty'] },
  { id: 'helper', label: 'Helper', labelEn: 'Helper', icon: 'Package', keywords: ['helper', 'assistant', 'support', 'all rounder'] },
  { id: 'nurse', label: 'Nurse', labelEn: 'Nurse / Health', icon: 'HeartPulse', keywords: ['nurse', 'health', 'medical', 'first aid'] },
  { id: 'other', label: 'Other', labelEn: 'Other', icon: 'Plus', keywords: ['other', 'misc'] },
] as const;

export const CUISINE_LIST = [
  { id: 'north_indian', label: 'North Indian', labelEn: 'North Indian', keywords: ['north indian', 'dal makhani', 'paneer', 'maa ki dal'] },
  { id: 'south_indian', label: 'South Indian', labelEn: 'South Indian', keywords: ['south indian', 'dosa', 'idli', 'sambar', 'rasam'] },
  { id: 'biryani_mughlai', label: 'Biryani / Mughlai', labelEn: 'Biryani / Mughlai', keywords: ['biryani', 'mughlai', 'kebab', 'korma'] },
  { id: 'chinese', label: 'Chinese / Indo-Chinese', labelEn: 'Chinese', keywords: ['chinese', 'noodles', 'manchurian', 'hakka'] },
  { id: 'continental', label: 'Continental / Western', labelEn: 'Continental', keywords: ['continental', 'pasta', 'pizza', 'western', 'european'] },
  { id: 'tandoor', label: 'Tandoor Expert', labelEn: 'Tandoor', keywords: ['tandoor', 'tandoori', 'roti', 'naan', 'paratha'] },
  { id: 'bakery', label: 'Bakery / Pastry', labelEn: 'Bakery', keywords: ['bakery', 'pastry', 'cake', 'bread', 'croissant'] },
  { id: 'mithai', label: 'Indian Sweets', labelEn: 'Indian Sweets', keywords: ['mithai', 'sweets', 'halwa', 'barfi', 'ladoo'] },
  { id: 'bulk_catering', label: 'Bulk / Catering', labelEn: 'Bulk Catering', keywords: ['bulk', 'catering', 'large scale', 'mass cooking'] },
  { id: 'pizza_fast_food', label: 'Pizza / Fast Food', labelEn: 'Pizza / Fast Food', keywords: ['pizza', 'fast food', 'burger', 'sandwich'] },
] as const;

export const LANGUAGES = [
  { code: 'hi', label: 'हिंदी', labelEn: 'Hindi', flag: 'Languages' },
  { code: 'te', label: 'తెలుగు', labelEn: 'Telugu', flag: 'Languages' },
  { code: 'ta', label: 'தமிழ்', labelEn: 'Tamil', flag: 'Languages' },
  { code: 'kn', label: 'ಕನ್ನಡ', labelEn: 'Kannada', flag: 'Languages' },
  { code: 'mr', label: 'मराठी', labelEn: 'Marathi', flag: 'Languages' },
  { code: 'bn', label: 'বাংলা', labelEn: 'Bengali', flag: 'Languages' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', labelEn: 'Punjabi', flag: 'Languages' },
  { code: 'en', label: 'English', labelEn: 'English', flag: 'Languages' },
] as const;

export const HIRING_LANES = {
  L1: { id: 1, label: 'Flash', labelHi: 'Flash', color: '#EF4444', window: '0-6 hours', icon: 'Zap' },
  L2: { id: 2, label: 'Same-Day', labelHi: 'Same-Day', color: '#F59E0B', window: '6-24 hours', icon: 'Sun' },
  L3: { id: 3, label: 'Contract', labelHi: 'Contract', color: '#3B82F6', window: '24-72 hours', icon: 'ClipboardList' },
  L4: { id: 4, label: 'Permanent', labelHi: 'Permanent', color: '#8B5CF6', window: '3-7 days', icon: 'Building2' },
} as const;

export const EMPLOYER_PLANS = {
  FLASH_FREE: { name: 'Flash Free', price: 0, post_limit: 3, features: ['L1 Flash', '3 posts/month', 'Skill video view'] },
  STARTER: { name: 'Starter', price: 2999, post_limit: 10, features: ['All 4 lanes', '10 posts/month', 'Interview scheduler', 'Pay benchmarking'] },
  GROWTH: { name: 'Growth', price: 7999, post_limit: 30, features: ['30 posts/month', '100 DB unlocks', 'Analytics', 'Cream Pool', 'Retain Basic'] },
  PRO: { name: 'Pro', price: 18999, post_limit: -1, features: ['Unlimited posts', '500 DB unlocks', 'Auto-Recruiter', 'SLA 60%', 'Account Manager'] },
} as const;

export const SHIFT_PRESETS = [
  { id: 'morning', label: 'Morning', labelEn: 'Morning', from: '06:00', to: '14:00', icon: 'Sun' },
  { id: 'evening', label: 'Evening', labelEn: 'Evening', from: '14:00', to: '22:00', icon: 'Sunset' },
  { id: 'night', label: 'Night', labelEn: 'Night', from: '22:00', to: '06:00', icon: 'Moon' },
  { id: 'any', label: 'Any Time', labelEn: 'Any Time', from: '06:00', to: '23:59', icon: 'Infinity' },
] as const;

export const PROPERTY_TYPES = [
  { id: 'restaurant_standalone', label: 'Restaurant (Standalone)', icon: 'Utensils' },
  { id: 'restaurant_chain', label: 'Restaurant (Chain outlet)', icon: 'Link' },
  { id: 'hotel_budget', label: 'Hotel (Budget — 1-2 star)', icon: 'Building' },
  { id: 'hotel_midscale', label: 'Hotel (Mid-scale — 3 star)', icon: 'Building' },
  { id: 'hotel_luxury', label: 'Hotel (Luxury / 4-5 star)', icon: 'Gem' },
  { id: 'cloud_kitchen', label: 'Cloud Kitchen / Dark Kitchen', icon: 'Cloud' },
  { id: 'cafe', label: 'Café / Coffee Shop', icon: 'Coffee' },
  { id: 'bar', label: 'Bar / Pub / Lounge', icon: 'GlassWater' },
  { id: 'banquet', label: 'Banquet Hall / Convention Centre', icon: 'Tent' },
  { id: 'catering', label: 'Catering Company', icon: 'Box' },
  { id: 'resort', label: 'Resort / Club', icon: 'TreePalm' },
  { id: 'guesthouse', label: 'Guesthouse / Service Apartment', icon: 'Home' },
  { id: 'hospital_canteen', label: 'Hospital / Clinic Canteen', icon: 'Hospital' },
  { id: 'corporate_cafeteria', label: 'Corporate Cafeteria', icon: 'Building2' },
  { id: 'airline_catering', label: 'Airline / Railway Catering', icon: 'Plane' },
  { id: 'school_canteen', label: 'School / College Canteen', icon: 'School' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal' },
] as const;

export const INDIAN_CITIES = [
  'Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi',
  'Coimbatore', 'Visakhapatnam', 'Nagpur', 'Indore', 'Bhopal', 'Surat',
] as const;

export const EXPERIENCE_LABELS: Record<number, string> = {
  0: 'Fresher — still learning',
  1: '1 year — basic experience',
  2: '2 years — good experience',
  3: '3 years — experienced',
  4: '4 years — senior level',
  6: '5+ years — expert',
};

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const TRUST_SCORE_FORMULA = {
  SHOW_UP_RATE_WEIGHT: 0.40,
  EMPLOYER_RATING_WEIGHT: 0.30,
  PROFILE_DEPTH_WEIGHT: 0.20,
  CONDUCT_WEIGHT: 0.10,
  MIN_L1_THRESHOLD: 3.0,
} as const;

export const AI_SCORE_FORMULA = {
  TECHNIQUE_WEIGHT: 0.40,
  SPEED_WEIGHT: 0.25,
  HYGIENE_WEIGHT: 0.20,
  WARMTH_WEIGHT: 0.15,
  HUMAN_REVIEW_THRESHOLD: 40,
} as const;
