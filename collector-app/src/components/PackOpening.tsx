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
  shiny: boolean;
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

  const fetchRandomPokemon = async (): Promise<Pokemon | null> => {
    try {
      const randomId = Math.floor(Math.random() * 300) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();

      const isShiny = Math.random() < 0.1; // 10% chance de ser shiny
      const cp = Math.floor(Math.random() * 1000) + 100;

      return {
        name: data.name,
        image: isShiny
        ? data.sprites.front_shiny
        : data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
        types: data.types.map((type: any) => type.type.name),
        height: data.height,
        weight: data.weight,
        cp: cp,
        shiny: isShiny,
        id: data.id
      };
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      return null;
    }
  };

  const openPack = async () => {
    if (coins < 10) {
      toast({
        title: "Not enough coins!",
        description: "You need 10 coins to open a pack.",
        variant: "destructive"
      });
      return;
    }

    setIsOpening(true);
    setShowResults(false);

    const pokemonPromises = [fetchRandomPokemon()]; // Only one
    const newPokemon = await Promise.all(pokemonPromises);
    const validPokemon = newPokemon.filter((pokemon): pokemon is Pokemon => pokemon !== null);

    setTimeout(() => {
      setRevealedPokemon(validPokemon);
      setShowResults(true);
      setIsOpening(false);
      onPackOpened(validPokemon);

      const shinyCount = validPokemon.filter(p => p.shiny).length;
      if (shinyCount > 0) {
        toast({
          title: "You found a Shiny!",
          description: `You got ${shinyCount} shiny Pokémon!`,
        });
      }
    }, 2000);
  };

  return (
    <div className="text-center">
      {!showResults && !isOpening && (
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8">
              <div className="mb-6">
                <Gift className="w-24 h-24 mx-auto text-white mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Pokémon Card</h2>
                <p className="text-purple-100">Contains 1 random Pokémon card</p>
              </div>
              <Badge className="bg-yellow-500 text-black mb-4 text-lg px-4 py-1">
                10 Coins
              </Badge>
              <Button 
                onClick={openPack}
                disabled={coins < 10}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Open Pack!
              </Button>
              {coins < 10 && (
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
          <h2 className="text-3xl font-bold text-white mb-6">Your Pokémon!</h2>
          <div className="flex justify-center items-center flex-wrap gap-6 mb-6">
            {revealedPokemon.map((pokemon, index) => (
              <Card 
                key={index} 
                className={`w-64 bg-gradient-to-br ${
                  pokemon.shiny ? 'from-yellow-400 to-yellow-600' : 'from-gray-500 to-gray-700'
                } border-0 shadow-lg transform hover:scale-105 transition-all duration-300 animate-in fade-in-50`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-4 text-center">
                  <Badge className={pokemon.shiny ? 'bg-yellow-400 text-black' : 'bg-gray-500 text-white'}>
                    {pokemon.shiny ? 'SHINY' : 'NORMAL'}
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
            onClick={() => {setShowResults(false)
              openPack();}
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            Open Another Card
          </Button>
        </div>
      )}
    </div>
  );
};

export default PackOpening;
