// Categorized vehicle models by manufacturer
export const MANUFACTURER_MODELS = {
  'Toyota': [
    'Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Sienna', 'Tacoma',
    'Tundra', '4Runner', 'Avalon', 'Yaris', 'C-HR', 'Venza', 'Sequoia',
    'Land Cruiser', 'Supra', 'GR86', 'Mirai'
  ],

  'Ford': [
    'F-150', 'Escape', 'Explorer', 'Mustang', 'Fusion', 'Focus', 'Edge',
    'Expedition', 'Transit', 'Ranger', 'Bronco', 'Maverick', 'Super Duty',
    'EcoSport', 'Fiesta', 'Taurus', 'Flex', 'C-Max'
  ],

  'Chevrolet': [
    'Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Suburban', 'Traverse',
    'Camaro', 'Corvette', 'Blazer', 'Colorado', 'Impala', 'Cruze',
    'Sonic', 'Trax', 'Spark', 'Express', 'Avalanche'
  ],

  'Honda': [
    'Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V',
    'Passport', 'Ridgeline', 'Insight', 'Clarity', 'Element', 'S2000',
    'Prelude', 'Del Sol'
  ],

  'Nissan': [
    'Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Maxima',
    'Versa', 'Armada', 'Titan', 'Frontier', '370Z', 'GT-R', 'Leaf',
    'Kicks', 'Juke', 'Quest', 'NV200', 'Xterra'
  ],

  'BMW': [
    '3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X1', 'X7',
    '4 Series', '6 Series', '8 Series', 'Z4', 'i3', 'i8', 'X2',
    'X4', 'X6', 'M3', 'M5', 'M8'
  ],

  'Mercedes-Benz': [
    'C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLA', 'GLS',
    'A-Class', 'CLA', 'CLS', 'G-Class', 'SL', 'SLC', 'AMG GT',
    'Metris', 'Sprinter'
  ],

  'Audi': [
    'A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8',
    'e-tron', 'A5', 'A7', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8',
    'RS3', 'RS4', 'RS5', 'RS6', 'RS7'
  ],

  'Volkswagen': [
    'Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Beetle', 'Arteon',
    'ID.4', 'Touareg', 'CC', 'Routan', 'Eos', 'GTI', 'Golf R'
  ],

  'Hyundai': [
    'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Veloster',
    'Genesis', 'Azera', 'Palisade', 'Venue', 'Kona', 'Nexo', 'Ioniq'
  ],

  'Subaru': [
    'Outback', 'Forester', 'Impreza', 'Legacy', 'Crosstrek', 'Ascent',
    'WRX', 'STI', 'BRZ', 'Tribeca', 'Baja'
  ],

  'Mazda': [
    'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'MX-5 Miata',
    'CX-30', 'Mazda2', 'RX-8', 'CX-7'
  ],

  'Kia': [
    'Optima', 'Forte', 'Sorento', 'Sportage', 'Soul', 'Rio', 'Sedona',
    'Stinger', 'Niro', 'Telluride', 'Seltos', 'K5', 'Carnival'
  ],

  'Jeep': [
    'Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade',
    'Gladiator', 'Patriot', 'Liberty', 'Commander', 'Wagoneer', 'Grand Wagoneer'
  ],

  'GMC': [
    'Sierra', 'Terrain', 'Acadia', 'Yukon', 'Canyon', 'Savana',
    'Envoy', 'Jimmy', 'Suburban', 'Denali'
  ],

  'Cadillac': [
    'Escalade', 'CTS', 'ATS', 'XTS', 'SRX', 'XT5', 'XT4', 'XT6',
    'CT6', 'CT5', 'CT4', 'Eldorado', 'DeVille'
  ],

  'Lexus': [
    'ES', 'IS', 'GS', 'LS', 'RX', 'GX', 'LX', 'NX', 'UX', 'RC',
    'LC', 'LFA', 'CT', 'SC'
  ],

  'Infiniti': [
    'Q50', 'Q60', 'QX50', 'QX60', 'QX80', 'G35', 'G37', 'FX35',
    'FX37', 'EX35', 'M35', 'M37'
  ],

  'Acura': [
    'TLX', 'ILX', 'RDX', 'MDX', 'NSX', 'TSX', 'TL', 'RL', 'ZDX',
    'RSX', 'Integra'
  ],

  'Tesla': [
    'Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'
  ],

  'Porsche': [
    '911', 'Cayenne', 'Macan', 'Panamera', 'Boxster', 'Cayman',
    'Taycan', '718', 'Carrera'
  ],

  'Ram': [
    '1500', '2500', '3500', 'ProMaster', 'Dakota'
  ],

  'Dodge': [
    'Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan',
    'Dart', 'Avenger', 'Nitro', 'Magnum', 'Viper', 'Ram'
  ],

  'Lincoln': [
    'Navigator', 'Aviator', 'Corsair', 'Nautilus', 'Continental',
    'MKZ', 'MKX', 'MKC', 'Town Car', 'Mark LT'
  ],

  'Volvo': [
    'XC90', 'XC60', 'XC40', 'S60', 'S90', 'V60', 'V90', 'C30',
    'C70', 'S40', 'V40', 'V70', 'S80'
  ],

  'Buick': [
    'Enclave', 'Encore', 'Envision', 'LaCrosse', 'Regal', 'Verano',
    'LeSabre', 'Century', 'Park Avenue'
  ],

  'Chrysler': [
    'Pacifica', '300', 'Voyager', 'Town & Country', 'Sebring',
    'Concorde', 'PT Cruiser', 'Crossfire'
  ],

  'Mitsubishi': [
    'Outlander', 'Eclipse Cross', 'Mirage', 'Lancer', 'Eclipse',
    'Galant', 'Montero', 'Endeavor'
  ],

  'Mini': [
    'Cooper', 'Countryman', 'Clubman', 'Paceman', 'Roadster', 'Coupe'
  ],

  'Genesis': [
    'G90', 'G80', 'GV70', 'GV80', 'Coupe'
  ]
} as const;

// Top manufacturers list (keeping original order)
export const TOP_MANUFACTURERS = [
  'Toyota',
  'Ford',
  'Chevrolet',
  'Honda',
  'Nissan',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Hyundai',
  'Subaru',
  'Mazda',
  'Kia',
  'Jeep',
  'GMC',
  'Cadillac',
  'Lexus',
  'Infiniti',
  'Acura',
  'Volvo',
  'Buick',
  'Ram',
  'Dodge',
  'Chrysler',
  'Lincoln',
  'Mitsubishi',
  'Mini',
  'Genesis',
  'Tesla',
  'Porsche',
] as const;

// Helper function to get models for a manufacturer
export function getModelsForManufacturer(manufacturer: string): string[] {
  const models = MANUFACTURER_MODELS[manufacturer as keyof typeof MANUFACTURER_MODELS];
  return models ? [...models] : [];
}

// Helper function to get all models (flattened)
export function getAllModels(): string[] {
  return Object.values(MANUFACTURER_MODELS).flat();
}

// Vehicle body types for fallback
export const VEHICLE_TYPES = [
  'Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback',
  'Wagon', 'Crossover', 'Pickup', 'Van', 'Minivan'
] as const;