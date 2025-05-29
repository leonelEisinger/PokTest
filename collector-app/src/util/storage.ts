// src/utils/storage.ts

import {type CollectibleItem } from '../data/items';

export const saveCollected = (items: CollectibleItem[]) =>
  localStorage.setItem('collected', JSON.stringify(items));

export const loadCollected = (): CollectibleItem[] => {
  const stored = localStorage.getItem('collected');
  return stored ? JSON.parse(stored) : [];
};
