import { useEffect, useState } from "react";
import { loadCollected } from "../util/storage";
import type { CollectibleItem } from "../data/items";
import CollectorGrid from "../components/CollectorGrid";

const Inventory = () => {  
  const [collected, setCollected] = useState<CollectibleItem[]>([]);

  useEffect(() => {
    setCollected(loadCollected());
  }, []);

  return (
    <>
    <div className="p-4">
      <h2 className="text-2xl font-bold">View Your monsters</h2>
    </div>
    <CollectorGrid collected={collected} duplicateId={null} />
    </>
  );
};


export default Inventory;
