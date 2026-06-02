// ── Hospitality sectors (top-level categories) ───────────────────────────────
// A worker first picks a SECTOR, then a ROLE within it, then SUB-SKILLS.
export const SKILL_CATEGORIES = [
  { id: 'kitchen', label: 'Kitchen & Culinary', labelEn: 'Kitchen & Culinary', icon: 'ChefHat', description: 'Cooking, prep & culinary roles' },
  { id: 'fnb_service', label: 'F&B Service', labelEn: 'Food & Beverage Service', icon: 'ConciergeBell', description: 'Serving guests on the floor' },
  { id: 'bar_beverage', label: 'Bar & Beverage', labelEn: 'Bar & Beverage', icon: 'Martini', description: 'Bar, coffee & drinks' },
  { id: 'front_office', label: 'Front Office', labelEn: 'Front Office & Guest Services', icon: 'BellRing', description: 'Reception, concierge & guest help' },
  { id: 'housekeeping', label: 'Housekeeping', labelEn: 'Housekeeping & Laundry', icon: 'BedDouble', description: 'Rooms, cleaning & linen' },
  { id: 'events_banquet', label: 'Events & Banquets', labelEn: 'Events & Banquets', icon: 'PartyPopper', description: 'Functions, weddings & catering' },
  { id: 'wellness', label: 'Wellness & Recreation', labelEn: 'Wellness & Recreation', icon: 'Flower2', description: 'Spa, salon, gym & pool' },
  { id: 'facilities', label: 'Maintenance & Facilities', labelEn: 'Maintenance & Facilities', icon: 'Wrench', description: 'Repairs, upkeep & grounds' },
  { id: 'security', label: 'Security & Safety', labelEn: 'Security & Safety', icon: 'ShieldCheck', description: 'Guarding & surveillance' },
  { id: 'support_admin', label: 'Support & Admin', labelEn: 'Support & Admin', icon: 'Briefcase', description: 'Cashier, store, helpers & more' },
] as const;

export type SkillCategoryId = (typeof SKILL_CATEGORIES)[number]['id'];

// ── Roles (skills) — each tagged with its sector via `category` ───────────────
export const SKILL_LIST = [
  // Kitchen & Culinary
  { id: 'executive_chef', category: 'kitchen', label: 'Executive Chef', labelEn: 'Executive Chef', icon: 'ChefHat', keywords: ['executive chef', 'head chef', 'kitchen head', 'chef de cuisine'] },
  { id: 'sous_chef', category: 'kitchen', label: 'Sous Chef', labelEn: 'Sous Chef', icon: 'Utensils', keywords: ['sous chef', 'second chef', 'deputy chef'] },
  { id: 'cook', category: 'kitchen', label: 'Cook', labelEn: 'Cook / Commis', icon: 'ChefHat', keywords: ['cook', 'rasoi', 'chef', 'khana', 'cooking', 'commis'] },
  { id: 'prep_cook', category: 'kitchen', label: 'Prep Cook', labelEn: 'Prep Cook', icon: 'UtensilsCrossed', keywords: ['prep', 'cutting', 'chopping', 'mise en place'] },
  { id: 'tandoor', category: 'kitchen', label: 'Tandoor', labelEn: 'Tandoor Cook', icon: 'Flame', keywords: ['tandoor', 'roti', 'naan', 'bread', 'tandoori'] },
  { id: 'grill_chef', category: 'kitchen', label: 'Grill', labelEn: 'Grill / Sizzler Chef', icon: 'Beef', keywords: ['grill', 'sizzler', 'bbq', 'barbecue', 'steak'] },
  { id: 'chinese_chef', category: 'kitchen', label: 'Chinese', labelEn: 'Chinese / Oriental Chef', icon: 'Soup', keywords: ['chinese', 'oriental', 'wok', 'noodles', 'manchurian', 'hakka', 'thai'] },
  { id: 'continental', category: 'kitchen', label: 'Continental', labelEn: 'Continental Chef', icon: 'Utensils', keywords: ['continental', 'western', 'pasta', 'italian', 'european'] },
  { id: 'pizza_chef', category: 'kitchen', label: 'Pizza', labelEn: 'Pizza Chef', icon: 'Pizza', keywords: ['pizza', 'dough', 'wood fired', 'oven'] },
  { id: 'biryani', category: 'kitchen', label: 'Biryani', labelEn: 'Biryani Specialist', icon: 'CookingPot', keywords: ['biryani', 'pulao', 'rice', 'dum'] },
  { id: 'baker', category: 'kitchen', label: 'Baker', labelEn: 'Baker', icon: 'CakeSlice', keywords: ['baker', 'bakery', 'bread', 'bun', 'loaf'] },
  { id: 'pastry_chef', category: 'kitchen', label: 'Pastry', labelEn: 'Pastry Chef', icon: 'Croissant', keywords: ['pastry', 'cake', 'dessert', 'patisserie', 'chocolate'] },
  { id: 'halwai', category: 'kitchen', label: 'Halwai', labelEn: 'Halwai / Sweets Chef', icon: 'Candy', keywords: ['halwai', 'mithai', 'sweets', 'indian sweets', 'ladoo', 'barfi'] },
  { id: 'steward', category: 'kitchen', label: 'Steward', labelEn: 'Kitchen Steward', icon: 'Brush', keywords: ['steward', 'kitchen cleaning', 'stewarding'] },
  { id: 'dishwasher', category: 'kitchen', label: 'Dishwash', labelEn: 'Dishwasher / Utility', icon: 'Droplets', keywords: ['dishwasher', 'utility', 'scrubbing', 'washing dishes'] },

  // F&B Service
  { id: 'captain', category: 'fnb_service', label: 'Captain', labelEn: 'Service Captain', icon: 'ClipboardList', keywords: ['captain', 'floor captain', 'service captain', 'supervisor'] },
  { id: 'waiter', category: 'fnb_service', label: 'Waiter', labelEn: 'Waiter / Server', icon: 'ConciergeBell', keywords: ['waiter', 'server', 'service', 'floor', 'serving'] },
  { id: 'host', category: 'fnb_service', label: 'Host', labelEn: 'Host / Hostess', icon: 'UserCheck', keywords: ['host', 'hostess', 'greeter', 'reservations'] },
  { id: 'room_service', category: 'fnb_service', label: 'Room Svc', labelEn: 'Room Service', icon: 'Soup', keywords: ['room service', 'in room dining', 'ird'] },
  { id: 'runner', category: 'fnb_service', label: 'Runner', labelEn: 'Food Runner', icon: 'Footprints', keywords: ['runner', 'food runner', 'drink runner', 'expo'] },
  { id: 'qsr_crew', category: 'fnb_service', label: 'QSR Crew', labelEn: 'QSR / Counter Crew', icon: 'ShoppingBag', keywords: ['qsr', 'counter', 'fast food crew', 'takeaway', 'food court'] },

  // Bar & Beverage
  { id: 'bartender', category: 'bar_beverage', label: 'Bartender', labelEn: 'Bartender', icon: 'Martini', keywords: ['bartender', 'bar', 'drinks', 'cocktail', 'mixologist'] },
  { id: 'barista', category: 'bar_beverage', label: 'Barista', labelEn: 'Barista', icon: 'Coffee', keywords: ['barista', 'coffee', 'cafe', 'espresso', 'latte'] },
  { id: 'bar_back', category: 'bar_beverage', label: 'Bar Back', labelEn: 'Bar Back', icon: 'Beer', keywords: ['bar back', 'bar helper', 'bar support'] },
  { id: 'juice_maker', category: 'bar_beverage', label: 'Juice', labelEn: 'Juice / Mocktail', icon: 'GlassWater', keywords: ['juice', 'mocktail', 'smoothie', 'shakes', 'fresh juice'] },
  { id: 'sommelier', category: 'bar_beverage', label: 'Sommelier', labelEn: 'Sommelier', icon: 'Wine', keywords: ['sommelier', 'wine expert', 'wine steward'] },

  // Front Office & Guest Services
  { id: 'receptionist', category: 'front_office', label: 'Front Desk', labelEn: 'Front Desk / Receptionist', icon: 'BellRing', keywords: ['receptionist', 'front desk', 'reception', 'check in', 'gsa'] },
  { id: 'concierge', category: 'front_office', label: 'Concierge', labelEn: 'Concierge', icon: 'Bell', keywords: ['concierge', 'guest assistance', 'bookings'] },
  { id: 'guest_relations', category: 'front_office', label: 'Guest Rel.', labelEn: 'Guest Relations Exec', icon: 'Sparkles', keywords: ['guest relations', 'gre', 'guest experience'] },
  { id: 'bellboy', category: 'front_office', label: 'Bellboy', labelEn: 'Bellboy / Porter', icon: 'Luggage', keywords: ['bellboy', 'porter', 'luggage', 'hotel porter'] },
  { id: 'valet', category: 'front_office', label: 'Valet', labelEn: 'Valet / Parking', icon: 'Car', keywords: ['valet', 'parking', 'car parking', 'driver'] },
  { id: 'doorman', category: 'front_office', label: 'Doorman', labelEn: 'Doorman', icon: 'DoorOpen', keywords: ['doorman', 'door attendant', 'greeter'] },
  { id: 'telephone_operator', category: 'front_office', label: 'Operator', labelEn: 'Telephone Operator', icon: 'Phone', keywords: ['operator', 'telephone', 'call', 'switchboard'] },

  // Housekeeping & Laundry
  { id: 'housekeeper', category: 'housekeeping', label: 'HK', labelEn: 'Housekeeper', icon: 'BedDouble', keywords: ['housekeeper', 'housekeeping', 'room cleaning', 'maid'] },
  { id: 'room_attendant', category: 'housekeeping', label: 'Room Attd', labelEn: 'Room Attendant', icon: 'Bed', keywords: ['room attendant', 'room boy', 'room maid'] },
  { id: 'cleaner', category: 'housekeeping', label: 'Cleaner', labelEn: 'Cleaner / Safai', icon: 'SprayCan', keywords: ['cleaner', 'safai', 'cleaning', 'janitor'] },
  { id: 'laundry', category: 'housekeeping', label: 'Laundry', labelEn: 'Laundry', icon: 'WashingMachine', keywords: ['laundry', 'washing', 'ironing', 'linen'] },
  { id: 'linen_attendant', category: 'housekeeping', label: 'Linen', labelEn: 'Linen / Uniform', icon: 'Shirt', keywords: ['linen', 'uniform', 'wardrobe', 'tailoring'] },

  // Events & Banquets
  { id: 'banquet', category: 'events_banquet', label: 'Banquet', labelEn: 'Banquet Staff', icon: 'PartyPopper', keywords: ['banquet', 'events', 'catering events', 'hall'] },
  { id: 'banquet_captain', category: 'events_banquet', label: 'Banq. Capt', labelEn: 'Banquet Captain', icon: 'ClipboardList', keywords: ['banquet captain', 'event captain', 'function head'] },
  { id: 'event_setup', category: 'events_banquet', label: 'Setup Crew', labelEn: 'Event Setup Crew', icon: 'Tent', keywords: ['event setup', 'stage', 'tent', 'mandap', 'rigging'] },
  { id: 'decorator', category: 'events_banquet', label: 'Decorator', labelEn: 'Decorator / Florist', icon: 'Flower', keywords: ['decorator', 'florist', 'flowers', 'decoration', 'mandap'] },
  { id: 'caterer', category: 'events_banquet', label: 'Catering', labelEn: 'Catering Staff', icon: 'Box', keywords: ['catering', 'outdoor catering', 'bulk serving'] },
  { id: 'emcee', category: 'events_banquet', label: 'Emcee', labelEn: 'Emcee / Anchor', icon: 'Mic', keywords: ['emcee', 'anchor', 'mc', 'compere'] },
  { id: 'dj', category: 'events_banquet', label: 'DJ', labelEn: 'DJ / Sound', icon: 'Music', keywords: ['dj', 'sound', 'music', 'audio'] },
  { id: 'event_photographer', category: 'events_banquet', label: 'Photo', labelEn: 'Photographer', icon: 'Camera', keywords: ['photographer', 'photography', 'videographer', 'candid'] },

  // Wellness & Recreation
  { id: 'spa', category: 'wellness', label: 'Spa', labelEn: 'Spa Therapist', icon: 'Flower2', keywords: ['spa', 'massage', 'therapist', 'wellness', 'beauty'] },
  { id: 'masseur', category: 'wellness', label: 'Masseur', labelEn: 'Masseur / Masseuse', icon: 'Hand', keywords: ['masseur', 'masseuse', 'body massage'] },
  { id: 'beautician', category: 'wellness', label: 'Beauty', labelEn: 'Beautician / Salon', icon: 'Sparkles', keywords: ['beautician', 'salon', 'facial', 'makeup', 'parlour'] },
  { id: 'hair_stylist', category: 'wellness', label: 'Hair', labelEn: 'Hair Stylist', icon: 'Scissors', keywords: ['hair stylist', 'hairdresser', 'barber', 'salon'] },
  { id: 'gym_trainer', category: 'wellness', label: 'Gym', labelEn: 'Gym / Fitness Trainer', icon: 'Dumbbell', keywords: ['gym', 'trainer', 'fitness', 'personal trainer'] },
  { id: 'yoga_instructor', category: 'wellness', label: 'Yoga', labelEn: 'Yoga Instructor', icon: 'PersonStanding', keywords: ['yoga', 'instructor', 'meditation'] },
  { id: 'lifeguard', category: 'wellness', label: 'Lifeguard', labelEn: 'Lifeguard / Pool', icon: 'Waves', keywords: ['lifeguard', 'pool', 'swimming', 'pool attendant'] },

  // Maintenance & Facilities
  { id: 'maintenance', category: 'facilities', label: 'Maint.', labelEn: 'Maintenance Technician', icon: 'Wrench', keywords: ['maintenance', 'repair', 'technician', 'handyman'] },
  { id: 'electrician', category: 'facilities', label: 'Electric', labelEn: 'Electrician', icon: 'Zap', keywords: ['electrician', 'electrical', 'wiring', 'lighting'] },
  { id: 'plumber', category: 'facilities', label: 'Plumber', labelEn: 'Plumber', icon: 'Droplets', keywords: ['plumber', 'plumbing', 'pipe', 'water', 'sanitary'] },
  { id: 'ac_technician', category: 'facilities', label: 'AC/HVAC', labelEn: 'AC / HVAC Technician', icon: 'AirVent', keywords: ['ac', 'hvac', 'air conditioning', 'refrigeration', 'cooling'] },
  { id: 'carpenter', category: 'facilities', label: 'Carpenter', labelEn: 'Carpenter', icon: 'Hammer', keywords: ['carpenter', 'woodwork', 'furniture'] },
  { id: 'painter', category: 'facilities', label: 'Painter', labelEn: 'Painter', icon: 'Paintbrush', keywords: ['painter', 'painting', 'wall'] },
  { id: 'gardener', category: 'facilities', label: 'Gardener', labelEn: 'Gardener / Landscaping', icon: 'Trees', keywords: ['gardener', 'gardening', 'landscaping', 'horticulture', 'mali'] },

  // Security & Safety
  { id: 'security', category: 'security', label: 'Security', labelEn: 'Security Guard', icon: 'ShieldCheck', keywords: ['security', 'guard', 'watchman', 'security guard'] },
  { id: 'bouncer', category: 'security', label: 'Bouncer', labelEn: 'Bouncer', icon: 'Shield', keywords: ['bouncer', 'club security', 'crowd control'] },
  { id: 'cctv_operator', category: 'security', label: 'CCTV', labelEn: 'CCTV / Surveillance', icon: 'Cctv', keywords: ['cctv', 'surveillance', 'monitoring', 'control room'] },
  { id: 'fire_safety', category: 'security', label: 'Fire Safe', labelEn: 'Fire & Safety Officer', icon: 'Siren', keywords: ['fire safety', 'safety officer', 'fire fighting'] },

  // Support & Admin
  { id: 'cashier', category: 'support_admin', label: 'Cashier', labelEn: 'Cashier', icon: 'Banknote', keywords: ['cashier', 'billing', 'cash', 'payment'] },
  { id: 'store_keeper', category: 'support_admin', label: 'Store', labelEn: 'Store Keeper / Inventory', icon: 'Package', keywords: ['store keeper', 'inventory', 'stock', 'storeroom'] },
  { id: 'helper', category: 'support_admin', label: 'Helper', labelEn: 'Helper / All-rounder', icon: 'HandHelping', keywords: ['helper', 'assistant', 'support', 'all rounder'] },
  { id: 'nurse', category: 'support_admin', label: 'Nurse', labelEn: 'Nurse / Paramedic', icon: 'HeartPulse', keywords: ['nurse', 'health', 'medical', 'first aid', 'paramedic'] },
  { id: 'driver', category: 'support_admin', label: 'Driver', labelEn: 'Driver', icon: 'CarFront', keywords: ['driver', 'chauffeur', 'car driver'] },
  { id: 'other', category: 'support_admin', label: 'Other', labelEn: 'Other', icon: 'Plus', keywords: ['other', 'misc'] },
] as const;

export type SkillId = (typeof SKILL_LIST)[number]['id'];

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

// ── Sub-skills / specialisations per role ────────────────────────────────────
export const SUB_SKILLS_MAP: Record<string, readonly { id: string, label: string, labelEn?: string, keywords?: readonly string[] }[]> = {
  // Kitchen & Culinary
  executive_chef: [
    { id: 'menu_planning', label: 'Menu Planning' },
    { id: 'kitchen_management', label: 'Kitchen Management' },
    { id: 'food_costing', label: 'Food Costing' },
    { id: 'team_leadership', label: 'Team Leadership' },
    { id: 'multi_cuisine', label: 'Multi-Cuisine' },
    { id: 'quality_control', label: 'Quality Control' },
  ],
  sous_chef: [
    { id: 'station_management', label: 'Station Management' },
    { id: 'prep_supervision', label: 'Prep Supervision' },
    { id: 'plating', label: 'Plating & Presentation' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'scheduling', label: 'Staff Scheduling' },
  ],
  cook: CUISINE_LIST,
  prep_cook: [
    { id: 'cutting', label: 'Cutting & Chopping' },
    { id: 'marination', label: 'Marination & Prep' },
    { id: 'peeling', label: 'Peeling & Cleaning' },
    { id: 'stock_prep', label: 'Stocks & Gravies' },
    { id: 'portioning', label: 'Portioning' },
  ],
  tandoor: [
    { id: 'roti_naan', label: 'Roti & Naan' },
    { id: 'kebab_tikka', label: 'Kebabs & Tikka' },
    { id: 'breads_stuffed', label: 'Stuffed Breads' },
    { id: 'tandoori_starters', label: 'Tandoori Starters' },
    { id: 'shawarma', label: 'Shawarma' },
  ],
  grill_chef: [
    { id: 'steaks', label: 'Steaks' },
    { id: 'sizzlers', label: 'Sizzlers' },
    { id: 'bbq', label: 'BBQ & Smoking' },
    { id: 'seekh', label: 'Seekh & Skewers' },
    { id: 'grilled_seafood', label: 'Grilled Seafood' },
  ],
  chinese_chef: [
    { id: 'indo_chinese', label: 'Indo-Chinese' },
    { id: 'hakka', label: 'Hakka' },
    { id: 'thai', label: 'Thai' },
    { id: 'wok_station', label: 'Wok Station' },
    { id: 'dimsum', label: 'Dim Sum & Momos' },
  ],
  continental: [
    { id: 'pasta', label: 'Pasta & Italian' },
    { id: 'salads_starters', label: 'Salads & Starters' },
    { id: 'sauces', label: 'Sauces & Stocks' },
    { id: 'grills', label: 'Grills & Roasts' },
    { id: 'breakfast', label: 'Breakfast / Eggs' },
  ],
  pizza_chef: [
    { id: 'dough_making', label: 'Dough Making' },
    { id: 'wood_fired', label: 'Wood-Fired' },
    { id: 'toppings', label: 'Toppings & Assembly' },
    { id: 'calzone', label: 'Calzone & Rolls' },
    { id: 'garlic_bread', label: 'Garlic Bread & Sides' },
  ],
  biryani: [
    { id: 'hyderabadi', label: 'Hyderabadi' },
    { id: 'lucknowi', label: 'Lucknowi / Awadhi' },
    { id: 'kolkata', label: 'Kolkata Style' },
    { id: 'dum_biryani', label: 'Dum Biryani' },
    { id: 'pulao', label: 'Pulao & Rice' },
  ],
  baker: [
    { id: 'breads', label: 'Breads & Loaves' },
    { id: 'buns_pav', label: 'Buns & Pav' },
    { id: 'cookies', label: 'Cookies & Biscuits' },
    { id: 'muffins', label: 'Muffins & Cupcakes' },
    { id: 'sourdough', label: 'Sourdough & Artisan' },
  ],
  pastry_chef: [
    { id: 'cakes', label: 'Cakes & Gateaux' },
    { id: 'chocolate', label: 'Chocolate Work' },
    { id: 'desserts', label: 'Plated Desserts' },
    { id: 'croissants', label: 'Croissants & Viennoiserie' },
    { id: 'cake_decorating', label: 'Cake Decorating' },
  ],
  halwai: [
    { id: 'bengali_sweets', label: 'Bengali Sweets' },
    { id: 'dry_sweets', label: 'Dry Sweets / Barfi' },
    { id: 'milk_sweets', label: 'Milk Sweets' },
    { id: 'festival_sweets', label: 'Festival Sweets' },
    { id: 'namkeen', label: 'Namkeen & Snacks' },
  ],
  steward: [
    { id: 'dishwashing', label: 'Dishwashing' },
    { id: 'kitchen_cleaning', label: 'Kitchen Cleaning' },
    { id: 'garbage', label: 'Garbage Disposal' },
    { id: 'equipment_cleaning', label: 'Equipment Cleaning' },
    { id: 'pot_wash', label: 'Pot Wash' },
  ],
  dishwasher: [
    { id: 'hand_wash', label: 'Hand Wash' },
    { id: 'machine_wash', label: 'Machine Wash' },
    { id: 'pot_wash', label: 'Pot & Pan Wash' },
    { id: 'drying_stacking', label: 'Drying & Stacking' },
  ],

  // F&B Service
  captain: [
    { id: 'order_taking', label: 'Order Taking' },
    { id: 'upselling', label: 'Upselling' },
    { id: 'team_coordination', label: 'Team Coordination' },
    { id: 'billing_oversight', label: 'Billing Oversight' },
    { id: 'guest_handling', label: 'Guest Handling' },
  ],
  waiter: [
    { id: 'fine_dining', label: 'Fine Dining' },
    { id: 'casual_dining', label: 'Casual Dining' },
    { id: 'cafe_service', label: 'Cafe / QSR' },
    { id: 'room_service', label: 'Room Service' },
    { id: 'buffet_service', label: 'Buffet Service' },
    { id: 'wine_service', label: 'Wine Service' },
  ],
  host: [
    { id: 'greeting', label: 'Greeting' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'seating', label: 'Seating Plan' },
    { id: 'waitlist', label: 'Waitlist Management' },
    { id: 'guest_escort', label: 'Guest Escort' },
  ],
  room_service: [
    { id: 'order_delivery', label: 'Order Delivery' },
    { id: 'tray_setup', label: 'Tray / Trolley Setup' },
    { id: 'mini_bar', label: 'Mini Bar' },
    { id: 'amenity_setup', label: 'Amenity Setup' },
  ],
  runner: [
    { id: 'food_runner', label: 'Food Runner' },
    { id: 'drink_runner', label: 'Drink / Bar Runner' },
    { id: 'expeditor', label: 'Expeditor' },
    { id: 'table_clearing', label: 'Table Clearing' },
  ],
  qsr_crew: [
    { id: 'counter_billing', label: 'Counter Billing' },
    { id: 'order_assembly', label: 'Order Assembly' },
    { id: 'drive_thru', label: 'Drive-Thru' },
    { id: 'packing', label: 'Packing & Takeaway' },
    { id: 'frontline', label: 'Frontline Service' },
  ],

  // Bar & Beverage
  bartender: [
    { id: 'cocktails', label: 'Cocktails' },
    { id: 'mocktails', label: 'Mocktails' },
    { id: 'flair', label: 'Flair Bartending' },
    { id: 'beer_wine', label: 'Beer & Wine' },
    { id: 'bar_inventory', label: 'Bar Inventory' },
    { id: 'mixology', label: 'Mixology' },
  ],
  barista: [
    { id: 'espresso', label: 'Espresso Maker' },
    { id: 'latte_art', label: 'Latte Art' },
    { id: 'cold_brews', label: 'Cold Brews' },
    { id: 'manual_brew', label: 'Manual / Pour Over' },
    { id: 'tea_service', label: 'Tea Service' },
  ],
  bar_back: [
    { id: 'stocking', label: 'Stocking' },
    { id: 'glassware', label: 'Glassware' },
    { id: 'ice_garnish', label: 'Ice & Garnish' },
    { id: 'cleanup', label: 'Bar Cleanup' },
  ],
  juice_maker: [
    { id: 'fresh_juice', label: 'Fresh Juice' },
    { id: 'smoothies', label: 'Smoothies' },
    { id: 'shakes', label: 'Milkshakes' },
    { id: 'mocktails', label: 'Mocktails' },
  ],
  sommelier: [
    { id: 'wine_pairing', label: 'Wine Pairing' },
    { id: 'wine_service', label: 'Wine Service' },
    { id: 'cellar', label: 'Cellar Management' },
    { id: 'tasting', label: 'Tasting Notes' },
  ],

  // Front Office & Guest Services
  receptionist: [
    { id: 'check_in_out', label: 'Check-in / Check-out' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'billing', label: 'Billing & Cashiering' },
    { id: 'pms_software', label: 'PMS Software' },
    { id: 'guest_queries', label: 'Guest Queries' },
  ],
  concierge: [
    { id: 'local_info', label: 'Local Information' },
    { id: 'transport_booking', label: 'Transport Booking' },
    { id: 'ticketing', label: 'Ticketing & Tours' },
    { id: 'guest_requests', label: 'Guest Requests' },
  ],
  guest_relations: [
    { id: 'vip_handling', label: 'VIP Handling' },
    { id: 'feedback', label: 'Feedback Collection' },
    { id: 'complaints', label: 'Complaint Resolution' },
    { id: 'loyalty', label: 'Loyalty Programs' },
    { id: 'escort', label: 'Guest Escort' },
  ],
  bellboy: [
    { id: 'luggage', label: 'Luggage Handling' },
    { id: 'guest_escort', label: 'Guest Escort' },
    { id: 'lobby_assistance', label: 'Lobby Assistance' },
    { id: 'errands', label: 'Errands' },
  ],
  valet: [
    { id: 'manual_cars', label: 'Manual Cars' },
    { id: 'automatic_cars', label: 'Automatic Cars' },
    { id: 'luxury_cars', label: 'Luxury Cars' },
    { id: 'parking_management', label: 'Parking Management' },
  ],
  doorman: [
    { id: 'greeting', label: 'Greeting' },
    { id: 'door_service', label: 'Door Service' },
    { id: 'traffic', label: 'Traffic Control' },
    { id: 'umbrella_service', label: 'Umbrella Service' },
  ],
  telephone_operator: [
    { id: 'call_handling', label: 'Call Handling' },
    { id: 'wake_up_calls', label: 'Wake-up Calls' },
    { id: 'message_relay', label: 'Message Relay' },
    { id: 'directory', label: 'Directory Service' },
  ],

  // Housekeeping & Laundry
  housekeeper: [
    { id: 'room_cleaning', label: 'Room Cleaning' },
    { id: 'public_area', label: 'Public Areas' },
    { id: 'turndown', label: 'Turndown Service' },
    { id: 'amenity_replenish', label: 'Amenity Replenish' },
    { id: 'bathroom', label: 'Bathroom Cleaning' },
  ],
  room_attendant: [
    { id: 'bed_making', label: 'Bed Making' },
    { id: 'dusting', label: 'Dusting' },
    { id: 'vacuuming', label: 'Vacuuming' },
    { id: 'bathroom_cleaning', label: 'Bathroom Cleaning' },
    { id: 'mini_bar', label: 'Mini Bar Refill' },
  ],
  cleaner: [
    { id: 'floor_cleaning', label: 'Floor Cleaning' },
    { id: 'deep_cleaning', label: 'Deep Cleaning' },
    { id: 'washrooms', label: 'Washrooms' },
    { id: 'glass_cleaning', label: 'Glass & Facade' },
    { id: 'waste', label: 'Waste Management' },
  ],
  laundry: [
    { id: 'washing', label: 'Washing' },
    { id: 'ironing', label: 'Ironing / Pressing' },
    { id: 'dry_cleaning', label: 'Dry Cleaning' },
    { id: 'folding', label: 'Folding & Packing' },
    { id: 'stain_removal', label: 'Stain Removal' },
  ],
  linen_attendant: [
    { id: 'linen_issue', label: 'Linen Issue' },
    { id: 'uniform_management', label: 'Uniform Management' },
    { id: 'minor_stitching', label: 'Minor Stitching' },
    { id: 'inventory', label: 'Linen Inventory' },
  ],

  // Events & Banquets
  banquet: [
    { id: 'setup', label: 'Hall Setup' },
    { id: 'food_serving', label: 'Food Serving' },
    { id: 'teardown', label: 'Teardown / Cleanup' },
    { id: 'buffet', label: 'Buffet Service' },
    { id: 'plated_service', label: 'Plated Service' },
  ],
  banquet_captain: [
    { id: 'team_briefing', label: 'Team Briefing' },
    { id: 'floor_plan', label: 'Floor Plan' },
    { id: 'service_flow', label: 'Service Flow' },
    { id: 'client_coordination', label: 'Client Coordination' },
  ],
  event_setup: [
    { id: 'stage_setup', label: 'Stage Setup' },
    { id: 'seating', label: 'Seating Arrangement' },
    { id: 'tent_mandap', label: 'Tent & Mandap' },
    { id: 'lighting_basic', label: 'Basic Lighting' },
    { id: 'teardown', label: 'Teardown' },
  ],
  decorator: [
    { id: 'floral', label: 'Floral Decor' },
    { id: 'stage_decor', label: 'Stage Decor' },
    { id: 'table_setup', label: 'Table Setup' },
    { id: 'balloon', label: 'Balloon Decor' },
    { id: 'theme_decor', label: 'Theme Decor' },
  ],
  caterer: [
    { id: 'bulk_serving', label: 'Bulk Serving' },
    { id: 'live_counter', label: 'Live Counter' },
    { id: 'packing', label: 'Packing' },
    { id: 'transport_setup', label: 'Transport & Setup' },
  ],
  emcee: [
    { id: 'stage_anchoring', label: 'Stage Anchoring' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'crowd_engagement', label: 'Crowd Engagement' },
    { id: 'bilingual', label: 'Bilingual Hosting' },
  ],
  dj: [
    { id: 'mixing', label: 'Mixing' },
    { id: 'sound_setup', label: 'Sound Setup' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'playlist', label: 'Playlist Curation' },
  ],
  event_photographer: [
    { id: 'candid', label: 'Candid' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'video', label: 'Videography' },
    { id: 'drone', label: 'Drone' },
    { id: 'editing', label: 'Editing' },
  ],

  // Wellness & Recreation
  spa: [
    { id: 'swedish', label: 'Swedish Massage' },
    { id: 'thai', label: 'Thai Massage' },
    { id: 'deep_tissue', label: 'Deep Tissue' },
    { id: 'aromatherapy', label: 'Aromatherapy' },
    { id: 'ayurvedic', label: 'Ayurvedic' },
    { id: 'reflexology', label: 'Reflexology' },
  ],
  masseur: [
    { id: 'full_body', label: 'Full Body' },
    { id: 'head_massage', label: 'Head Massage' },
    { id: 'foot_massage', label: 'Foot Massage' },
    { id: 'couple', label: 'Couple Massage' },
  ],
  beautician: [
    { id: 'facial', label: 'Facials & Skin' },
    { id: 'threading', label: 'Threading' },
    { id: 'waxing', label: 'Waxing' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'manicure_pedicure', label: 'Manicure / Pedicure' },
  ],
  hair_stylist: [
    { id: 'haircut', label: 'Haircut' },
    { id: 'hair_spa', label: 'Hair Spa' },
    { id: 'coloring', label: 'Coloring' },
    { id: 'styling', label: 'Styling' },
    { id: 'beard', label: 'Beard & Grooming' },
  ],
  gym_trainer: [
    { id: 'personal_training', label: 'Personal Training' },
    { id: 'weight_training', label: 'Weight Training' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'nutrition', label: 'Nutrition Guidance' },
  ],
  yoga_instructor: [
    { id: 'hatha', label: 'Hatha' },
    { id: 'power_yoga', label: 'Power Yoga' },
    { id: 'meditation', label: 'Meditation' },
    { id: 'breathing', label: 'Pranayama' },
  ],
  lifeguard: [
    { id: 'pool_safety', label: 'Pool Safety' },
    { id: 'swimming_aid', label: 'Swimming Aid' },
    { id: 'pool_cleaning', label: 'Pool Cleaning' },
    { id: 'first_aid', label: 'First Aid' },
  ],

  // Maintenance & Facilities
  maintenance: [
    { id: 'general_repair', label: 'General Repair' },
    { id: 'preventive', label: 'Preventive Maintenance' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'equipment', label: 'Equipment Upkeep' },
  ],
  electrician: [
    { id: 'wiring', label: 'Wiring' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'panel', label: 'Panel & DB' },
    { id: 'appliance', label: 'Appliance Repair' },
    { id: 'generator', label: 'Generator / Inverter' },
  ],
  plumber: [
    { id: 'pipe_fitting', label: 'Pipe Fitting' },
    { id: 'leak_repair', label: 'Leak Repair' },
    { id: 'drainage', label: 'Drainage' },
    { id: 'sanitary', label: 'Sanitary Ware' },
    { id: 'water_pump', label: 'Water Pump' },
  ],
  ac_technician: [
    { id: 'ac_service', label: 'AC Service' },
    { id: 'hvac', label: 'HVAC' },
    { id: 'refrigeration', label: 'Refrigeration' },
    { id: 'chiller', label: 'Chiller Plant' },
    { id: 'ducting', label: 'Ducting' },
  ],
  carpenter: [
    { id: 'furniture_repair', label: 'Furniture Repair' },
    { id: 'fitting', label: 'Fitting & Fixtures' },
    { id: 'polishing', label: 'Polishing' },
    { id: 'custom', label: 'Custom Woodwork' },
  ],
  painter: [
    { id: 'wall_painting', label: 'Wall Painting' },
    { id: 'texture', label: 'Texture & Design' },
    { id: 'polishing', label: 'Polishing' },
    { id: 'waterproofing', label: 'Waterproofing' },
  ],
  gardener: [
    { id: 'lawn_care', label: 'Lawn Care' },
    { id: 'pruning', label: 'Pruning' },
    { id: 'planting', label: 'Planting' },
    { id: 'irrigation', label: 'Irrigation' },
    { id: 'landscaping', label: 'Landscaping' },
  ],

  // Security & Safety
  security: [
    { id: 'gate_guard', label: 'Gate / Entry Guard' },
    { id: 'patrolling', label: 'Patrolling' },
    { id: 'access_control', label: 'Access Control' },
    { id: 'frisking', label: 'Frisking' },
    { id: 'night_duty', label: 'Night Duty' },
  ],
  bouncer: [
    { id: 'crowd_control', label: 'Crowd Control' },
    { id: 'vip_security', label: 'VIP Security' },
    { id: 'conflict', label: 'Conflict Handling' },
    { id: 'id_check', label: 'ID Check' },
  ],
  cctv_operator: [
    { id: 'monitoring', label: 'Monitoring' },
    { id: 'incident_logging', label: 'Incident Logging' },
    { id: 'alarm_response', label: 'Alarm Response' },
    { id: 'recording', label: 'Recording Review' },
  ],
  fire_safety: [
    { id: 'fire_drill', label: 'Fire Drills' },
    { id: 'equipment_check', label: 'Equipment Check' },
    { id: 'evacuation', label: 'Evacuation' },
    { id: 'first_response', label: 'First Response' },
  ],

  // Support & Admin
  cashier: [
    { id: 'pos_billing', label: 'POS & Billing' },
    { id: 'cash_handling', label: 'Cash Handling' },
    { id: 'card_upi', label: 'Card / UPI' },
    { id: 'reconciliation', label: 'Reconciliation' },
  ],
  store_keeper: [
    { id: 'inventory', label: 'Inventory' },
    { id: 'stock_receiving', label: 'Stock Receiving' },
    { id: 'issuing', label: 'Issuing' },
    { id: 'record_keeping', label: 'Record Keeping' },
    { id: 'fifo', label: 'FIFO / Stock Rotation' },
  ],
  helper: [
    { id: 'kitchen_helper', label: 'Kitchen Helper' },
    { id: 'service_helper', label: 'Service Helper' },
    { id: 'general_helper', label: 'General / All-rounder' },
    { id: 'loading', label: 'Loading & Shifting' },
  ],
  nurse: [
    { id: 'first_aid', label: 'First Aid' },
    { id: 'elderly_care', label: 'Elderly Care' },
    { id: 'child_care', label: 'Child Care' },
    { id: 'medication', label: 'Medication' },
    { id: 'emergency', label: 'Emergency Response' },
  ],
  driver: [
    { id: 'car', label: 'Car' },
    { id: 'tempo_traveller', label: 'Tempo Traveller' },
    { id: 'bus', label: 'Bus / Coach' },
    { id: 'luxury', label: 'Luxury Cars' },
    { id: 'app_cab', label: 'App Cab (Ola/Uber)' },
  ],
  other: [],
};

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
  { id: 'morning', label: 'Morning', labelEn: 'Morning', from: '06:00', to: '12:00', icon: 'Sunrise' },
  { id: 'afternoon', label: 'Afternoon', labelEn: 'Afternoon', from: '12:00', to: '17:00', icon: 'Sun' },
  { id: 'evening', label: 'Evening', labelEn: 'Evening', from: '17:00', to: '22:00', icon: 'Sunset' },
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
