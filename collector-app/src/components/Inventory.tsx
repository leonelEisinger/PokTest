import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Star, Search } from 'lucide-react';

interface Pokemon {
  id: number | string;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  cp: number;
  shiny: boolean;
}

interface InventoryProps {
  inventory: Pokemon[];
  onSellPokemon: (pokemonId: number | string, value: number) => void;
}

const Inventory = ({ inventory, onSellPokemon }: InventoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredInventory = inventory.filter((pokemon) => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || pokemon.types.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  const allTypes: string[] = [...new Set(inventory.flatMap((pokemon) => pokemon.types))];

  const duplicateIds = useMemo(() => {
    const nameMap = new Map<string, number[]>();
    inventory.forEach((pokemon) => {
      if (!nameMap.has(pokemon.name)) {
        nameMap.set(pokemon.name, []);
      }
      nameMap.get(pokemon.name)?.push(pokemon.id as number);
    });

    const duplicates: number[] = [];
    nameMap.forEach((ids) => {
      if (ids.length > 1) {
        duplicates.push(...ids.slice(1)); // Keep one, sell others
      }
    });

    return duplicates;
  }, [inventory]);

  const handleSellAllDuplicates = () => {
    const duplicatesToSell = inventory.filter((p) => duplicateIds.includes(p.id as number));
    duplicatesToSell.forEach((pokemon) => {
      const sellValue = Math.floor(pokemon.cp * 0.2);
      onSellPokemon(pokemon.id, sellValue);
    });
  };

  if (inventory.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-white mb-2">No Pokémon Yet!</h2>
        <p className="text-blue-200">Open some packs to start your collection!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Your Collection</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {allTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {duplicateIds.length > 0 && (
          <div className="mb-4 text-center">
            <Button
              onClick={handleSellAllDuplicates}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sell All Duplicates
            </Button>
          </div>
        )}
      </div>

      <div className="mb-4 text-center">
        <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
          {filteredInventory.length} / {inventory.length} Pokémon
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredInventory.map((pokemon) => {
          const sellPrice = Math.floor(pokemon.cp * 0.2);
          return (
            <Card
              key={pokemon.id}
              className={`w-full bg-gradient-to-br ${
                pokemon.shiny ? 'from-yellow-400 to-yellow-600' : 'from-gray-600 to-gray-800'
              } border-0 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
            >
              <CardContent className="p-4 text-center">
                <Badge
                  className={`mb-2 ${
                    pokemon.shiny ? 'bg-yellow-400 text-black' : 'bg-gray-500 text-white'
                  }`}
                >
                  {pokemon.shiny ? 'SHINY' : 'NORMAL'}
                </Badge>
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-24 h-24 mx-auto mb-2 drop-shadow-lg"
                />
                <h3 className="font-bold text-white capitalize mb-1">{pokemon.name}</h3>
                <div className="flex justify-center gap-1 mb-2">
                  {pokemon.types.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-center text-yellow-300 mb-3">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="font-bold text-sm">{pokemon.cp} CP</span>
                </div>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => onSellPokemon(pokemon.id, sellPrice)}
                >
                  Sell for {sellPrice} Coins
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && inventory.length > 0 && (
        <div className="text-center py-8">
          <p className="text-white text-lg">No Pokémon match your current filters.</p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
