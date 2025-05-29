// src/data/items.ts

export type CollectibleItem = {
  id: number;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  qtd: number;
};

export const items: CollectibleItem[] = [
  { id: 1, name: 'Flameling', image: '/images/flameling.jpg', rarity: 'common', qtd: 0 },
  { id: 2, name: 'Aquanix', image: '/images/aquanix.jpg', rarity: 'rare', qtd: 0 },
  { id: 3, name: 'Voltazor', image: '/images/voltazor.jpg', rarity: 'epic', qtd: 0 },
  { id: 4, name: 'Mystarion', image: '/images/mystarion.jpg', rarity: 'legendary', qtd: 0 },
  // add more!
];
