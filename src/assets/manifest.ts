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
    sourceUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWzLiMyzJWtVFtcZ4XOm08PVot1VoETkMnujes3oDaXEyyIcq8XJItwmD7qpa_Qy8W9GT1o1FVzwuEBHGTgVfB2PcibFb308yIc1rHTG70Xgc-qIESiPIG9REYtRPVQ_hbCvuws3-SC17ukvq4EwJCrhLzefXP4gn_I_uWNGaCrZ7FMHMaZVJo_bSRJlyK_2Csd_ASHqXNx941UIAysee6bELBxmiCEqV3MTwC9myBf483v5nSYxzLpQ',
    alt: 'Black obsidian wool coat on a model in a minimalist studio',
    referenceScreens: ['the_obsidian_wool_coat_product_detail'],
  },
  {
    id: 'obsidian-wool-coat-collar',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtg0auhkgZdiB68uqq0Bgs5NxEkYoXEXebyarb2KJhQqrOVPGRUYSv60bsw9mK7D-H3tkvZU-MBFmuhFTZtKx1_IFH-nqHqurOtRm2uWM0Slnzzr9hW35zg3xCY3F-LADNvRJRwTiGGXhLgKi97aahTXxWr8NiY29nkSf6shSrLnWU9FobLtk066M20pFBzRfIc1NrSMtlWbu9K0hGEIfvJvD_V64JLd91ZUWp1kdKP488-9qVqWQBrQ',
    alt: 'Close detail of the obsidian wool coat collar and stitching',
    referenceScreens: ['the_obsidian_wool_coat_product_detail'],
  },
  {
    id: 'obsidian-wool-coat-back',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCa2BkT4VC4RYNio4oMLB5CGEHNOEMhrBoA1seeFdI-kM4YFZxEUJ5pJaXmW1g6qmPle5hpoa-fwPiPxaEtsT_YVb6EvtXNUiNa15DKCOovtykRwj1piqWMegxe3EezNj4QKMbIDH4Bc5i_ObpNXUIIqJEmbhbeYaXnvBsHlqODoDbACVXJHIvuglVRSfD98bI_lh5tIWVz1Q1K3UBX8hEVkEvJf920dvl0opDRQ7NlDUoUgaedthZmw',
    alt: 'Back view of the obsidian wool coat silhouette',
    referenceScreens: ['the_obsidian_wool_coat_product_detail'],
  },
  {
    id: 'obsidian-silk-gown-main',
    kind: 'product',
    source: 'remote',
    sourceUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5o3xrXx5CaWshT3flfSHgFba_tV4VVZI6d7FjN5oCvRPjNDOeONzSkSRdLtM9cEeLM9POy5vhKSR4Pc7iFn-d8znmQtJqV-xmUrlCSGdW5_8cZY9r5Kd3Jf44rMXbZLjh6qFWOjuBe4etL13nNaGC04baRuCS7smxNGyF9Q1tIfNhjZaAgGNBXsgoXOM4vd9jauhJ1HaVcSWy27XiBGIrE115KHyZ4pqEi01V7XvnjErWDs9pUBXAtw',
    alt: 'Obsidian silk gown in a dramatic editorial setting',
    referenceScreens: ['obsidian_silk_gown_product_detail', 'obsidian_silk_gown_mobile_detail'],
  },
];

export function getAsset(id: string) {
  return assetManifest.find((asset) => asset.id === id);
}