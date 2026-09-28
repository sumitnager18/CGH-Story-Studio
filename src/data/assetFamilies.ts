import { ArtStyle, CameraPreset } from '../types';
import { AssetCategory } from '../types/assets';

export interface AssetFamilyDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  subcategory: string;
  archetype: string;
  tags: string[];
  promptTpl: string;
  defaultStyle?: ArtStyle;
  cameraPreset?: CameraPreset;
  // Visual specification for deterministic rendering
  visualTrait?: {
    headShape?: 'round' | 'oval' | 'square' | 'long' | 'heart' | 'wide' | 'narrow';
    hairStyle?: 'short' | 'medium' | 'long' | 'curly' | 'straight' | 'wavy' | 'bun' | 'ponytail' | 'braids' | 'shaved' | 'afro' | 'layered' | 'messy' | 'formal' | 'turban';
    outfit?: 'uniform' | 'suit' | 'labcoat' | 'scrubs' | 'hoodie' | 'kurta' | 'saree' | 'chef' | 'armor' | 'cyber' | 'spacesuit' | 'casual' | 'vest' | 'robes' | 'overalls' | 'athletic' | 'police' | 'trenchcoat';
    accessory?: 'glasses' | 'stethoscope' | 'camera' | 'backpack' | 'hardhat' | 'toque' | 'headset' | 'tools' | 'badge' | 'pointer' | 'book' | 'tablet' | 'none';
    ageGroup?: 'child' | 'teen' | 'young-adult' | 'adult' | 'middle-aged' | 'senior';
    genderPresentation?: 'neutral' | 'masculine' | 'feminine';
    specialType?: 'human' | 'robot' | 'android' | 'alien' | 'monster' | 'creature' | 'mascot' | 'animal';
  };
}

// -----------------------------------------------------------------------------
// 1. CHARACTER FAMILIES (42 Distinct Archetype Families)
// -----------------------------------------------------------------------------
export const CHARACTER_FAMILIES: AssetFamilyDefinition[] = [
  {
    id: 'char_child',
    name: 'Child Explorer',
    category: 'characters',
    subcategory: 'Youth & Family',
    archetype: 'child',
    tags: ['child', 'kid', 'young', 'playful', 'curious', 'family'],
    promptTpl: 'Young child character with rounded cheeks, playful expression, casual yellow polo and mini backpack',
    visualTrait: { ageGroup: 'child', headShape: 'round', hairStyle: 'messy', outfit: 'casual', accessory: 'backpack' }
  },
  {
    id: 'char_teen',
    name: 'Teen Student',
    category: 'characters',
    subcategory: 'Modern High Schoolers',
    archetype: 'teen',
    tags: ['teen', 'student', 'youth', 'highschool', 'casual', 'headphones'],
    promptTpl: 'High school teenager with stylish oversized hoodie, wireless headphones around neck, expressive eyes',
    visualTrait: { ageGroup: 'teen', headShape: 'oval', hairStyle: 'layered', outfit: 'hoodie', accessory: 'headset' }
  },
  {
    id: 'char_young_adult',
    name: 'Young Adult Urbanite',
    category: 'characters',
    subcategory: 'Streetwear Trendsetters',
    archetype: 'young-adult',
    tags: ['young-adult', 'college', 'urban', 'modern', 'trendy'],
    promptTpl: 'Confident university student in tailored casual denim jacket, smart satchel bag, clean modern haircut',
    visualTrait: { ageGroup: 'young-adult', headShape: 'oval', hairStyle: 'short', outfit: 'casual', accessory: 'backpack' }
  },
  {
    id: 'char_adult',
    name: 'Adult Everyday',
    category: 'characters',
    subcategory: 'Everyday People',
    archetype: 'adult',
    tags: ['adult', 'person', 'contemporary', 'casual', 'relatable'],
    promptTpl: 'Contemporary adult in clean collared shirt, neat hair, approachable warm expression',
    visualTrait: { ageGroup: 'adult', headShape: 'oval', hairStyle: 'straight', outfit: 'casual', accessory: 'none' }
  },
  {
    id: 'char_middle_aged',
    name: 'Middle Aged Mentor',
    category: 'characters',
    subcategory: 'Mentors & Leaders',
    archetype: 'middle-aged',
    tags: ['middle-aged', 'mentor', 'experienced', 'gentle', 'wise'],
    promptTpl: 'Mature middle-aged professional with slight laugh lines, smart cardigan sweater, composed presence',
    visualTrait: { ageGroup: 'middle-aged', headShape: 'square', hairStyle: 'short', outfit: 'suit', accessory: 'glasses' }
  },
  {
    id: 'char_senior',
    name: 'Senior Elder',
    category: 'characters',
    subcategory: 'Elders & Storytellers',
    archetype: 'senior',
    tags: ['senior', 'elder', 'grandparent', 'wise', 'silver-hair'],
    promptTpl: 'Kind elderly grandfather/grandmother with silver hair, warm spectacles, draped knit shawl',
    visualTrait: { ageGroup: 'senior', headShape: 'round', hairStyle: 'wavy', outfit: 'casual', accessory: 'glasses' }
  },
  {
    id: 'char_teacher',
    name: 'Academic Teacher',
    category: 'characters',
    subcategory: 'Education & Academics',
    archetype: 'teacher',
    tags: ['teacher', 'professor', 'educator', 'school', 'glasses', 'academic'],
    promptTpl: 'Dedicated school teacher holding lesson clipboard, stylish spectacles, neat blazer',
    visualTrait: { ageGroup: 'adult', headShape: 'oval', hairStyle: 'bun', outfit: 'suit', accessory: 'pointer' }
  },
  {
    id: 'char_student',
    name: 'Uniformed Student',
    category: 'characters',
    subcategory: 'Modern High Schoolers',
    archetype: 'student',
    tags: ['student', 'school', 'uniform', 'backpack', 'teen', 'study'],
    promptTpl: 'School student in crisp blazer uniform with navy tie, shoulder bookbag, earnest look',
    visualTrait: { ageGroup: 'teen', headShape: 'oval', hairStyle: 'short', outfit: 'uniform', accessory: 'backpack' }
  },
  {
    id: 'char_scientist',
    name: 'Research Scientist',
    category: 'characters',
    subcategory: 'Science & Medical',
    archetype: 'scientist',
    tags: ['scientist', 'researcher', 'lab', 'chemistry', 'goggles', 'labcoat'],
    promptTpl: 'Brilliant research scientist in white laboratory coat, protective eye goggles, holding test tube vial',
    visualTrait: { ageGroup: 'adult', headShape: 'long', hairStyle: 'messy', outfit: 'labcoat', accessory: 'glasses' }
  },
  {
    id: 'char_doctor',
    name: 'Medical Doctor',
    category: 'characters',
    subcategory: 'Science & Medical',
    archetype: 'doctor',
    tags: ['doctor', 'physician', 'hospital', 'scrubs', 'stethoscope', 'healthcare'],
    promptTpl: 'Caring hospital physician in teal medical scrubs with stethoscope draped over shoulders',
    visualTrait: { ageGroup: 'adult', headShape: 'oval', hairStyle: 'short', outfit: 'scrubs', accessory: 'stethoscope' }
  },
  {
    id: 'char_police',
    name: 'Police Officer',
    category: 'characters',
    subcategory: 'Civil Services & Safety',
    archetype: 'police',
    tags: ['police', 'officer', 'uniform', 'badge', 'law', 'service'],
    promptTpl: 'Alert law enforcement officer in dark navy uniform with polished brass badge and peaked cap',
    visualTrait: { ageGroup: 'adult', headShape: 'square', hairStyle: 'shaved', outfit: 'police', accessory: 'badge' }
  },
  {
    id: 'char_detective',
    name: 'Private Detective',
    category: 'characters',
    subcategory: 'Mystery & Noir',
    archetype: 'detective',
    tags: ['detective', 'investigator', 'trenchcoat', 'fedora', 'mystery', 'clues'],
    promptTpl: 'Sharp investigative detective in classic tan trenchcoat with turned-up collar and leather notepad',
    visualTrait: { ageGroup: 'adult', headShape: 'long', hairStyle: 'short', outfit: 'trenchcoat', accessory: 'glasses' }
  },
  {
    id: 'char_engineer',
    name: 'Site Engineer',
    category: 'characters',
    subcategory: 'Industry & Craft',
    archetype: 'engineer',
    tags: ['engineer', 'technician', 'blueprints', 'helmet', 'construction'],
    promptTpl: 'Professional civil engineer with white safety hardhat, high-vis orange vest, holding rolled blueprints',
    visualTrait: { ageGroup: 'adult', headShape: 'square', hairStyle: 'short', outfit: 'vest', accessory: 'hardhat' }
  },
  {
    id: 'char_office_worker',
    name: 'Corporate Executive',
    category: 'characters',
    subcategory: 'Business & Corporate',
    archetype: 'office-worker',
    tags: ['office', 'corporate', 'business', 'tie', 'desk', 'professional'],
    promptTpl: 'Corporate office worker in pressed white shirt and silk tie with security lanyard badge',
    visualTrait: { ageGroup: 'adult', headShape: 'oval', hairStyle: 'formal', outfit: 'suit', accessory: 'badge' }
  },
  {
    id: 'char_farmer',
    name: 'Agronomist Farmer',
    category: 'characters',
    subcategory: 'Agriculture & Rural',
    archetype: 'farmer',
    tags: ['farmer', 'agriculture', 'rural', 'harvest', 'nature', 'hardworking'],
    promptTpl: 'Hardworking farmer with woven straw sunhat, durable cotton kurta, holding fresh golden wheat sheaf',
    visualTrait: { ageGroup: 'middle-aged', headShape: 'square', hairStyle: 'short', outfit: 'kurta', accessory: 'none' }
  },
  {
    id: 'char_shopkeeper',
    name: 'Local Shopkeeper',
    category: 'characters',
    subcategory: 'Commerce & Retail',
    archetype: 'shopkeeper',
    tags: ['shopkeeper', 'retail', 'merchant', 'store', 'friendly'],
    promptTpl: 'Welcoming neighborhood store owner in canvas waist apron, holding ledger clipboard with friendly smile',
    visualTrait: { ageGroup: 'adult', headShape: 'round', hairStyle: 'curly', outfit: 'casual', accessory: 'pointer' }
  },
  {
    id: 'char_driver',
    name: 'Transit Driver',
    category: 'characters',
    subcategory: 'Transport & Logistics',
    archetype: 'driver',
    tags: ['driver', 'transit', 'bus', 'pilot', 'transport'],
    promptTpl: 'Focused urban transit driver in uniform jacket with peaked driver cap and reflective badge',
    visualTrait: { ageGroup: 'adult', headShape: 'square', hairStyle: 'short', outfit: 'uniform', accessory: 'badge' }
  },
  {
    id: 'char_builder',
    name: 'Master Builder',
    category: 'characters',
    subcategory: 'Industry & Craft',
    archetype: 'builder',
    tags: ['builder', 'construction', 'tools', 'hammer', 'hardhat', 'overalls'],
    promptTpl: 'Skilled construction builder in heavy denim overalls with heavy leather toolbelt and claw hammer',
    visualTrait: { ageGroup: 'adult', headShape: 'wide', hairStyle: 'shaved', outfit: 'overalls', accessory: 'hardhat' }
  },
  {
    id: 'char_artist',
    name: 'Creative Artist',
    category: 'characters',
    subcategory: 'Arts & Design',
    archetype: 'artist',
    tags: ['artist', 'painter', 'creative', 'palette', 'beret', 'colorful'],
    promptTpl: 'Creative studio painter wearing classic navy beret, linen apron flecked with oil paint, holding wooden palette',
    visualTrait: { ageGroup: 'young-adult', headShape: 'oval', hairStyle: 'curly', outfit: 'casual', accessory: 'none' }
  },
  {
    id: 'char_chef',
    name: 'Executive Chef',
    category: 'characters',
    subcategory: 'Culinary Arts',
    archetype: 'chef',
    tags: ['chef', 'culinary', 'kitchen', 'cooking', 'restaurant', 'toque'],
    promptTpl: 'Master executive chef in tall pleated toque blanche hat and double-breasted white kitchen jacket',
    visualTrait: { ageGroup: 'adult', headShape: 'round', hairStyle: 'bun', outfit: 'chef', accessory: 'toque' }
  },
  {
    id: 'char_athlete',
    name: 'Championship Athlete',
    category: 'characters',
    subcategory: 'Sports & Fitness',
    archetype: 'athlete',
    tags: ['athlete', 'runner', 'sports', 'fitness', 'track', 'energetic'],
    promptTpl: 'Dynamic sprinter athlete in aerodynamic compression jersey with athletic headband and running shoes',
    visualTrait: { ageGroup: 'young-adult', headShape: 'oval', hairStyle: 'ponytail', outfit: 'athletic', accessory: 'none' }
  },
  {
    id: 'char_soldier',
    name: 'Tactical Soldier',
    category: 'characters',
    subcategory: 'Military & Defense',
    archetype: 'soldier',
    tags: ['soldier', 'tactical', 'military', 'camo', 'beret', 'disciplined'],
    promptTpl: 'Disciplined infantry operative in matte tactical fatigues with modular chest rig and green beret',
    visualTrait: { ageGroup: 'adult', headShape: 'square', hairStyle: 'shaved', outfit: 'uniform', accessory: 'badge' }
  },
  {
    id: 'char_journalist',
    name: 'Field Journalist',
    category: 'characters',
    subcategory: 'Media & Journalism',
    archetype: 'journalist',
    tags: ['journalist', 'reporter', 'camera', 'press', 'microphone', 'news'],
    promptTpl: 'Inquisitive field news reporter in durable utility vest holding handheld microphone and camera strap',
    visualTrait: { ageGroup: 'adult', headShape: 'oval', hairStyle: 'short', outfit: 'vest', accessory: 'camera' }
  },
  {
    id: 'char_business_person',
    name: 'Business Magnate',
    category: 'characters',
    subcategory: 'Business & Corporate',
    archetype: 'business-person',
    tags: ['business', 'suit', 'leader', 'executive', 'wealthy', 'formal'],
    promptTpl: 'Sharp corporate executive in charcoal bespoke pinstripe suit, holding slim briefcase and luxury watch',
    visualTrait: { ageGroup: 'middle-aged', headShape: 'square', hairStyle: 'formal', outfit: 'suit', accessory: 'none' }
  },
  {
    id: 'char_villager',
    name: 'Heritage Villager',
    category: 'characters',
    subcategory: 'Agriculture & Rural',
    archetype: 'villager',
    tags: ['villager', 'rural', 'traditional', 'folk', 'authentic'],
    promptTpl: 'Rural village resident in traditional unbleached cotton attire with colorful woven sash',
    visualTrait: { ageGroup: 'adult', headShape: 'round', hairStyle: 'turban', outfit: 'kurta', accessory: 'none' }
  },
  {
    id: 'char_royal_character',
    name: 'Regal Monarch',
    category: 'characters',
    subcategory: 'Mythic & Fantasy',
    archetype: 'royal-character',
    tags: ['royal', 'king', 'queen', 'crown', 'monarch', 'majestic'],
    promptTpl: 'Regal monarch draped in ermine-lined royal crimson velvet cape, adorned with golden filigree crown',
    visualTrait: { ageGroup: 'adult', headShape: 'oval', hairStyle: 'long', outfit: 'robes', accessory: 'none' }
  },
  {
    id: 'char_fantasy_warrior',
    name: 'Fantasy Knight Warrior',
    category: 'characters',
    subcategory: 'Dark Fantasy Mages',
    archetype: 'fantasy-warrior',
    tags: ['warrior', 'knight', 'armor', 'sword', 'fantasy', 'heroic'],
    promptTpl: 'Heroic fantasy knight in chased steel plate breastplate with lion crest and broad shoulder pauldrons',
    visualTrait: { ageGroup: 'young-adult', headShape: 'square', hairStyle: 'short', outfit: 'armor', accessory: 'none' }
  },
  {
    id: 'char_wizard',
    name: 'Grand Arcane Wizard',
    category: 'characters',
    subcategory: 'Dark Fantasy Mages',
    archetype: 'wizard',
    tags: ['wizard', 'mage', 'sorcerer', 'magic', 'staff', 'spellcaster'],
    promptTpl: 'Venerable spellcaster in deep indigo constellation robes wielding carved wooden staff with mana orb',
    visualTrait: { ageGroup: 'senior', headShape: 'long', hairStyle: 'long', outfit: 'robes', accessory: 'pointer' }
  },
  {
    id: 'char_detective_noir',
    name: 'Noir Investigator',
    category: 'characters',
    subcategory: 'Mystery & Noir',
    archetype: 'detective-noir',
    tags: ['noir', 'shadows', 'detective', 'fedora', 'rain', 'smoke', '1940s'],
    promptTpl: 'Cynical 1940s noir private eye in heavy rain-soaked trenchcoat with eyes shaded under dark fedora brim',
    visualTrait: { ageGroup: 'adult', headShape: 'square', hairStyle: 'short', outfit: 'trenchcoat', accessory: 'none' }
  },
  {
    id: 'char_cyberpunk',
    name: 'Cyberpunk Netrunner',
    category: 'characters',
    subcategory: 'Cyberpunk Hackers',
    archetype: 'cyberpunk-character',
    tags: ['cyberpunk', 'netrunner', 'neon', 'visor', 'hacker', 'trenchcoat'],
    promptTpl: 'Agile cyberpunk hacker with glowing neon optical visor, high-collar cyber trenchcoat and datapad',
    visualTrait: { ageGroup: 'young-adult', headShape: 'oval', hairStyle: 'layered', outfit: 'cyber', accessory: 'tablet' }
  },
  {
    id: 'char_scifi_character',
    name: 'Sci-Fi Exosuit Specialist',
    category: 'characters',
    subcategory: 'Sci-Fi Pilots',
    archetype: 'scifi-character',
    tags: ['scifi', 'exosuit', 'future', 'technology', 'armor'],
    promptTpl: 'Futuristic planetary explorer in pressurized composite carbon exosuit with wrist holographic HUD',
    visualTrait: { ageGroup: 'adult', headShape: 'oval', hairStyle: 'short', outfit: 'spacesuit', accessory: 'none' }
  },
  {
    id: 'char_space_crew',
    name: 'Astronaut Crew',
    category: 'characters',
    subcategory: 'Sci-Fi Pilots',
    archetype: 'space-crew',
    tags: ['astronaut', 'space', 'crew', 'suit', 'nasa', 'helmet'],
    promptTpl: 'Space station flight commander in white pressurized mobility suit with reflective gold sun visor',
    visualTrait: { ageGroup: 'adult', headShape: 'round', hairStyle: 'short', outfit: 'spacesuit', accessory: 'hardhat' }
  },
  {
    id: 'char_robot',
    name: 'Autonomous Automaton',
    category: 'characters',
    subcategory: 'Mecha Operators',
    archetype: 'robot',
    tags: ['robot', 'automaton', 'mech', 'chassis', 'cybernetic', 'ai'],
    promptTpl: 'Precision industrial bipedal robot with matte titanium plating, glowing blue optical scanning sensors',
    visualTrait: { ageGroup: 'adult', headShape: 'square', hairStyle: 'shaved', outfit: 'armor', specialType: 'robot' }
  },
  {
    id: 'char_android',
    name: 'Synthetic Android',
    category: 'characters',
    subcategory: 'Cyberpunk Hackers',
    archetype: 'android',
    tags: ['android', 'synth', 'cyborg', 'humanoid', 'ai', 'sleek'],
    promptTpl: 'Lifelike synthetic android human with glowing hairline seam and fiber optic micro-wiring visible on neck',
    visualTrait: { ageGroup: 'young-adult', headShape: 'oval', hairStyle: 'straight', outfit: 'cyber', specialType: 'android' }
  },
  {
    id: 'char_alien',
    name: 'Extraterrestrial Envoy',
    category: 'characters',
    subcategory: 'Sci-Fi Pilots',
    archetype: 'alien',
    tags: ['alien', 'extraterrestrial', 'galaxy', 'sci-fi', 'otherworldly'],
    promptTpl: 'Graceful otherworldly alien diplomat with smooth cerulean skin, large luminous amber eyes and cranial crest',
    visualTrait: { ageGroup: 'adult', headShape: 'heart', hairStyle: 'shaved', outfit: 'robes', specialType: 'alien' }
  },
  {
    id: 'char_monster',
    name: 'Shadow Chimera Beast',
    category: 'characters',
    subcategory: 'Villains & Anti-Heroes',
    archetype: 'monster',
    tags: ['monster', 'beast', 'claws', 'horns', 'dark', 'intimidating'],
    promptTpl: 'Formidable mythical monster silhouette with curved horned mantle, sharp fangs, and smoldering eyes',
    visualTrait: { ageGroup: 'adult', headShape: 'wide', hairStyle: 'messy', outfit: 'armor', specialType: 'monster' }
  },
  {
    id: 'char_creature',
    name: 'Mythic Sprite Creature',
    category: 'characters',
    subcategory: 'Chibi Companions',
    archetype: 'creature',
    tags: ['creature', 'mythic', 'familiar', 'spirit', 'glowing'],
    promptTpl: 'Ethereal forest spirit creature with translucent butterfly-like antennae, glowing starlight body',
    visualTrait: { ageGroup: 'child', headShape: 'round', hairStyle: 'wavy', outfit: 'casual', specialType: 'creature' }
  },
  {
    id: 'char_cartoon_mascot',
    name: 'Bubbly Mascot',
    category: 'characters',
    subcategory: 'Chibi Companions',
    archetype: 'cartoon-mascot',
    tags: ['mascot', 'cartoon', 'cute', 'chibi', 'happy', 'companion'],
    promptTpl: 'Cute round animated mascot creature with huge sparkling emotive eyes, stubby arms and cheerful blush',
    visualTrait: { ageGroup: 'child', headShape: 'round', hairStyle: 'short', outfit: 'casual', specialType: 'mascot' }
  },
  {
    id: 'char_animal_character',
    name: 'Anthropomorphic Fox',
    category: 'characters',
    subcategory: 'Chibi Companions',
    archetype: 'animal-character',
    tags: ['animal', 'fox', 'anthro', 'cute', 'furry', 'adventurer'],
    promptTpl: 'Anthropomorphic red fox adventurer in aviator jacket with goggles pushed up onto fluffy pointed ears',
    visualTrait: { ageGroup: 'young-adult', headShape: 'heart', hairStyle: 'messy', outfit: 'casual', specialType: 'animal' }
  },
  {
    id: 'char_educational_presenter',
    name: 'EdTech Host',
    category: 'characters',
    subcategory: 'Education & Academics',
    archetype: 'educational-presenter',
    tags: ['presenter', 'host', 'education', 'lecture', 'interactive', 'stage'],
    promptTpl: 'Engaging educational video host in smart casual blazer, holding digital stylus next to virtual screen',
    visualTrait: { ageGroup: 'young-adult', headShape: 'oval', hairStyle: 'short', outfit: 'suit', accessory: 'tablet' }
  },
  {
    id: 'char_indian_saree',
    name: 'Classical Saree Elegance',
    category: 'characters',
    subcategory: 'Everyday People',
    archetype: 'indian-saree',
    tags: ['indian', 'saree', 'traditional', 'zari', 'bindi', 'heritage'],
    promptTpl: 'Graceful Indian woman in rich silk saree with gold zari border, neat hair bun with jasmine flowers and delicate bindi',
    visualTrait: { ageGroup: 'adult', headShape: 'oval', hairStyle: 'bun', outfit: 'saree', accessory: 'none' }
  },
  {
    id: 'char_indian_kurta',
    name: 'Nehru Kurta Dignitary',
    category: 'characters',
    subcategory: 'Everyday People',
    archetype: 'indian-kurta',
    tags: ['indian', 'kurta', 'nehru-jacket', 'traditional', 'formal', 'heritage'],
    promptTpl: 'Dignified Indian gentleman in tailored Nehru waistcoat over crisp white cotton kurta, composed posture',
    visualTrait: { ageGroup: 'middle-aged', headShape: 'square', hairStyle: 'formal', outfit: 'kurta', accessory: 'glasses' }
  }
];

// -----------------------------------------------------------------------------
// 2. BACKGROUND / ENVIRONMENT FAMILIES (66 Distinct Environment Families)
// -----------------------------------------------------------------------------
export const BACKGROUND_FAMILIES: AssetFamilyDefinition[] = [
  // EDUCATION (8)
  {
    id: 'bg_classroom',
    name: 'Modern Classroom',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'classroom',
    tags: ['classroom', 'school', 'desks', 'blackboard', 'education', 'sunlight'],
    promptTpl: 'Spacious school classroom with wooden desks, large windows casting morning sunbeams, green chalkboard',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_computer_lab',
    name: 'High-Tech Computer Lab',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'computer-lab',
    tags: ['computer-lab', 'screens', 'technology', 'keyboards', 'it', 'school'],
    promptTpl: 'Clean educational computer lab with dual monitor workstations, neat cable runs and LED lighting',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_science_lab',
    name: 'Chemistry Science Lab',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'science-lab',
    tags: ['lab', 'science', 'flasks', 'chemistry', 'beakers', 'tables'],
    promptTpl: 'High school chemistry laboratory with stone countertops, glassware beakers, faucets and safety chart',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_school_corridor',
    name: 'School Corridor Hallway',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'school-corridor',
    tags: ['corridor', 'lockers', 'hallway', 'school', 'perspective'],
    promptTpl: 'Long polished school hallway lined with student lockers and bulletin boards receding into perspective',
    cameraPreset: 'zoom-out'
  },
  {
    id: 'bg_library',
    name: 'Grand Library Reading Room',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'library',
    tags: ['library', 'books', 'shelves', 'quiet', 'study', 'wood'],
    promptTpl: 'Peaceful library study hall with floor-to-ceiling wooden bookshelves, green banker lamps on long oak desks',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_school_playground',
    name: 'School Playground & Field',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'school-playground',
    tags: ['playground', 'field', 'track', 'outdoor', 'school', 'sports'],
    promptTpl: 'Vibrant outdoor school sports field with red running track, soccer goalposts and blue sky with cumulus clouds',
    cameraPreset: 'orbit'
  },
  {
    id: 'bg_auditorium',
    name: 'School Assembly Auditorium',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'auditorium',
    tags: ['auditorium', 'stage', 'seats', 'theater', 'spotlight'],
    promptTpl: 'Grand tiered auditorium with rows of velvet cushioned seating looking toward illuminated wooden stage',
    cameraPreset: 'dolly-zoom'
  },
  {
    id: 'bg_teachers_office',
    name: 'Faculty Staff Room',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'teachers-office',
    tags: ['office', 'staff-room', 'teachers', 'desks', 'papers'],
    promptTpl: 'Warm school faculty staffroom with teacher desks piled with graded notebooks, tea mugs, and schedule boards',
    cameraPreset: 'pan-right'
  },

  // HOME (7)
  {
    id: 'bg_bedroom',
    name: 'Cozy Anime Bedroom',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'bedroom',
    tags: ['bedroom', 'cozy', 'bed', 'desk', 'posters', 'evening'],
    promptTpl: 'Cozy student bedroom with tidy bed, bedside lamp, desk laptop, manga posters, twilight window',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_living_room',
    name: 'Warm Family Living Room',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'living-room',
    tags: ['living-room', 'sofa', 'tv', 'rug', 'home', 'family'],
    promptTpl: 'Inviting home living room with comfortable fabric sofa, woven area rug, coffee table, house plants',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_kitchen',
    name: 'Modern Home Kitchen',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'kitchen',
    tags: ['kitchen', 'cooking', 'counter', 'appliances', 'home'],
    promptTpl: 'Bright tidy home kitchen with polished tile backsplash, wooden breakfast counter, hanging copper pans',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_hallway',
    name: 'Apartment Hallway',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'hallway',
    tags: ['hallway', 'entryway', 'doors', 'apartment', 'shoes'],
    promptTpl: 'Apartment entry corridor with wooden shoe rack, framed landscape art, warm overhead pendant light',
    cameraPreset: 'zoom-out'
  },
  {
    id: 'bg_balcony',
    name: 'Sunset Rooftop Balcony',
    category: 'backgrounds',
    subcategory: 'Sunset Horizons',
    archetype: 'balcony',
    tags: ['balcony', 'sunset', 'cityview', 'plants', 'railing'],
    promptTpl: 'Apartment balcony with wrought iron railing, potted succulents, golden hour skyline view in distance',
    cameraPreset: 'orbit'
  },
  {
    id: 'bg_rooftop',
    name: 'High School Rooftop',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'rooftop',
    tags: ['rooftop', 'fence', 'anime', 'sky', 'wind', 'clouds'],
    promptTpl: 'Iconic anime school rooftop enclosed with chainlink fence under vast open azure sky with drifting clouds',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_study_room',
    name: 'Lo-Fi Study Nook',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'study-room',
    tags: ['study', 'lofi', 'desk', 'turntable', 'rain', 'night'],
    promptTpl: 'Peaceful rainy night study desk with warm gooseneck lamp, vinyl record player, stack of classic books',
    cameraPreset: 'zoom-in'
  },

  // CITY & URBAN (11)
  {
    id: 'bg_city_street',
    name: 'Sunlit Urban Street',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'city-street',
    tags: ['city', 'street', 'crosswalk', 'buildings', 'urban', 'pedestrian'],
    promptTpl: 'Bustling clean downtown city crosswalk with tree-lined sidewalks, storefront awnings, traffic signals',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_market',
    name: 'Vibrant City Market',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'market',
    tags: ['market', 'stalls', 'fruits', 'vendors', 'crowd', 'colorful'],
    promptTpl: 'Lively open-air street market with colorful canvas canopies, stacked wooden produce crates, paper lanterns',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_metro_station',
    name: 'Subway Metro Platform',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'metro-station',
    tags: ['metro', 'subway', 'train', 'platform', 'tracks', 'commute'],
    promptTpl: 'Underground transit railway platform with tactile yellow edge tiles, digital arrival board, arriving train',
    cameraPreset: 'zoom-out'
  },
  {
    id: 'bg_bus_stop',
    name: 'Rainy Bus Stop Shelter',
    category: 'backgrounds',
    subcategory: 'Sunset Horizons',
    archetype: 'bus-stop',
    tags: ['bus-stop', 'shelter', 'rain', 'bench', 'nostalgia'],
    promptTpl: 'Glass commuter bus shelter on suburban street corner, raindrops on glass panes, autumn leaves on bench',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_office_interior',
    name: 'Glass Corporate Office',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'office-interior',
    tags: ['office', 'corporate', 'desks', 'skyscrapers', 'modern'],
    promptTpl: 'High-floor modern corporate office floor with open desks, glass partition walls and panoramic city horizon',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_hospital_hallway',
    name: 'Sterile Hospital Corridor',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'hospital-hallway',
    tags: ['hospital', 'corridor', 'medical', 'clean', 'clinic'],
    promptTpl: 'Pristine medical clinic hallway with fluorescent strip lights, handrails, numbered patient room doors',
    cameraPreset: 'zoom-out'
  },
  {
    id: 'bg_police_station',
    name: 'Precinct Police Station',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'police-station',
    tags: ['police', 'station', 'precinct', 'desks', 'detectives'],
    promptTpl: 'Busy detective squad room with metal file cabinets, corkboard pinboard with string, ringing telephones',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_restaurant',
    name: 'Charming Cafe Bistro',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'restaurant',
    tags: ['restaurant', 'cafe', 'bistro', 'dining', 'tables', 'warm'],
    promptTpl: 'Cozy corner cafe with small round bistro tables, chalkboard menu on brick wall, warm Edison bulbs',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_small_shop',
    name: 'Corner Convenience Store',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'small-shop',
    tags: ['shop', 'store', 'konbini', 'aisles', 'snacks', 'lit'],
    promptTpl: 'Late night 24/7 convenience store with brightly lit snack aisles, drink cooler glass doors, cash register',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_dark_alley',
    name: 'Neon Puddle Cyber Alley',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'dark-alley',
    tags: ['alley', 'neon', 'rain', 'puddles', 'cyberpunk', 'cyber'],
    promptTpl: 'Narrow rain-soaked alley between brick highrises with glowing neon signs reflected in shallow water puddles',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_parking_area',
    name: 'Underground Parking Garage',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'parking-area',
    tags: ['parking', 'garage', 'concrete', 'pillars', 'underground'],
    promptTpl: 'Spacious subterranean parking garage with striped concrete pillars, overhead sodium vapor lights',
    cameraPreset: 'zoom-out'
  },

  // NATURE & WILDERNESS (8)
  {
    id: 'bg_forest',
    name: 'Sun-Dappled Forest Path',
    category: 'backgrounds',
    subcategory: 'Nature & Wilderness',
    archetype: 'forest',
    tags: ['forest', 'trees', 'nature', 'path', 'sunlight', 'green'],
    promptTpl: 'Lush verdant woodland trail with ancient oak trees, sunbeams breaking through green canopy, mossy rocks',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_mountain',
    name: 'Snowcapped Mountain Range',
    category: 'backgrounds',
    subcategory: 'Nature & Wilderness',
    archetype: 'mountain',
    tags: ['mountain', 'peaks', 'snow', 'alpine', 'sky', 'majestic'],
    promptTpl: 'Majestic jagged mountain peaks covered in snow against dramatic twilight sky with alpine evergreen slopes',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_river',
    name: 'Rushing Mountain River',
    category: 'backgrounds',
    subcategory: 'Nature & Wilderness',
    archetype: 'river',
    tags: ['river', 'water', 'stream', 'rapids', 'nature', 'stones'],
    promptTpl: 'Clear rushing mountain stream tumbling over smooth river boulders with misty pine trees along banks',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_lake',
    name: 'Serene Mirror Lake',
    category: 'backgrounds',
    subcategory: 'Sunset Horizons',
    archetype: 'lake',
    tags: ['lake', 'water', 'reflection', 'calm', 'peaceful', 'reeds'],
    promptTpl: 'Tranquil glass-like lake reflecting golden sunrise clouds with wooden boat pier and cattail reeds',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_beach',
    name: 'Tropical Ocean Beach',
    category: 'backgrounds',
    subcategory: 'Nature & Wilderness',
    archetype: 'beach',
    tags: ['beach', 'ocean', 'sand', 'waves', 'palms', 'tropical'],
    promptTpl: 'Golden sand coastline with gentle turquoise foam waves breaking ashore, curved coconut palm trees',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_village_field',
    name: 'Golden Wheat Farmland',
    category: 'backgrounds',
    subcategory: 'Nature & Wilderness',
    archetype: 'village-field',
    tags: ['field', 'wheat', 'farm', 'rural', 'harvest', 'sunset'],
    promptTpl: 'Expansive golden wheat field swaying under late afternoon breeze with distant wooden farmhouse',
    cameraPreset: 'orbit'
  },
  {
    id: 'bg_farm_barn',
    name: 'Rustic Country Barn',
    category: 'backgrounds',
    subcategory: 'Nature & Wilderness',
    archetype: 'farm-barn',
    tags: ['barn', 'farm', 'country', 'fence', 'rural'],
    promptTpl: 'Classic weathered red wooden barn with split-rail cedar fence, hay bales and open green pasture',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_desert_dunes',
    name: 'Windswept Desert Dunes',
    category: 'backgrounds',
    subcategory: 'Nature & Wilderness',
    archetype: 'desert-dunes',
    tags: ['desert', 'dunes', 'sand', 'ripples', 'sun', 'vast'],
    promptTpl: 'Endless rolling red sand dunes with sharp wind-carved ridge crests under searing azure desert sky',
    cameraPreset: 'pan-right'
  },

  // HORROR & DARK (8)
  {
    id: 'bg_abandoned_house',
    name: 'Haunted Victorian Manor',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'abandoned-house',
    tags: ['haunted', 'mansion', 'horror', 'fog', 'creepy', 'moon'],
    promptTpl: 'Dilapidated gothic Victorian manor with broken boarded windows, dead creeping ivy, full moon overhead',
    cameraPreset: 'dolly-zoom'
  },
  {
    id: 'bg_haunted_room',
    name: 'Eerie Attic Chamber',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'haunted-room',
    tags: ['haunted', 'room', 'attic', 'dust', 'shadows', 'mystery'],
    promptTpl: 'Shadowy abandoned attic chamber with draped white sheet furniture, cobwebs, moonlight beam through skylight',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_cemetery',
    name: 'Foggy Gothic Cemetery',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'cemetery',
    tags: ['cemetery', 'graveyard', 'tombstones', 'fog', 'cross', 'horror'],
    promptTpl: 'Ancient overgrown cemetery with tilted stone headstones, weeping angel statues in creeping ground fog',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_dark_corridor',
    name: 'Flickering Dark Corridor',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'dark-corridor',
    tags: ['corridor', 'dark', 'flicker', 'shadows', 'tense'],
    promptTpl: 'Narrow derelict corridor with single flickering fluorescent light bulb and deep menacing shadows',
    cameraPreset: 'zoom-out'
  },
  {
    id: 'bg_abandoned_school',
    name: 'Abandoned School Hall',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'abandoned-school',
    tags: ['abandoned', 'school', 'ruins', 'broken', 'decay'],
    promptTpl: 'Silent ruined school classroom with peeling paint, scattered desks, broken glass and moonlight glow',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_foggy_road',
    name: 'Dense Fog Mountain Road',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'foggy-road',
    tags: ['road', 'fog', 'mist', 'asphalt', 'silent-hill'],
    promptTpl: 'Deserted cracked two-lane asphalt highway vanishing into impenetrable white cold morning fog',
    cameraPreset: 'zoom-out'
  },
  {
    id: 'bg_forest_at_night',
    name: 'Twisted Night Woods',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'forest-at-night',
    tags: ['forest', 'night', 'dark', 'branches', 'spooky'],
    promptTpl: 'Gnarled bare tree branches silhouetted against eerie silver moonlight in dense shadowy nocturnal woods',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_old_hospital',
    name: 'Derelict Asylum Ward',
    category: 'backgrounds',
    subcategory: 'Horror & Dark Alleys',
    archetype: 'old-hospital',
    tags: ['hospital', 'asylum', 'decay', 'gurney', 'horror'],
    promptTpl: 'Abandoned hospital ward with rusted wheel gurney, peeling wallpaper, cracked floor tiles in half-light',
    cameraPreset: 'dolly-zoom'
  },

  // FANTASY (7)
  {
    id: 'bg_castle_keep',
    name: 'Grand Medieval Citadel',
    category: 'backgrounds',
    subcategory: 'Floating Fantasy Citadels',
    archetype: 'castle-keep',
    tags: ['castle', 'citadel', 'towers', 'medieval', 'fantasy', 'stone'],
    promptTpl: 'Towering stone fortress castle with crenelated ramparts, flying heraldic banners against mountain backdrop',
    cameraPreset: 'orbit'
  },
  {
    id: 'bg_dungeon_cell',
    name: 'Subterranean Dungeon Vault',
    category: 'backgrounds',
    subcategory: 'Floating Fantasy Citadels',
    archetype: 'dungeon-cell',
    tags: ['dungeon', 'cell', 'chains', 'torch', 'iron-bars'],
    promptTpl: 'Ancient underground dungeon vault with iron cell bars, stone masonry blocks and burning wall torches',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_magical_forest',
    name: 'Bioluminescent Enchanted Glade',
    category: 'backgrounds',
    subcategory: 'Floating Fantasy Citadels',
    archetype: 'magical-forest',
    tags: ['magic', 'forest', 'glowing', 'mushrooms', 'fairy', 'mystic'],
    promptTpl: 'Mystic fairytale glade with glowing violet and teal giant mushrooms, floating stardust motes',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_ancient_temple',
    name: 'Forgotten Jungle Temple',
    category: 'backgrounds',
    subcategory: 'Ancient Temples & Shrines',
    archetype: 'ancient-temple',
    tags: ['temple', 'ancient', 'ruins', 'jungle', 'stone', 'carvings'],
    promptTpl: 'Massive weathered stone temple pyramid overgrown with tropical vines and carved relief statues',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_throne_room',
    name: 'Imperial Throne Hall',
    category: 'backgrounds',
    subcategory: 'Floating Fantasy Citadels',
    archetype: 'throne-room',
    tags: ['throne', 'palace', 'royal', 'hall', 'gold', 'columns'],
    promptTpl: 'Cathedral-scale palace throne hall with marble columns, red velvet carpet runner leading to golden throne',
    cameraPreset: 'dolly-zoom'
  },
  {
    id: 'bg_medieval_village',
    name: 'Cobblestone Fantasy Hamlet',
    category: 'backgrounds',
    subcategory: 'Floating Fantasy Citadels',
    archetype: 'medieval-village',
    tags: ['village', 'medieval', 'timber', 'cobblestone', 'tavern'],
    promptTpl: 'Charming medieval hamlet square with timber-framed half-timbered houses, water well, tavern sign',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_fantasy_battlefield',
    name: 'Epic Mythic Battlefield',
    category: 'backgrounds',
    subcategory: 'Floating Fantasy Citadels',
    archetype: 'fantasy-battlefield',
    tags: ['battlefield', 'swords', 'smoke', 'epic', 'war'],
    promptTpl: 'Expansive war-torn plain with broken swords embedded in earth, smoldering banners under stormy twilight sky',
    cameraPreset: 'orbit'
  },

  // SCI-FI (7)
  {
    id: 'bg_spaceship_bridge',
    name: 'Cruiser Command Bridge',
    category: 'backgrounds',
    subcategory: 'Deep Space Vessels',
    archetype: 'spaceship-bridge',
    tags: ['spaceship', 'bridge', 'cockpit', 'stars', 'hologram', 'scifi'],
    promptTpl: 'Starship command deck with panoramic armored glass showing glowing planetary nebula and star systems',
    cameraPreset: 'dolly-zoom'
  },
  {
    id: 'bg_command_center',
    name: 'Planetary Tactical OPS',
    category: 'backgrounds',
    subcategory: 'Deep Space Vessels',
    archetype: 'command-center',
    tags: ['command', 'ops', 'military', 'screens', 'radar', 'tactical'],
    promptTpl: 'High-security planetary defense operations center with circular holo-table map and multi-screen arrays',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_futuristic_city',
    name: 'Skyline Megastructure Nexus',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'futuristic-city',
    tags: ['futuristic', 'megacity', 'skyline', 'aerocars', 'towers'],
    promptTpl: 'Soaring hyper-dense metropolis with multi-level skybridges, soaring crystal spires and aerial traffic lanes',
    cameraPreset: 'orbit'
  },
  {
    id: 'bg_cyberpunk_street',
    name: 'Neo Shinjuku Wet Alley',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'cyberpunk-street',
    tags: ['cyberpunk', 'neon', 'kanji', 'hologram', 'rain', 'tokyo'],
    promptTpl: 'Densely layered cyberpunk commercial street with holographic ads, overhead cable webs, neon kanji signs',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_underground_facility',
    name: 'Subterranean Bunker Vault',
    category: 'backgrounds',
    subcategory: 'Deep Space Vessels',
    archetype: 'underground-facility',
    tags: ['bunker', 'facility', 'blast-doors', 'pipes', 'industrial'],
    promptTpl: 'Reinforced concrete underground testing bunker with massive hydraulic blast door and yellow hazard floor stripes',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_space_station_dock',
    name: 'Orbital Station Hangar Bay',
    category: 'backgrounds',
    subcategory: 'Deep Space Vessels',
    archetype: 'space-station-dock',
    tags: ['hangar', 'station', 'shuttle', 'dock', 'space', 'forcefield'],
    promptTpl: 'Cavernous starbase docking hangar with blue magnetic atmospheric containment field overlooking Earth orbit',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_quantum_lab',
    name: 'Antimatter Quantum Core',
    category: 'backgrounds',
    subcategory: 'Deep Space Vessels',
    archetype: 'quantum-lab',
    tags: ['quantum', 'core', 'energy', 'collider', 'reactor'],
    promptTpl: 'High energy particle physics laboratory with cylindrical superconducting fusion containment chamber',
    cameraPreset: 'dolly-zoom'
  },

  // INDIAN SETTINGS (10)
  {
    id: 'bg_indian_classroom',
    name: 'Indian Secondary Classroom',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'indian-classroom',
    tags: ['indian', 'classroom', 'school', 'blackboard', 'desks', 'ceiling-fan'],
    promptTpl: 'Authentic Indian school classroom with green chalkboard, wooden benches, three-blade ceiling fans, sunlit window',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_government_school',
    name: 'Government School Verandah',
    category: 'backgrounds',
    subcategory: 'Anime High School & Suburbs',
    archetype: 'government-school',
    tags: ['government-school', 'verandah', 'courtyard', 'pillars', 'brick'],
    promptTpl: 'Traditional Indian government school verandah with terracotta tiled roof, whitewashed pillars, open courtyard',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_railway_station',
    name: 'Indian Railway Junction',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'railway-station',
    tags: ['railway', 'station', 'train', 'platform', 'tracks', 'clock'],
    promptTpl: 'Iconic Indian railway platform with overhead pedestrian footbridge, round vintage clock, chai stall, blue train cars',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_indian_market',
    name: 'Vibrant Indian Bazaar',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'indian-market',
    tags: ['bazaar', 'market', 'spices', 'marigold', 'textiles', 'colorful'],
    promptTpl: 'Lively bustling Indian market lane with mounds of vibrant turmeric and chili powder, marigold flower garlands',
    cameraPreset: 'orbit'
  },
  {
    id: 'bg_village_courtyard',
    name: 'Rural Village Aangan',
    category: 'backgrounds',
    subcategory: 'Nature & Wilderness',
    archetype: 'village-courtyard',
    tags: ['village', 'aangan', 'courtyard', 'charpai', 'tree', 'mud-house'],
    promptTpl: 'Traditional rural courtyard with sacred tulsi plant pedestal, woven charpai cot beneath spreading neem tree shade',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_delhi_street',
    name: 'Old Delhi Heritage Lane',
    category: 'backgrounds',
    subcategory: 'Neo-Tokyo Cyberpunk',
    archetype: 'delhi-street',
    tags: ['delhi', 'old-city', 'heritage', 'balconies', 'rickshaw', 'wires'],
    promptTpl: 'Atmospheric Old Delhi historic street with ornate jharokha overhanging balconies, web of overhead cables, auto-rickshaw',
    cameraPreset: 'pan-left'
  },
  {
    id: 'bg_apartment_balcony',
    name: 'Metro City Apartment Balcony',
    category: 'backgrounds',
    subcategory: 'Sunset Horizons',
    archetype: 'apartment-balcony',
    tags: ['balcony', 'apartment', 'city', 'clothesline', 'sunset'],
    promptTpl: 'High-rise Indian apartment balcony with steel grill railing, potted tulsi and money plants, evening city horizon',
    cameraPreset: 'zoom-in'
  },
  {
    id: 'bg_temple_exterior',
    name: 'Ornate Temple Courtyard',
    category: 'backgrounds',
    subcategory: 'Ancient Temples & Shrines',
    archetype: 'temple-exterior',
    tags: ['temple', 'mandir', 'stone', 'shikhara', 'carvings', 'bells'],
    promptTpl: 'Sacred stone temple courtyard with intricately carved sandstone shikhara spire, hanging brass bells, stone flagstones',
    cameraPreset: 'orbit'
  },
  {
    id: 'bg_kirana_shop',
    name: 'Small-Town Kirana Store',
    category: 'backgrounds',
    subcategory: 'Cozy Lofi Interiors',
    archetype: 'kirana-shop',
    tags: ['kirana', 'shop', 'groceries', 'shelves', 'jars', 'counter'],
    promptTpl: 'Authentic Indian neighborhood kirana general store with glass candy jars, hanging snack packets, wooden counter',
    cameraPreset: 'pan-right'
  },
  {
    id: 'bg_bus_stand',
    name: 'Town State Bus Stand',
    category: 'backgrounds',
    subcategory: 'Sunset Horizons',
    archetype: 'bus-stand',
    tags: ['bus-stand', 'transport', 'depot', 'red-bus', 'commuters'],
    promptTpl: 'Town transport bus depot with parked red and silver state transport buses, passenger shelter under afternoon sun',
    cameraPreset: 'pan-left'
  }
];

// -----------------------------------------------------------------------------
// 3. POSE FAMILIES (30 Distinct Anatomical Pose Families)
// -----------------------------------------------------------------------------
export const POSE_FAMILIES: AssetFamilyDefinition[] = [
  { id: 'pose_standing_neutral', name: 'Standing Neutral Pose', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'standing-neutral', tags: ['standing', 'neutral', 'relaxed', 'front'], promptTpl: 'Full-body front facing neutral standing pose with balanced weight distribution' },
  { id: 'pose_walking', name: 'Walking Forward Stride', category: 'poses', subcategory: 'Locomotion & Parkour', archetype: 'walking', tags: ['walking', 'stride', 'locomotion', 'natural'], promptTpl: 'Natural walking stride with arm swing and fluid weight transfer' },
  { id: 'pose_running', name: 'Athletic Sprint Stride', category: 'poses', subcategory: 'Locomotion & Parkour', archetype: 'running', tags: ['running', 'sprint', 'fast', 'action'], promptTpl: 'High-speed athletic sprint pose with forward body tilt and bent knee drive' },
  { id: 'pose_sitting', name: 'Sitting on Chair', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'sitting', tags: ['sitting', 'chair', 'desk', 'rest'], promptTpl: 'Relaxed seated pose on office chair with upright ergonomic posture' },
  { id: 'pose_pointing', name: 'Authoritative Pointing', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'pointing', tags: ['pointing', 'directing', 'arm-extended', 'gesture'], promptTpl: 'Decisive one-arm forward pointing gesture directing attention to camera' },
  { id: 'pose_waving', name: 'Friendly High Wave', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'waving', tags: ['waving', 'greeting', 'hello', 'friendly'], promptTpl: 'Warm friendly overhead waving gesture with open palm and welcoming smile' },
  { id: 'pose_talking', name: 'Conversational Speaking', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'talking', tags: ['talking', 'dialogue', 'speaking', 'hands'], promptTpl: 'Active dialogue pose with natural expressive hand gesture illustrating point' },
  { id: 'pose_explaining', name: 'Teaching Explanation', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'explaining', tags: ['explaining', 'lecture', 'presentation', 'teacher'], promptTpl: 'Educational presenter pose with both palms open outward explaining concept' },
  { id: 'pose_thinking', name: 'Deep Thinking Chin Pose', category: 'poses', subcategory: 'Dramatic Emotion', archetype: 'thinking', tags: ['thinking', 'pondering', 'contemplative', 'hand-on-chin'], promptTpl: 'Contemplative thinking pose with index finger and thumb resting on chin' },
  { id: 'pose_reading', name: 'Reading Book / Tablet', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'reading', tags: ['reading', 'book', 'tablet', 'study'], promptTpl: 'Character engrossed in reading open hardcover book held in both hands' },
  { id: 'pose_writing', name: 'Desk Writing Posture', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'writing', tags: ['writing', 'pen', 'notebook', 'notes'], promptTpl: 'Character focused on writing with pen onto notebook on desk surface' },
  { id: 'pose_typing', name: 'Computer Keyboard Typing', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'typing', tags: ['typing', 'keyboard', 'laptop', 'coding'], promptTpl: 'Ergonomic typing posture with fingers arched over laptop keyboard' },
  { id: 'pose_holding_object', name: 'Holding Prop in Hands', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'holding-object', tags: ['holding', 'prop', 'two-hands', 'carry'], promptTpl: 'Character carefully holding rectangular tablet or box forward with both hands' },
  { id: 'pose_looking_left', name: 'Three-Quarter Turn Left', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'looking-left', tags: ['looking-left', 'profile', 'head-turn'], promptTpl: 'Dynamic three-quarter head turn looking leftward with watchful gaze' },
  { id: 'pose_looking_right', name: 'Three-Quarter Turn Right', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'looking-right', tags: ['looking-right', 'profile', 'head-turn'], promptTpl: 'Dynamic three-quarter head turn looking rightward toward focal subject' },
  { id: 'pose_looking_up', name: 'Gazing Skyward', category: 'poses', subcategory: 'Dramatic Emotion', archetype: 'looking-up', tags: ['looking-up', 'skyward', 'wonder', 'hope'], promptTpl: 'Uplifting dramatic pose with head tilted upward gazing toward the sky' },
  { id: 'pose_looking_down', name: 'Introspective Downward Glance', category: 'poses', subcategory: 'Dramatic Emotion', archetype: 'looking-down', tags: ['looking-down', 'sad', 'pensive', 'floor'], promptTpl: 'Subdued emotional pose with bowed head looking downward thoughtfully' },
  { id: 'pose_surprised_jump', name: 'Surprised Startle Jump', category: 'poses', subcategory: 'Dramatic Emotion', archetype: 'surprised-jump', tags: ['surprised', 'startle', 'jump', 'gasp'], promptTpl: 'Comedic startle reaction with elbows pulled inward and both feet off ground' },
  { id: 'pose_scared_cower', name: 'Defensive Scared Cower', category: 'poses', subcategory: 'Dramatic Emotion', archetype: 'scared-cower', tags: ['scared', 'cower', 'fear', 'defensive'], promptTpl: 'Frightened defensive cowering pose with hands raised protecting face' },
  { id: 'pose_angry_stance', name: 'Confrontational Angry Stance', category: 'poses', subcategory: 'Dramatic Emotion', archetype: 'angry-stance', tags: ['angry', 'fists', 'furious', 'aggressive'], promptTpl: 'Intense confrontational battle stance with clenched fists at sides and wide feet' },
  { id: 'pose_happy_cheer', name: 'Triumphant Victory Cheer', category: 'poses', subcategory: 'Heroic & Cinematic Stunts', archetype: 'happy-cheer', tags: ['cheer', 'victory', 'arms-raised', 'success'], promptTpl: 'Celebratory triumph pose with both arms raised high in triumphant V shape' },
  { id: 'pose_laughing_leaning', name: 'Hearty Laugh Leaning Back', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'laughing-leaning', tags: ['laughing', 'joy', 'humor', 'amused'], promptTpl: 'Hearty joyful posture leaning slightly backward with one hand on belly' },
  { id: 'pose_confused_shrug', name: 'Perplexed Shoulder Shrug', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'confused-shrug', tags: ['shrug', 'confused', 'puzzled', 'clueless'], promptTpl: 'Perplexed body language with elevated shoulders and palms turned up in question' },
  { id: 'pose_tired_slump', name: 'Exhausted Slump Posture', category: 'poses', subcategory: 'Dramatic Emotion', archetype: 'tired-slump', tags: ['tired', 'exhausted', 'slump', 'fatigue'], promptTpl: 'Fatigued slump with rounded drooping shoulders and limp hanging arms' },
  { id: 'pose_presenting_stage', name: 'Stage Host Presentation', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'presenting-stage', tags: ['presenting', 'host', 'stage', 'showcase'], promptTpl: 'Charismatic theatrical presentation pose showcasing subject with sweeping arm' },
  { id: 'pose_teaching_pointer', name: 'Instructor with Pointer', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'teaching-pointer', tags: ['teaching', 'pointer', 'chalkboard', 'lesson'], promptTpl: 'Instructor holding pointer stick angled upward toward presentation board' },
  { id: 'pose_working_hands', name: 'Craftsman Working Hands', category: 'poses', subcategory: 'Casual & Conversational', archetype: 'working-hands', tags: ['working', 'crafting', 'hands-on', 'focus'], promptTpl: 'Focused artisan working posture with sleeves rolled up, manipulating tool on table' },
  { id: 'pose_martial_arts_fight', name: 'Dynamic Martial Arts Stance', category: 'poses', subcategory: 'Combat & Martial Arts', archetype: 'martial-arts-fight', tags: ['martial-arts', 'fight', 'karate', 'guard'], promptTpl: 'Low center-of-gravity martial arts stance with lead palm guard and rear fist' },
  { id: 'pose_airborne_jump', name: 'Dynamic Airborne Leap', category: 'poses', subcategory: 'Heroic & Cinematic Stunts', archetype: 'airborne-jump', tags: ['jump', 'leap', 'airborne', 'action'], promptTpl: 'Dynamic mid-air parkour leap with one knee tucked high and flowing motion lines' },
  { id: 'pose_crouching_stealth', name: 'Stealth Shadow Crouch', category: 'poses', subcategory: 'Combat & Martial Arts', archetype: 'crouching-stealth', tags: ['crouch', 'stealth', 'infiltrate', 'low'], promptTpl: 'Low three-point ground touch stealth crouch ready to spring into action' }
];

// -----------------------------------------------------------------------------
// 4. EXPRESSION FAMILIES (22 Distinct Expression & Viseme Families)
// -----------------------------------------------------------------------------
export const EXPRESSION_FAMILIES: AssetFamilyDefinition[] = [
  { id: 'exp_neutral', name: 'Neutral Composure', category: 'expressions', subcategory: 'Subtle Micro-Expressions', archetype: 'neutral', tags: ['neutral', 'calm', 'focus', 'composed'], promptTpl: 'Relaxed neutral facial expression with steady eyes and resting mouth line' },
  { id: 'exp_happy_smile', name: 'Authentic Gentle Smile', category: 'expressions', subcategory: 'Emotional Drama', archetype: 'happy-smile', tags: ['happy', 'smile', 'warm', 'joy'], promptTpl: 'Gentle crinkled eyes and soft authentic warm smile with glowing expression' },
  { id: 'exp_sad_tearful', name: 'Heartbroken Sadness', category: 'expressions', subcategory: 'Emotional Drama', archetype: 'sad-tearful', tags: ['sad', 'tears', 'heartbroken', 'sorrow'], promptTpl: 'Melancholy sad face with downturned mouth corners, watery glistening eyes' },
  { id: 'exp_angry_scowl', name: 'Fierce Angry Scowl', category: 'expressions', subcategory: 'Intense Battle Tension', archetype: 'angry-scowl', tags: ['angry', 'scowl', 'furious', 'wrath'], promptTpl: 'Intense fierce frown with sharply angled V eyebrows and clenched jaw' },
  { id: 'exp_fear_wide_eyed', name: 'Paralyzing Dread & Fear', category: 'expressions', subcategory: 'Emotional Drama', archetype: 'fear-wide-eyed', tags: ['fear', 'scared', 'dread', 'terror'], promptTpl: 'Terrified expression with wide pupils, pulled-back pale lips, visible tension' },
  { id: 'exp_surprise_gasp', name: 'Jaw-Dropping Surprise Gasp', category: 'expressions', subcategory: 'Comedy & Chibi Takes', archetype: 'surprise-gasp', tags: ['surprise', 'gasp', 'shock', 'astonished'], promptTpl: 'Wide open rounded mouth gasp and arched high eyebrows in astonishment' },
  { id: 'exp_confused_frown', name: 'Baffled Puzzled Frown', category: 'expressions', subcategory: 'Subtle Micro-Expressions', archetype: 'confused-frown', tags: ['confused', 'puzzled', 'doubt', 'perplexed'], promptTpl: 'One raised eyebrow and slightly tilted mouth conveying genuine confusion' },
  { id: 'exp_disgust_sneer', name: 'Distasteful Repulsed Sneer', category: 'expressions', subcategory: 'Emotional Drama', archetype: 'disgust-sneer', tags: ['disgust', 'sneer', 'repulsed', 'distaste'], promptTpl: 'Wrinkled bridge of nose and curled upper lip in visceral distaste' },
  { id: 'exp_confident_smirk', name: 'Playful Confident Smirk', category: 'expressions', subcategory: 'Comedy & Chibi Takes', archetype: 'confident-smirk', tags: ['smirk', 'confident', 'sly', 'playful'], promptTpl: 'Playful one-sided smirk with knowing glint in narrowed eye' },
  { id: 'exp_laughing_joy', name: 'Uncontrollable Laughing Joy', category: 'expressions', subcategory: 'Comedy & Chibi Takes', archetype: 'laughing-joy', tags: ['laughing', 'joy', 'hilarious', 'giggle'], promptTpl: 'Wide laughing open mouth showing teeth, joyful squinted eyes with tear of mirth' },
  { id: 'exp_crying_weeping', name: 'Streaming Tears Weeping', category: 'expressions', subcategory: 'Emotional Drama', archetype: 'crying-weeping', tags: ['crying', 'weeping', 'tears', 'grief'], promptTpl: 'Emotional weeping expression with continuous flowing anime tears down cheeks' },
  { id: 'exp_worried_anxious', name: 'Anxious Biting Lip', category: 'expressions', subcategory: 'Subtle Micro-Expressions', archetype: 'worried-anxious', tags: ['worried', 'anxious', 'nervous', 'sweatdrop'], promptTpl: 'Worried furrowed brow with small sweat drop and teeth pressing onto lower lip' },
  { id: 'exp_excited_sparkle', name: 'Starry-Eyed Excited Wonder', category: 'expressions', subcategory: 'Comedy & Chibi Takes', archetype: 'excited-sparkle', tags: ['excited', 'sparkle', 'wonder', 'thrilled'], promptTpl: 'Luminous sparkle star-shaped highlights in wide anime eyes, beaming broad smile' },
  { id: 'exp_sleepy_yawn', name: 'Drowsy Sleepy Yawn', category: 'expressions', subcategory: 'Comedy & Chibi Takes', archetype: 'sleepy-yawn', tags: ['sleepy', 'yawn', 'tired', 'drowsy'], promptTpl: 'Sleepy droopy eyelids and wide yawning mouth with small bubble' },
  { id: 'exp_deep_thinking', name: 'Calculating Deep Thinking', category: 'expressions', subcategory: 'Subtle Micro-Expressions', archetype: 'deep-thinking', tags: ['thinking', 'calculating', 'focus', 'analytical'], promptTpl: 'Piercing analytical gaze with squinted eyes, compressed thoughtful lips' },
  { id: 'exp_shocked_freeze', name: 'Stunned Comedic Shock', category: 'expressions', subcategory: 'Comedy & Chibi Takes', archetype: 'shocked-freeze', tags: ['shocked', 'frozen', 'chibi', 'ghostly'], promptTpl: 'Dramatic comedic shock with tiny dot pupils and pale blue vertical worry lines' },
  { id: 'exp_embarrassed_blush', name: 'Flustered Cherry Blush', category: 'expressions', subcategory: 'Comedy & Chibi Takes', archetype: 'embarrassed-blush', tags: ['blush', 'embarrassed', 'flustered', 'shy'], promptTpl: 'Intense crimson cheek blush with eyes darting away in bashful embarrassment' },
  { id: 'exp_viseme_aa', name: 'Phoneme /AA/ Wide Vowel', category: 'expressions', subcategory: 'Lip-Sync Phonemes / Visemes', archetype: 'viseme-aa', tags: ['lip-sync', 'phoneme', 'aa', 'speaking', 'mouth'], promptTpl: 'Wide vertical open mouth phoneme /AA/ viseme for lip-sync speech animation' },
  { id: 'exp_viseme_ee', name: 'Phoneme /EE/ Stretched Vowel', category: 'expressions', subcategory: 'Lip-Sync Phonemes / Visemes', archetype: 'viseme-ee', tags: ['lip-sync', 'phoneme', 'ee', 'speaking', 'mouth'], promptTpl: 'Horizontal stretched smile mouth phoneme /EE/ viseme showing aligned teeth' },
  { id: 'exp_viseme_oo', name: 'Phoneme /OO/ Circular Pucker', category: 'expressions', subcategory: 'Lip-Sync Phonemes / Visemes', archetype: 'viseme-oo', tags: ['lip-sync', 'phoneme', 'oo', 'speaking', 'mouth'], promptTpl: 'Circular rounded puckered lip opening phoneme /OO/ /W/ viseme' },
  { id: 'exp_viseme_mm', name: 'Phoneme /MM/ Closed Compression', category: 'expressions', subcategory: 'Lip-Sync Phonemes / Visemes', archetype: 'viseme-mm', tags: ['lip-sync', 'phoneme', 'mm', 'speaking', 'mouth'], promptTpl: 'Firmly closed compressed lips phoneme /M/ /B/ /P/ viseme for silence and consonants' },
  { id: 'exp_viseme_ff', name: 'Phoneme /FF-TH/ Dental Contact', category: 'expressions', subcategory: 'Lip-Sync Phonemes / Visemes', archetype: 'viseme-ff', tags: ['lip-sync', 'phoneme', 'ff', 'th', 'speaking', 'mouth'], promptTpl: 'Upper front teeth touching lower lip phoneme /F/ /V/ viseme' }
];

// -----------------------------------------------------------------------------
// 5. PROPS & ANIMAL / CREATURE FAMILIES (45 Distinct Families)
// -----------------------------------------------------------------------------
export const PROP_AND_CREATURE_FAMILIES: AssetFamilyDefinition[] = [
  // EDUCATION & OFFICE PROPS (8)
  { id: 'prop_books_stack', name: 'Scholarly Hardcover Books', category: 'props', subcategory: 'Everyday Objects', archetype: 'books-stack', tags: ['books', 'library', 'study', 'education', 'pages'], promptTpl: 'Neatly stacked leather-bound hardcover books with gilded spine lettering' },
  { id: 'prop_laptop', name: 'Sleek Modern Laptop', category: 'props', subcategory: 'Everyday Objects', archetype: 'laptop', tags: ['laptop', 'computer', 'tech', 'screen', 'keyboard'], promptTpl: 'Open aluminum ultrabook laptop glowing with crisp terminal user interface' },
  { id: 'prop_tablet', name: 'Digital Stylus Tablet', category: 'props', subcategory: 'Everyday Objects', archetype: 'tablet', tags: ['tablet', 'stylus', 'digital-art', 'touchscreen'], promptTpl: 'Thin glass slate tablet displaying active vector art sketch with precision stylus' },
  { id: 'prop_projector', name: 'Classroom HD Projector', category: 'props', subcategory: 'Everyday Objects', archetype: 'projector', tags: ['projector', 'cinema', 'presentation', 'lens'], promptTpl: 'Ceiling mount digital optical projector casting bright focal beam of light' },
  { id: 'prop_school_bag', name: 'Student Canvas Backpack', category: 'props', subcategory: 'Everyday Objects', archetype: 'school-bag', tags: ['backpack', 'bag', 'school', 'canvas', 'zipper'], promptTpl: 'Durable dual-strap canvas school backpack with water bottle mesh pocket and pins' },
  { id: 'prop_chalkboard', name: 'Classroom Chalkboard Stand', category: 'props', subcategory: 'Everyday Objects', archetype: 'chalkboard', tags: ['chalkboard', 'board', 'chalk', 'math', 'school'], promptTpl: 'Dark slate green wooden framed chalkboard filled with white chalk geometry equations' },
  { id: 'prop_microscope', name: 'Precision Lab Microscope', category: 'props', subcategory: 'Sci-Fi & Weapons', archetype: 'microscope', tags: ['microscope', 'lab', 'biology', 'optics', 'lens'], promptTpl: 'Professional dual-eyepiece laboratory optical microscope with specimen slide stage' },
  { id: 'prop_desk_chair', name: 'Ergonomic Mesh Chair', category: 'props', subcategory: 'Everyday Objects', archetype: 'desk-chair', tags: ['chair', 'furniture', 'office', 'ergonomic'], promptTpl: 'Modern adjustable ergonomic mesh task chair on five-star caster wheel base' },

  // PROFESSIONAL & MEDIA PROPS (5)
  { id: 'prop_camera', name: 'Professional DSLR Camera', category: 'props', subcategory: 'Everyday Objects', archetype: 'camera', tags: ['camera', 'dslr', 'lens', 'photography', 'photo'], promptTpl: 'Matte black professional DSLR camera body with large glass f/1.4 zoom lens' },
  { id: 'prop_ribbon_mic', name: 'Vintage Studio Ribbon Mic', category: 'props', subcategory: 'Everyday Objects', archetype: 'ribbon-mic', tags: ['microphone', 'studio', 'vintage', 'audio', 'vocal'], promptTpl: 'Classic chrome art-deco broadcast ribbon microphone mounted on heavy shock mount' },
  { id: 'prop_medical_kit', name: 'First Aid Trauma Kit', category: 'props', subcategory: 'Everyday Objects', archetype: 'medical-kit', tags: ['medical-kit', 'first-aid', 'cross', 'doctor', 'emergency'], promptTpl: 'Reinforced red emergency first-aid kit box with white medical cross emblem' },
  { id: 'prop_toolbox', name: 'Steel Mechanic Toolbox', category: 'props', subcategory: 'Everyday Objects', archetype: 'toolbox', tags: ['toolbox', 'tools', 'wrench', 'metal', 'repair'], promptTpl: 'Heavy-gauge crimson steel mechanic toolbox with tiered trays and chrome latch' },
  { id: 'prop_hard_hat', name: 'Yellow Safety Hardhat', category: 'props', subcategory: 'Everyday Objects', archetype: 'hard-hat', tags: ['hardhat', 'safety', 'helmet', 'construction'], promptTpl: 'Bright industrial high-density polyethylene yellow construction safety helmet' },

  // VEHICLES & TRANSPORT (4)
  { id: 'prop_hoverbike', name: 'Cyberpunk Anti-Grav Hoverbike', category: 'props', subcategory: 'Vehicles & Mounts', archetype: 'hoverbike', tags: ['hoverbike', 'vehicle', 'cyberpunk', 'futuristic', 'thruster'], promptTpl: 'Aerodynamic carbon fiber hover motorcycle with dual glowing cyan ion thruster rings' },
  { id: 'prop_retro_car', name: 'Vintage Sedan Automobile', category: 'props', subcategory: 'Vehicles & Mounts', archetype: 'retro-car', tags: ['car', 'automobile', 'vintage', 'classic', 'wheels'], promptTpl: 'Classic rounded chrome-bumpered vintage four-door sedan under streetlamp' },
  { id: 'prop_highspeed_train', name: 'Bullet Train Locomotive', category: 'props', subcategory: 'Vehicles & Mounts', archetype: 'highspeed-train', tags: ['train', 'bullet-train', 'shinkansen', 'metro', 'speed'], promptTpl: 'Sleek aerodynamic aerodynamic bullet train nose cone speeding past platform' },
  { id: 'prop_space_vessel', name: 'Deep Space Recon Scout', category: 'props', subcategory: 'Vehicles & Mounts', archetype: 'space-vessel', tags: ['spaceship', 'shuttle', 'scout', 'space', 'cockpit'], promptTpl: 'Angular twin-engine deep space exploration scout vessel with solar panel arrays' },

  // FANTASY & COMBAT RELICS (6)
  { id: 'prop_knight_sword', name: 'Gilded Medieval Longsword', category: 'props', subcategory: 'Sci-Fi & Weapons', archetype: 'knight-sword', tags: ['sword', 'blade', 'steel', 'knight', 'weapon'], promptTpl: 'Double-edged forged damascus steel longsword with golden crossguard and pommel' },
  { id: 'prop_heater_shield', name: 'Heraldic Crest Shield', category: 'props', subcategory: 'Sci-Fi & Weapons', archetype: 'heater-shield', tags: ['shield', 'armor', 'defense', 'heraldry', 'crest'], promptTpl: 'Heavy steel heater battle shield bearing bold golden griffin crest emblem' },
  { id: 'prop_sorcerer_staff', name: 'Arcane Starlight Staff', category: 'props', subcategory: 'Magic Relics & Spell FX', archetype: 'sorcerer-staff', tags: ['staff', 'magic', 'crystal', 'arcane', 'mana'], promptTpl: 'Gnarled ash wood sorcerer staff topped with levitating glowing sapphire crystal' },
  { id: 'prop_potion_vial', name: 'Bubbling Health Potion', category: 'props', subcategory: 'Magic Relics & Spell FX', archetype: 'potion-vial', tags: ['potion', 'alchemy', 'flask', 'elixir', 'magic'], promptTpl: 'Glass spherical alchemical flask filled with effervescent glowing crimson elixir' },
  { id: 'prop_magic_grimoire', name: 'Ancient Runic Grimoire', category: 'props', subcategory: 'Magic Relics & Spell FX', archetype: 'magic-grimoire', tags: ['grimoire', 'spellbook', 'runes', 'magic', 'parchment'], promptTpl: 'Heavy tome bound in dragon leather with glowing arcane rune embossing on lock' },
  { id: 'prop_magic_circle', name: 'Concentric Spell Ring FX', category: 'props', subcategory: 'Action Overlays & Speedlines', archetype: 'magic-circle', tags: ['magic-circle', 'spell', 'runes', 'geometry', 'vfx'], promptTpl: 'Intricate glowing concentric geometric arcane spell circle overlay with glyphs' },

  // SCI-FI & VFX (5)
  { id: 'prop_tactical_hud', name: 'Holographic AR Tactical HUD', category: 'props', subcategory: 'Action Overlays & Speedlines', archetype: 'tactical-hud', tags: ['hud', 'hologram', 'ui', 'overlay', 'cyberpunk'], promptTpl: 'Curved translucent cyan AR heads-up display overlay with targeting reticles' },
  { id: 'prop_speed_burst', name: 'Anime Radial Speedburst FX', category: 'props', subcategory: 'Action Overlays & Speedlines', archetype: 'speed-burst', tags: ['speedlines', 'burst', 'action', 'anime', 'impact'], promptTpl: 'High-velocity dynamic radial black-and-white comic action impact speedlines' },
  { id: 'prop_surveillance_drone', name: 'Tactical Quadcopter Drone', category: 'props', subcategory: 'Sci-Fi & Weapons', archetype: 'surveillance-drone', tags: ['drone', 'quadcopter', 'camera', 'surveillance', 'tech'], promptTpl: 'Sleek carbon four-rotor surveillance drone hovering with gimbal 4K camera optic' },
  { id: 'prop_plasma_blade', name: 'Ionized Plasma Katana', category: 'props', subcategory: 'Sci-Fi & Weapons', archetype: 'plasma-blade', tags: ['plasma', 'katana', 'laser', 'blade', 'cyber'], promptTpl: 'High-frequency electric cyan plasma blade humming with crackling energy arcs' },
  { id: 'prop_biometric_scanner', name: 'Handprint Biometric Terminal', category: 'props', subcategory: 'Sci-Fi & Weapons', archetype: 'biometric-scanner', tags: ['scanner', 'biometric', 'handprint', 'security'], promptTpl: 'Illuminated glass scanner terminal displaying active green palmprint scan grid' },

  // ANIMAL & CREATURE FAMILIES (17 Distinct Animal Families)
  { id: 'animal_dog', name: 'Loyal Canine Dog', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-dog', tags: ['animal', 'dog', 'canine', 'golden-retriever', 'pet', 'loyal'], promptTpl: 'Friendly golden retriever dog sitting proudly with wagging tail and red leather collar' },
  { id: 'animal_cat', name: 'Sleek Black Feline Cat', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-cat', tags: ['animal', 'cat', 'feline', 'kitten', 'sleek', 'amber-eyes'], promptTpl: 'Graceful black cat perched with curling tail and piercing luminous green eyes' },
  { id: 'animal_cow', name: 'Gentle Indian Holy Cow', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-cow', tags: ['animal', 'cow', 'bovine', 'cattle', 'horns', 'rural'], promptTpl: 'Gentle white Indian cow with curved horns, peaceful calm eyes and brass neck bell' },
  { id: 'animal_horse', name: 'Galloping Arabian Horse', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-horse', tags: ['animal', 'horse', 'equine', 'stallion', 'gallop', 'mane'], promptTpl: 'Magnificent chestnut Arabian horse rearing on hind legs with flowing silken mane' },
  { id: 'animal_elephant', name: 'Majestic Asian Elephant', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-elephant', tags: ['animal', 'elephant', 'tusks', 'trunk', 'majestic'], promptTpl: 'Grand Asian elephant with curved ivory tusks and raised trunk greeting under canopy' },
  { id: 'animal_tiger', name: 'Bengal Royal Tiger', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-tiger', tags: ['animal', 'tiger', 'feline', 'stripes', 'predator', 'jungle'], promptTpl: 'Powerful royal Bengal tiger prowling through tall grass with bold black stripes' },
  { id: 'animal_lion', name: 'Pride Golden Lion', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-lion', tags: ['animal', 'lion', 'mane', 'king', 'savanna'], promptTpl: 'Regal male lion with full golden mane gazing proudly across sunrise savannah rock' },
  { id: 'animal_monkey', name: 'Playful Langur Monkey', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-monkey', tags: ['animal', 'monkey', 'primate', 'playful', 'branch'], promptTpl: 'Agile gray langur monkey perched playfully on banyan tree branch eating fruit' },
  { id: 'animal_rabbit', name: 'White Meadow Bunny Rabbit', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-rabbit', tags: ['animal', 'rabbit', 'bunny', 'ears', 'cute', 'fluffy'], promptTpl: 'Fluffy white bunny rabbit with tall upright pink ears and twitching nose in clover' },
  { id: 'animal_bird', name: 'Songbird on Flowering Branch', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-bird', tags: ['animal', 'bird', 'sparrow', 'feathers', 'branch', 'sing'], promptTpl: 'Colorful little songbird perched sweetly on blooming cherry blossom branch' },
  { id: 'animal_owl', name: 'Wise Barn Owl', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-owl', tags: ['animal', 'owl', 'nocturnal', 'eyes', 'wise', 'night'], promptTpl: 'Wise nocturnal barn owl with heart-shaped white face and wide solemn golden eyes' },
  { id: 'animal_eagle', name: 'Soaring Mountain Eagle', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-eagle', tags: ['animal', 'eagle', 'wings', 'raptor', 'talons', 'soar'], promptTpl: 'Grand bald eagle with wings spread wide soaring high above alpine canyon winds' },
  { id: 'animal_snake', name: 'Coiling Royal Cobra', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-snake', tags: ['animal', 'snake', 'cobra', 'reptile', 'scales'], promptTpl: 'Coiled royal Indian spectacled cobra with flared hood and glistening scales' },
  { id: 'animal_fox', name: 'Red Bushy Fox', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-fox', tags: ['animal', 'fox', 'red-fox', 'brush', 'clever', 'wild'], promptTpl: 'Cunning red fox with pointed black-tipped ears and thick white-tipped bushy tail' },
  { id: 'animal_deer', name: 'Forest Antler Stag Deer', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-deer', tags: ['animal', 'deer', 'stag', 'antlers', 'forest'], promptTpl: 'Noble woodland stag deer with multi-tined branched antlers standing in morning mist' },
  { id: 'animal_bear', name: 'Grizzly River Bear', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-bear', tags: ['animal', 'bear', 'grizzly', 'mighty', 'fur', 'paws'], promptTpl: 'Massive brown grizzly bear standing on river stone scanning water for leaping salmon' },
  { id: 'animal_wolf', name: 'Howling Midnight Wolf', category: 'props', subcategory: 'Chibi Companions', archetype: 'animal-wolf', tags: ['animal', 'wolf', 'howl', 'moon', 'pack', 'wild'], promptTpl: 'Silver-furred timber wolf perched atop craggy cliff howling at glowing full moon' }
];

// -----------------------------------------------------------------------------
// 6. AUDIO & SOUND FAMILIES (20 Distinct Sound Families)
// -----------------------------------------------------------------------------
export const AUDIO_FAMILIES: AssetFamilyDefinition[] = [
  { id: 'aud_orchestral', name: 'Epic Symphonic Trailer Swell', category: 'audio', subcategory: 'Cinematic Trailers & Hits', archetype: 'audio-orchestral', tags: ['orchestral', 'trailer', 'strings', 'brass', 'cinematic'], promptTpl: 'Rising emotional symphonic orchestral crescendo with brass horns and timpani rolls' },
  { id: 'aud_synthwave', name: 'Neon Synthwave Cyber Drive', category: 'audio', subcategory: 'Background Soundtracks', archetype: 'audio-synthwave', tags: ['synthwave', 'cyberpunk', 'arpeggio', 'synth', 'retro'], promptTpl: 'Propulsive 120 BPM analog synthesizer arpeggio with gated reverb drums and bass' },
  { id: 'aud_lofi_rain', name: 'Lo-Fi Rainy Chill Beats', category: 'audio', subcategory: 'Background Soundtracks', archetype: 'audio-lofi', tags: ['lofi', 'beats', 'chill', 'rain', 'rhodes'], promptTpl: 'Relaxing 75 BPM boom-bap hiphop beat with vinyl crackle and vintage Rhodes piano' },
  { id: 'aud_ambient_wind', name: 'Alpine Ridge Ambient Wind', category: 'audio', subcategory: 'Foley & Ambience', archetype: 'audio-wind', tags: ['wind', 'ambience', 'mountain', 'nature', 'air'], promptTpl: 'Continuous atmospheric howling mountain wind through cold pine forest needles' },
  { id: 'aud_heavy_rain', name: 'Heavy Downpour on Roof', category: 'audio', subcategory: 'Foley & Ambience', archetype: 'audio-rain', tags: ['rain', 'downpour', 'storm', 'water', 'weather'], promptTpl: 'Immersive binaural recording of heavy continuous summer thunderstorm rain on tin roof' },
  { id: 'aud_plasma_laser', name: 'Futuristic Plasma Bolt Laser', category: 'audio', subcategory: 'Action & Combat SFX', archetype: 'audio-laser', tags: ['laser', 'blaster', 'sci-fi', 'pew', 'combat'], promptTpl: 'High frequency energized plasma blaster discharge with ionization decay tail' },
  { id: 'aud_katana_clash', name: 'Steel Katana Sheathe & Clash', category: 'audio', subcategory: 'Action & Combat SFX', archetype: 'audio-sword', tags: ['katana', 'sword', 'clash', 'metal', 'blade'], promptTpl: 'Crisp metallic ring of tempered steel katana blade unsheathing with scabbard click' },
  { id: 'aud_space_engine', name: 'Sub-Warp Ion Thruster Hum', category: 'audio', subcategory: 'Foley & Ambience', archetype: 'audio-engine', tags: ['engine', 'spaceship', 'drone', 'hum', 'sci-fi'], promptTpl: 'Deep resonant low-frequency 60Hz electromagnetic hum of starship reactor core' },
  { id: 'aud_footsteps', name: 'Paced Corridor Footsteps', category: 'audio', subcategory: 'Foley & Ambience', archetype: 'audio-footsteps', tags: ['footsteps', 'walking', 'shoes', 'floor', 'foley'], promptTpl: 'Rhythmic footsteps of leather-soled shoes echoing in hollow hallway' },
  { id: 'aud_creaky_door', name: 'Old Haunted Door Creak', category: 'audio', subcategory: 'Action & Combat SFX', archetype: 'audio-creak', tags: ['creak', 'door', 'wood', 'horror', 'spooky'], promptTpl: 'Slow high-pitched eerie wooden door hinge groaning open into darkness' },
  { id: 'aud_typing', name: 'Mechanical Keyboard Rhythm', category: 'audio', subcategory: 'Interface & UI Sounds', archetype: 'audio-typing', tags: ['typing', 'keyboard', 'clicks', 'tactile', 'foley'], promptTpl: 'Satisfying rhythmic click-clack keystrokes on mechanical blue switch keyboard' },
  { id: 'aud_clock_tick', name: 'Tension Clock Pendulum Tick', category: 'audio', subcategory: 'Interface & UI Sounds', archetype: 'audio-clock', tags: ['clock', 'tick', 'ticking', 'time', 'suspense'], promptTpl: 'Steady suspenseful antique grandfather clock pendulum ticking each second' },
  { id: 'aud_heartbeat', name: 'Accelerating Pulse Heartbeat', category: 'audio', subcategory: 'Cinematic Trailers & Hits', archetype: 'audio-heartbeat', tags: ['heartbeat', 'pulse', 'thump', 'fear', 'tension'], promptTpl: 'Muffled visceral chest heartbeat thumping with escalating tension tempo' },
  { id: 'aud_thunder_crack', name: 'Close Thunder Strike Boom', category: 'audio', subcategory: 'Cinematic Trailers & Hits', archetype: 'audio-thunder', tags: ['thunder', 'lightning', 'storm', 'boom', 'rumble'], promptTpl: 'Instantaneous sharp crack of nearby lightning strike followed by rolling bass rumble' },
  { id: 'aud_applause', name: 'Concert Hall Audience Applause', category: 'audio', subcategory: 'Foley & Ambience', archetype: 'audio-applause', tags: ['applause', 'cheering', 'audience', 'crowd', 'ovation'], promptTpl: 'Full auditorium thunderous standing ovation applause with enthusiastic cheers' },
  { id: 'aud_sub_impact', name: 'Cinematic Sub-Drop Boom', category: 'audio', subcategory: 'Cinematic Trailers & Hits', archetype: 'audio-sub-impact', tags: ['impact', 'sub-drop', 'bass', 'trailer', 'hit'], promptTpl: 'Massive cinematic trailer sub-bass downer impact vibrating chest frequencies' },
  { id: 'aud_magic_chime', name: 'Glittering Fairy Magic Chime', category: 'audio', subcategory: 'Interface & UI Sounds', archetype: 'audio-chime', tags: ['magic', 'chime', 'glitter', 'sparkle', 'bells'], promptTpl: 'Cascading high-register crystal wind chimes with shimmering glitter resonance' },
  { id: 'aud_ui_beep', name: 'Holographic Confirm Beep', category: 'audio', subcategory: 'Interface & UI Sounds', archetype: 'audio-ui-beep', tags: ['beep', 'ui', 'interface', 'click', 'confirm'], promptTpl: 'Crisp pleasant dual-tone electronic confirmation chime for futuristic menu' },
  { id: 'aud_retro_8bit', name: 'Chiptune Game Victory Jingle', category: 'audio', subcategory: 'Background Soundtracks', archetype: 'audio-chiptune', tags: ['8bit', 'chiptune', 'retro', 'arcade', 'square-wave'], promptTpl: 'Nostalgic 8-bit square-wave arcade level-up victory jingle with energetic arp' },
  { id: 'aud_radio_static', name: 'Shortwave Morse Static Hiss', category: 'audio', subcategory: 'Foley & Ambience', archetype: 'audio-static', tags: ['static', 'radio', 'morse', 'transmission', 'glitch'], promptTpl: 'Warm analog shortwave radio dial static with intermittent faint Morse code tones' }
];

// -----------------------------------------------------------------------------
// 7. STYLE FAMILIES (21 Distinct Visual Rendering Model Styles)
// -----------------------------------------------------------------------------
export const STYLE_FAMILIES: AssetFamilyDefinition[] = [
  { id: 'style_2d_cartoon', name: '2D Cartoon Animated', category: 'styles', subcategory: 'Classic Animation Eras', archetype: '2d-cartoon', defaultStyle: 'cartoon', tags: ['cartoon', 'animation', 'bold-lines', 'playful'], promptTpl: 'Classic 2D Saturday morning cartoon style with bold ink outlines and vibrant flats' },
  { id: 'style_flat_vector', name: 'Clean Modern Flat Vector', category: 'styles', subcategory: 'Contemporary Manga/Webtoon', archetype: 'flat-vector', defaultStyle: 'realistic', tags: ['flat', 'vector', 'minimal', 'clean'], promptTpl: 'Contemporary clean flat vector graphic art with precise geometry and geometric palette' },
  { id: 'style_anime_shonen', name: 'Anime Shonen Cinematic', category: 'styles', subcategory: 'Contemporary Manga/Webtoon', archetype: 'anime-shonen', defaultStyle: 'anime', tags: ['anime', 'shonen', 'cinematic', 'dynamic'], promptTpl: 'Cinematic anime keyframe with high-contrast rim lighting and stylized hair geometry' },
  { id: 'style_classic_manga', name: 'Classic Manga Inked', category: 'styles', subcategory: 'Contemporary Manga/Webtoon', archetype: 'classic-manga', defaultStyle: 'comic', tags: ['manga', 'ink', 'screentone', 'black-and-white'], promptTpl: 'Hand-drawn Japanese manga panel aesthetic with heavy crosshatching and screentone dot textures' },
  { id: 'style_comic_book', name: 'American Comic Book Pop', category: 'styles', subcategory: 'Classic Animation Eras', archetype: 'comic-book', defaultStyle: 'comic', tags: ['comic', 'halftone', 'pop-art', 'bold'], promptTpl: 'Bold graphic novel comic aesthetic with visible Ben-Day dots and dramatic dynamic shadows' },
  { id: 'style_korean_manhwa', name: 'Korean Webtoon Manhwa', category: 'styles', subcategory: 'Contemporary Manga/Webtoon', archetype: 'korean-manhwa', defaultStyle: 'anime', tags: ['manhwa', 'webtoon', 'vibrant', 'glossy'], promptTpl: 'High-production digital manhwa webtoon style with glossy hair sheen and smooth lighting gradients' },
  { id: 'style_storybook', name: 'Whimsical Children Storybook', category: 'styles', subcategory: 'Traditional & Storybook', archetype: 'storybook', defaultStyle: 'cartoon', tags: ['storybook', 'whimsical', 'children', 'soft'], promptTpl: 'Warm gentle picture book illustration with soft colored pencil textures and friendly forms' },
  { id: 'style_educational', name: 'Educational Infographic', category: 'styles', subcategory: 'Iconic Directors & Studios', archetype: 'educational-graphic', defaultStyle: 'realistic', tags: ['educational', 'infographic', 'clear', 'diagram'], promptTpl: 'Clear instructional educational presentation vector style with labeled visual components' },
  { id: 'style_minimalist', name: 'Minimalist Line Art', category: 'styles', subcategory: 'Iconic Directors & Studios', archetype: 'minimalist-line', defaultStyle: 'realistic', tags: ['minimalist', 'line-art', 'monoline', 'chic'], promptTpl: 'Elegant continuous monoline graphic art with refined negative space balance' },
  { id: 'style_handdrawn', name: 'Graphite Hand-Drawn Sketch', category: 'styles', subcategory: 'Classic Animation Eras', archetype: 'hand-drawn', defaultStyle: 'comic', tags: ['sketch', 'pencil', 'hand-drawn', 'raw'], promptTpl: 'Expressive graphite pencil animator sketch with visible construction guidelines' },
  { id: 'style_watercolor', name: 'Dreamy Watercolor Gouache', category: 'styles', subcategory: 'Traditional & Storybook', archetype: 'watercolor', defaultStyle: 'oil-painting', tags: ['watercolor', 'gouache', 'soft', 'wash', 'art'], promptTpl: 'Translucent wet-on-wet watercolor washes with blooming pigment edges on textured paper' },
  { id: 'style_sumie_ink', name: 'Sumi-E Oriental Black Ink', category: 'styles', subcategory: 'Fine Art & Painterly', archetype: 'sumie-ink', defaultStyle: 'comic', tags: ['sumi-e', 'ink-wash', 'zen', 'brushstroke'], promptTpl: 'Traditional brush calligraphic ink wash painting with expressive energetic stroke weight' },
  { id: 'style_dark_fantasy', name: 'Dark Fantasy Eldritch', category: 'styles', subcategory: 'Fine Art & Painterly', archetype: 'dark-fantasy', defaultStyle: 'comic', tags: ['dark-fantasy', 'gothic', 'macabre', 'shadow'], promptTpl: 'Moody gothic dark fantasy illustration with deep tenebrism shadows and muted ember accents' },
  { id: 'style_neon_cyberpunk', name: 'Neon Cyberpunk Overdrive', category: 'styles', subcategory: 'Digital Sci-Fi & 3D', archetype: 'neon-cyberpunk', defaultStyle: 'cyberpunk', tags: ['cyberpunk', 'neon', 'glow', 'magenta', 'cyan'], promptTpl: 'Electrifying cyberpunk visual aesthetic with chromatic aberration, neon glows and scanline noise' },
  { id: 'style_scifi_technical', name: 'Hard Sci-Fi Technical Blueprint', category: 'styles', subcategory: 'Digital Sci-Fi & 3D', archetype: 'scifi-technical', defaultStyle: 'cyberpunk', tags: ['blueprint', 'technical', 'schematic', 'grid'], promptTpl: 'Orthographic technical engineering blueprint with cyan grid lines and dimensional spec callouts' },
  { id: 'style_film_noir', name: 'Film Noir Chiaroscuro', category: 'styles', subcategory: 'Fine Art & Painterly', archetype: 'film-noir', defaultStyle: 'realistic', tags: ['noir', 'chiaroscuro', 'monochrome', 'venetian-blinds'], promptTpl: '1940s Hollywood film noir cinematography with dramatic venetian blind shadows and rim light' },
  { id: 'style_semirealistic', name: 'Semi-Realistic Digital Painting', category: 'styles', subcategory: 'Fine Art & Painterly', archetype: 'semi-realistic', defaultStyle: 'realistic', tags: ['semi-realistic', 'concept-art', 'painterly'], promptTpl: 'High-end concept art illustration balancing realistic anatomical structure with painterly brushwork' },
  { id: 'style_realistic', name: 'Cinematic Realistic Lighting', category: 'styles', subcategory: 'Fine Art & Painterly', archetype: 'realistic', defaultStyle: 'realistic', tags: ['realistic', 'cinematic', 'lighting', 'depth'], promptTpl: 'Subtle cinematic volumetric lighting with physically accurate shadow soft falloff' },
  { id: 'style_3d_stylized', name: '3D Hypertoon Subsurface', category: 'styles', subcategory: 'Digital Sci-Fi & 3D', archetype: '3d-stylized', defaultStyle: '3D', tags: ['3d', 'hypertoon', 'subsurface', 'glossy', 'studio'], promptTpl: 'Stylized 3D cinema CGI render with soft subsurface scattering and studio three-point lighting' },
  { id: 'style_whiteboard', name: 'Marker Whiteboard Doodle', category: 'styles', subcategory: 'Iconic Directors & Studios', archetype: 'whiteboard', defaultStyle: 'cartoon', tags: ['whiteboard', 'marker', 'doodle', 'quick-sketch'], promptTpl: 'Clean dry-erase marker whiteboard illustration with energetic loose lines on pure white' },
  { id: 'style_papercraft', name: 'Layered Papercraft Diorama', category: 'styles', subcategory: 'Traditional & Storybook', archetype: 'papercraft', defaultStyle: '3D', tags: ['papercraft', 'diorama', 'cutout', 'layered', 'shadow'], promptTpl: 'Dimensional layered cardstock paper cutout diorama with soft directional cast drop shadows' }
];

// Master lookup mapping
export const ALL_ASSET_FAMILIES: AssetFamilyDefinition[] = [
  ...CHARACTER_FAMILIES,
  ...BACKGROUND_FAMILIES,
  ...POSE_FAMILIES,
  ...EXPRESSION_FAMILIES,
  ...PROP_AND_CREATURE_FAMILIES,
  ...AUDIO_FAMILIES,
  ...STYLE_FAMILIES
];

export const FAMILIES_BY_CATEGORY: Record<AssetCategory, AssetFamilyDefinition[]> = {
  characters: CHARACTER_FAMILIES,
  backgrounds: BACKGROUND_FAMILIES,
  poses: POSE_FAMILIES,
  expressions: EXPRESSION_FAMILIES,
  props: PROP_AND_CREATURE_FAMILIES,
  audio: AUDIO_FAMILIES,
  styles: STYLE_FAMILIES
};
