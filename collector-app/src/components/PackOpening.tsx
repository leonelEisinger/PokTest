
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Gift, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  cp: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface PackOpeningProps {
  onPackOpened: (pokemon: Pokemon[]) => void;
  coins: number;
}

const PackOpening = ({ onPackOpened, coins }: PackOpeningProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [revealedPokemon, setRevealedPokemon] = useState<Pokemon[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  const getRarity = (): Pokemon['rarity'] => {
    const rand = Math.random();
    if (rand < 0.02) return 'legendary';
    if (rand < 0.08) return 'epic';
    if (rand < 0.20) return 'rare';
    if (rand < 0.40) return 'uncommon';
    return 'common';
  };

  const fetchRandomPokemon = async (): Promise<Pokemon | null> => {
    try {
      const randomId = Math.floor(Math.random() * 300) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      
      const rarity = getRarity();
      const cp = Math.floor(Math.random() * 1000) + 100;
      
      return {
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
        types: data.types.map((type: any) => type.type.name),
        height: data.height,
        weight: data.weight,
        cp: cp,
        rarity: rarity,
        id: data.id
      };
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      return null;
    }
  };

  const openPack = async () => {
    if (coins < 100) {
      toast({
        title: "Not enough coins!",
        description: "You need 100 coins to open a pack.",
        variant: "destructive"
      });
      return;
    }

    setIsOpening(true);
    setShowResults(false);
    
    const pokemonPromises = Array(5).fill(null).map(() => fetchRandomPokemon());
    const newPokemon = await Promise.all(pokemonPromises);
    const validPokemon = newPokemon.filter((pokemon): pokemon is Pokemon => pokemon !== null);
    
    setTimeout(() => {
      setRevealedPokemon(validPokemon);
      setShowResults(true);
      setIsOpening(false);
      onPackOpened(validPokemon);
      
      const rareCount = validPokemon.filter(p => ['rare', 'epic', 'legendary'].includes(p.rarity)).length;
      if (rareCount > 0) {
        toast({
          title: "Amazing pull!",
          description: `You got ${rareCount} rare card(s)!`,
        });
      }
    }, 3000);
  };

  return (
    <div className="text-center">
      {!showResults && !isOpening && (
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8">
              <div className="mb-6">
                <Gift className="w-24 h-24 mx-auto text-white mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Pokémon Pack</h2>
                <p className="text-purple-100">Contains 5 random Pokémon cards</p>
              </div>
              <Badge className="bg-yellow-500 text-black mb-4 text-lg px-4 py-1">
                100 Coins
              </Badge>
              <Button 
                onClick={openPack}
                disabled={coins < 100}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Open Pack!
              </Button>
              {coins < 100 && (
                <p className="text-red-300 mt-2 text-sm">Not enough coins!</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {isOpening && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mb-6"></div>
          <h2 className="text-3xl font-bold text-white mb-2">Opening Pack...</h2>
          <p className="text-blue-200">Revealing your Pokémon!</p>
        </div>
      )}

      {showResults && (
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Your New Pokémon!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {revealedPokemon.map((pokemon, index) => (
              <Card 
                key={index} 
                className={`bg-gradient-to-br ${rarityColors[pokemon.rarity]} border-0 shadow-lg transform hover:scale-105 transition-all duration-300 animate-in fade-in-50`}
                style={{ animationDelay: `${index * 0.2}s` }}
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
                    className="w-24 h-24 mx-auto mb-2 drop-shadow-lg"
                  />
                  <h3 className="font-bold text-white capitalize text-lg">{pokemon.name}</h3>
                  <div className="flex justify-center gap-1 mb-2">
                    {pokemon.types.map(type => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-center text-yellow-300">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="font-bold">{pokemon.cp} CP</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button 
            onClick={() => setShowResults(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            Open Another Pack
          </Button>
        </div>
      )}
    </div>
  );
};

export default PackOpening;