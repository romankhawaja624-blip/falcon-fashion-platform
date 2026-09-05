export type AssetKind = 'product' | 'editorial' | 'avatar' | 'effect';

export type AssetReference = {
  id: string;
  kind: AssetKind;
  source: 'local' | 'remote' | 'generated';
  sourceUrl?: string;
  alt: string;
  referenceScreens: string[];
};

export const assetManifest: AssetReference[] = [
  {
    id: 'falcon-hero-shader',
    kind: 'effect',
    source: 'generated',
    alt: 'Abstract champagne and intelligent blue Falcon AI visual',
    referenceScreens: ['falcon_hero_refined', 'falcon_hero_production_polished'],
  },
  {
    id: 'obsidian-wool-coat-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    alt: 'Black obsidian wool coat on a model in a minimalist studio',
    referenceScreens: ['the_obsidian_wool_coat_product_detail'],
  },
  {
    id: 'obsidian-wool-coat-collar',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    alt: 'Close detail of the obsidian wool coat collar and stitching',
    referenceScreens: ['the_obsidian_wool_coat_product_detail'],
  },
  {
    id: 'obsidian-wool-coat-back',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    alt: 'Back view of the obsidian wool coat silhouette',
    referenceScreens: ['the_obsidian_wool_coat_product_detail'],
  },
  {
    id: 'obsidian-silk-gown-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
    alt: 'Obsidian silk gown in a dramatic editorial setting',
    referenceScreens: ['obsidian_silk_gown_product_detail', 'obsidian_silk_gown_mobile_detail'],
  },
  {
    id: 'graphite-tailored-trousers-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
    alt: 'Graphite tailored wide-leg trousers in Italian wool',
    referenceScreens: [],
  },
  {
    id: 'charcoal-blazer-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
    alt: 'Charcoal double-breasted blazer with peak lapel',
    referenceScreens: [],
  },
  {
    id: 'ivory-knit-turtleneck-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=85',
    alt: 'Ivory ribbed merino wool turtleneck',
    referenceScreens: [],
  },
  {
    id: 'smoke-cashmere-wrap-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1000&q=85',
    alt: 'Smoke-toned oversized cashmere wrap',
    referenceScreens: [],
  },
  {
    id: 'obsidian-silk-camisole-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
    alt: 'Obsidian silk camisole in bias-cut charmeuse',
    referenceScreens: [],
  },
  {
    id: 'midnight-structured-cape-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    alt: 'Midnight structured cape in double-faced wool',
    referenceScreens: [],
  },
  {
    id: 'nero-leather-clutch-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
    alt: 'Nero calfskin leather geometric clutch',
    referenceScreens: [],
  },
  {
    id: 'champagne-draped-dress-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85',
    alt: 'Champagne silk draped column dress with one-shoulder neckline',
    referenceScreens: [],
  },
  {
    id: 'slate-wool-overshirt-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=85',
    alt: 'Slate brushed wool overshirt with utility pockets',
    referenceScreens: [],
  },
  {
    id: 'carbon-silk-scarf-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=85',
    alt: 'Carbon silk twill scarf with tonal geometric print',
    referenceScreens: [],
  },
];

export function getAsset(id: string) {
  return assetManifest.find((asset) => asset.id === id);
}