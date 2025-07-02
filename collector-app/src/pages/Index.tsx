
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PackageOpen, User, Trophy, Star } from 'lucide-react';
import PackOpening from '@/components/PackOpening';
import Inventory from '@/components/Inventory';
import Profile from '@/components/Profile';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState('packs');
  const [userStats, setUserStats] = useState({
    packsOpened: 0,
    pokemonCaught: 0,
    rareCards: 0,
    coins: 1000
  });
  const [inventory, setInventory] = useState<Pokemon[]>([]);

  const addToInventory = (pokemon: Pokemon) => {
    setInventory(prev => [...prev, { ...pokemon, id: Date.now() + Math.random() }]);
    setUserStats(prev => ({
      ...prev,
      pokemonCaught: prev.pokemonCaught + 1,
      rareCards: pokemon.rarity === 'rare' || pokemon.rarity === 'epic' || pokemon.rarity === 'legendary' ? prev.rareCards + 1 : prev.rareCards
    }));
  };

  const onPackOpened = (newPokemon: Pokemon[]) => {
    newPokemon.forEach(pokemon => addToInventory(pokemon));
    setUserStats(prev => ({
      ...prev,
      packsOpened: prev.packsOpened + 1,
      coins: prev.coins - 100
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            PokéBox Simulator
          </h1>
          <p className="text-blue-200 text-lg">Open packs and collect amazing Pokémon!</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{userStats.coins}</div>
              <div className="text-yellow-300 text-sm">Coins</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{userStats.packsOpened}</div>
              <div className="text-blue-300 text-sm">Packs Opened</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{userStats.pokemonCaught}</div>
              <div className="text-green-300 text-sm">Pokémon</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{userStats.rareCards}</div>
              <div className="text-purple-300 text-sm">Rare Cards</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex gap-2">
            <Button
              variant={activeTab === 'packs' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('packs')}
              className={`${activeTab === 'packs' ? 'bg-blue-600 hover:bg-blue-700' : 'text-white hover:bg-white/20'}`}
            >
              <PackageOpen className="w-4 h-4 mr-2" />
              Open Packs
            </Button>
            <Button
              variant={activeTab === 'inventory' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('inventory')}
              className={`${activeTab === 'inventory' ? 'bg-blue-600 hover:bg-blue-700' : 'text-white hover:bg-white/20'}`}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Inventory
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('profile')}
              className={`${activeTab === 'profile' ? 'bg-blue-600 hover:bg-blue-700' : 'text-white hover:bg-white/20'}`}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'packs' && (
            <PackOpening 
              onPackOpened={onPackOpened} 
              coins={userStats.coins}
            />
          )}
          {activeTab === 'inventory' && (
            <Inventory inventory={inventory} />
          )}
          {activeTab === 'profile' && (
            <Profile userStats={userStats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
