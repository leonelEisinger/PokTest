import { useEffect, useState } from 'react';
import LootboxOpener from './components/LootboxOpener';
import CollectorGrid from './components/CollectorGrid';
import Inventory from './pages/inventory'; // Import new page
import {type CollectibleItem } from './data/items';
import { loadCollected, saveCollected } from './util/storage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function Home({ collected, onUnlock, duplicatedId }: {
  collected: CollectibleItem[],
  onUnlock: (item: CollectibleItem) => void
  duplicatedId: number | null
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Monster Collector</h1>
      <LootboxOpener onUnlock={onUnlock} />
      <CollectorGrid collected={collected} duplicateId={duplicatedId}  />
    </div>
  );
}

function App() {
  const [collected, setCollected] = useState<CollectibleItem[]>([]);

  useEffect(() => {
    setCollected(loadCollected());
  }, []);

  const [duplicateId, setDuplicateId] = useState<number | null>(null);

  const handleUnlock = (item: CollectibleItem) => {
    const alreadyUnlocked = collected.some(i => i.id === item.id);
    let updated: CollectibleItem[];
    if (alreadyUnlocked) {
      updated = collected.map(i =>
        i.id === item.id ? {...i, qtd: i.qtd + 1} : i
      );
      setDuplicateId(item.id); // set the duplicate flag
      setTimeout(() => setDuplicateId(null), 1000); // clear after 2s
    } else {
      updated = [...collected, {...item, qtd: 1}]
    }
    setCollected(updated);
    saveCollected(updated);
  };

  return (
    <Router>
      <nav className="p-4 bg-gray-100 flex gap-4">
        <Link to="/" className="text-blue-500">Home</Link>
        <Link to="/inventory" className="text-blue-500">Inventory</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home collected={collected} onUnlock={handleUnlock} duplicatedId={duplicateId} />} />
        <Route path="/inventory" element={<Inventory/>} />
      </Routes>
    </Router>
  );
}

export default App;