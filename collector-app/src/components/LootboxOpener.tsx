// src/components/LootboxOpener.tsx

import { items, type CollectibleItem } from '../data/items';
import { useState } from 'react';

function getRandomItem(): CollectibleItem {
  const weights = {
    common: 60,
    rare: 25,
    epic: 10,
    legendary: 5,
  };

  const weightedList = items.flatMap(item =>
    Array(weights[item.rarity]).fill(item)
  );

  return weightedList[Math.floor(Math.random() * weightedList.length)];
}

export default function LootboxOpener({ onUnlock }: { onUnlock: (item: CollectibleItem) => void }) {
  const [openedItem, setOpenedItem] = useState<CollectibleItem | null>(null);

  const handleOpen = () => {
    const item = getRandomItem();
    setOpenedItem(item);
    onUnlock(item);
  };

  return (
    <div className="text-center">
      <button onClick={handleOpen} className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded shadow-md hover:bg-purple-700 transition">
        Open Lootbox
      </button>
      {openedItem && (
        <div className="mt-4">
          <p>You unlocked: {openedItem.name}</p>
          <img src={openedItem.image} alt={openedItem.name} className="mx-auto h-32" />
        </div>
      )}
    </div>
  );
}
