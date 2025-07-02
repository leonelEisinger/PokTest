
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, Filter } from 'lucide-react';

interface Pokemon {
  id: number | string;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  cp: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface InventoryProps {
  inventory: Pokemon[];
}

const Inventory = ({ inventory }: InventoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  const filteredInventory = inventory.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = rarityFilter === 'all' || pokemon.rarity === rarityFilter;
    const matchesType = typeFilter === 'all' || pokemon.types.includes(typeFilter);
    return matchesSearch && matchesRarity && matchesType;
  });

  const allTypes: string[] = [...new Set(inventory.flatMap(pokemon => pokemon.types))];

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
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Filter by rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="uncommon">Uncommon</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {allTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 text-center">
        <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
          {filteredInventory.length} / {inventory.length} Pokémon
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredInventory.map((pokemon) => (
          <Card 
            key={pokemon.id}
            className={`bg-gradient-to-br ${rarityColors[pokemon.rarity]} border-0 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
          >
            <CardContent className="p-4 text-center">
              <Badge className={`mb-2 ${pokemon.rarity === 'legendary' ? 'bg-yellow-500 text-black' : 
                pokemon.rarity === 'epic' ? 'bg-purple-600' : 
                pokemon.rarity === 'rare' ? 'bg-blue-600' : 
                pokemon.rarity === 'uncommon' ? 'bg-green-600' : 'bg-gray-600'}`}>
                {pokemon.rarity.toUpperCase()}
              </Badge>
              <img 
                src={pokemon.image} 
                alt={pokemon.name}
                className="w-20 h-20 mx-auto mb-2 drop-shadow-lg"
              />
              <h3 className="font-bold text-white capitalize mb-1">{pokemon.name}</h3>
              <div className="flex justify-center gap-1 mb-2">
                {pokemon.types.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-center text-yellow-300">
                <Star className="w-4 h-4 mr-1" />
                <span className="font-bold text-sm">{pokemon.cp} CP</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && inventory.length > 0 && (
        <div className="text-center py-8">
          <p className="text-white text-lg">No Pokémon match your current filters.</p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setRarityFilter('all');
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
