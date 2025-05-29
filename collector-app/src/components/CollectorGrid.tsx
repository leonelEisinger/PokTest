// src/components/CollectorGrid.tsx
import '../App.css'; // <- Custom styles for animation
import { type CollectibleItem } from '../data/items';

interface CollectorGridProps {
  collected: CollectibleItem[];
  duplicateId: number | null;
}

export default function CollectorGrid({ collected, duplicateId }: CollectorGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
      {collected.map(item => (
        <div
          key={item.id}
          className={`bg-white p-2 rounded shadow text-center relative ${
            item.id === duplicateId ? 'duplicate' : ''
          }`}
        >
          <img src={item.image} alt={item.name} className="h-24 mx-auto" />
          <p className="mt-2">{item.name}</p>
          <p className="text-sm text-gray-600">Qty: {item.qtd}</p>
        </div>
      ))}
    </div>
  );
}
