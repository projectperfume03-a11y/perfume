import 'dotenv/config';
import mongoose from 'mongoose';
import { ProductSchema } from './products/product.schema';

const products = [
  {
    name: 'Ambre Impérial',
    slug: 'roya-ambre-imperial',
    description: 'Une création majestueuse où la chaleur veloutée de l\'ambre gris s\'embrase au contact du safran et de la vanille bourbon. Un sillage noble et magnétique.',
    brand: 'ROYA',
    category: 'Unisex',
    gender: 'Unisex',
    fragranceFamily: 'Ambré Boisé',
    size: '100 ml',
    price: 135,
    oldPrice: 165,
    images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85' }],
    tags: ['signature', 'ambre', 'noble'],
    stockType: 'limited',
    quantity: 25,
    featured: true,
    bestSeller: true,
    fragranceNotes: {
      top: ['Bergamote de Calabre', 'Poivre Rose', 'Safran'],
      heart: ['Ambre Gris précieux', 'Rose Noire', 'Cardamome'],
      base: ['Vanille Bourbon', 'Cèdre de l\'Atlas', 'Patchouli noble']
    }
  },
  {
    name: 'Rose Solaire',
    slug: 'roya-rose-solaire',
    description: 'La quintessence de la féminité solaire. Une rose de Grasse gorgée de lumière matinale, sublimée par la douceur crémeuse du santal blanc.',
    brand: 'ROYA',
    category: 'Women',
    gender: 'Women',
    fragranceFamily: 'Floral Boisé',
    size: '75 ml',
    price: 125,
    images: [{ url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85' }],
    tags: ['rose', 'solaire', 'féminin'],
    stockType: 'unlimited',
    quantity: 50,
    featured: true,
    newArrival: true,
    fragranceNotes: {
      top: ['Mandarine d\'Italie', 'Néroli éclatant', 'Baies Roses'],
      heart: ['Rose de Mai de Grasse', 'Pivoine Blanche', 'Fleur d\'Oranger'],
      base: ['Bois de Santal Blanc', 'Musc Vaporeux', 'Ambre Blanc']
    }
  },
  {
    name: 'Vétiver Céleste',
    slug: 'roya-vetiver-celeste',
    description: 'Un souffle de charisme intemporel. La vivacité fusante des agrumes s\'incline devant un vétiver haïtien d\'une noblesse rare.',
    brand: 'ROYA',
    category: 'Men',
    gender: 'Men',
    fragranceFamily: 'Hespéridé Boisé',
    size: '100 ml',
    price: 115,
    images: [{ url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1000&q=85' }],
    tags: ['frais', 'vétiver', 'masculin'],
    stockType: 'limited',
    quantity: 18,
    newArrival: true,
    bestSeller: true,
    fragranceNotes: {
      top: ['Pamplemousse Noir', 'Citron Vert de Sicile', 'Poivre de Sichuan'],
      heart: ['Vétiver d\'Haïti fumé', 'Géranium Bourbon', 'Sauge Sclarée'],
      base: ['Bois de Cèdre', 'Mousse de Chêne', 'Cuir Végétal']
    }
  },
  {
    name: 'Santal Mystique',
    slug: 'roya-santal-mystique',
    description: 'Un voyage au cœur des bois sacrés. Onctueux et mystérieux, Santal Mystique enveloppe l\'esprit d\'une aura envoûtante.',
    brand: 'ROYA',
    category: 'Unisex',
    gender: 'Unisex',
    fragranceFamily: 'Boisé Oriental',
    size: '100 ml',
    price: 145,
    oldPrice: 175,
    images: [{ url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1000&q=85' }],
    tags: ['santal', 'iris', 'mystique'],
    stockType: 'limited',
    quantity: 12,
    featured: true,
    bestSeller: true,
    fragranceNotes: {
      top: ['Safran d\'Orient', 'Cardamome verte', 'Gingembre frais'],
      heart: ['Iris poudré de Florence', 'Papyrus', 'Fève Tonka grillée'],
      base: ['Bois de Santal de Mysore', 'Cuir Doux', 'Ambre Sombre']
    }
  },
  {
    name: 'Fleur de Soie',
    slug: 'roya-fleur-de-soie',
    description: 'Une caresse de satin pur sur la peau. Fleur de Soie captive par ses effluves de jasmin précieux et d\'amande gourmande.',
    brand: 'ROYA',
    category: 'Women',
    gender: 'Women',
    fragranceFamily: 'Floral Gourmand',
    size: '75 ml',
    price: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1000&q=85' }],
    tags: ['jasmin', 'amande', 'soie'],
    stockType: 'limited',
    quantity: 14,
    newArrival: true,
    fragranceNotes: {
      top: ['Fleur de Cerisier', 'Amande Douce craquante', 'Poire Williams'],
      heart: ['Jasmin Sambac d\'Inde', 'Tubéreuse veloutée', 'Miel blanc'],
      base: ['Musc Blanc soyeux', 'Cashmeran', 'Bois de Santal crémeux']
    }
  },
  {
    name: 'Oud Majestueux',
    slug: 'roya-oud-majestueux',
    description: 'Le joyau de la couronne ROYA. Une symphonie d\'oud royal et de cuir noble qui transcende les époques.',
    brand: 'ROYA',
    category: 'Men',
    gender: 'Men',
    fragranceFamily: 'Oriental Précieux',
    size: '100 ml',
    price: 160,
    oldPrice: 195,
    images: [{ url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85' }],
    tags: ['oud', 'cuir', 'majestueux'],
    stockType: 'unlimited',
    quantity: 40,
    featured: true,
    bestSeller: true,
    fragranceNotes: {
      top: ['Encens de Somalie', 'Élémi', 'Poivre Noir'],
      heart: ['Bois d\'Oud rare', 'Cuir de Russie', 'Ciste Labdanum'],
      base: ['Ambre Noir fumé', 'Bois de Gaïac', 'Musc Sauvage']
    }
  }
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roya-parfums';
  await mongoose.connect(uri);
  const Product = mongoose.model('Product', ProductSchema);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} official ROYA development products successfully into ${uri}`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
