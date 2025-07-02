import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, User, Target, Award } from 'lucide-react';

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

interface ProfileProps {
  userStats: {
    packsOpened: number;
    pokemonCaught: number;
    rareCards: number;
    coins: number;
  };
  pokemonHistory: Pokemon[];
}

const Profile = ({ userStats, pokemonHistory }: ProfileProps) => {
  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Open your first pack',
      icon: Trophy,
      progress: userStats.packsOpened >= 1 ? 100 : 0,
      unlocked: userStats.packsOpened >= 1,
      requirement: 'Open 1 pack',
    },
    {
      id: 2,
      title: 'Collector',
      description: 'Catch 10 Pokémon',
      icon: Star,
      progress: Math.min((userStats.pokemonCaught / 10) * 100, 100),
      unlocked: userStats.pokemonCaught >= 10,
      requirement: `${userStats.pokemonCaught}/10 Pokémon`,
    },
    {
      id: 3,
      title: 'Pack Master',
      description: 'Open 25 packs',
      icon: Target,
      progress: Math.min((userStats.packsOpened / 25) * 100, 100),
      unlocked: userStats.packsOpened >= 25,
      requirement: `${userStats.packsOpened}/25 packs`,
    },
    {
      id: 4,
      title: 'Rare Hunter',
      description: 'Collect 5 rare cards',
      icon: Award,
      progress: Math.min((userStats.rareCards / 5) * 100, 100),
      unlocked: userStats.rareCards >= 5,
      requirement: `${userStats.rareCards}/5 rare cards`,
    },
  ];

  const getPlayerLevel = () => {
    const totalPoints = userStats.packsOpened * 10 + userStats.rareCards * 50;
    return Math.floor(totalPoints / 100) + 1;
  };

  const getNextLevelProgress = () => {
    const totalPoints = userStats.packsOpened * 10 + userStats.rareCards * 50;
    const currentLevelPoints = (getPlayerLevel() - 1) * 100;
    const pointsInCurrentLevel = totalPoints - currentLevelPoints;
    return (pointsInCurrentLevel / 100) * 100;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Trainer Profile</h2>
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-lg px-4 py-2">
          Level {getPlayerLevel()}
        </Badge>
      </div>

      {/* Level Progress */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-white text-center">Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-white mb-1">
              <span>Level {getPlayerLevel()}</span>
              <span>Level {getPlayerLevel() + 1}</span>
            </div>
            <Progress value={getNextLevelProgress()} className="h-3" />
          </div>
          <p className="text-center text-blue-200 text-sm">
            Earn XP by opening packs and collecting rare Pokémon!
          </p>
        </CardContent>
      </Card>

      {/* Only 2 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 border-0">
          <CardContent className="p-6 text-center text-white">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userStats.packsOpened}</div>
            <div className="text-blue-100">Packs Opened</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 border-0">
          <CardContent className="p-6 text-center text-white">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{achievements.filter((a) => a.unlocked).length}</div>
            <div className="text-yellow-100">Achievements</div>
          </CardContent>
        </Card>
      </div>

      {/* Pokémon History */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-white text-center">Pokémon History</CardTitle>
        </CardHeader>
        <CardContent>
          {pokemonHistory.length === 0 ? (
            <p className="text-blue-200 text-center">You haven't opened any Pokémon yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pokemonHistory.slice().reverse().map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="p-2 bg-white/10 rounded-lg text-center shadow-md"
                >
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-20 h-20 mx-auto mb-2 drop-shadow-lg"
                  />
                  <div className="text-white font-semibold capitalize">{pokemon.name}</div>
                  <div className="text-xs text-gray-300">{pokemon.cp} CP</div>
                  <div className="flex justify-center flex-wrap gap-1 mt-1">
                    {pokemon.types.map((type) => (
                      <Badge key={type} className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  {pokemon.shiny && (
                    <Badge className="mt-2 bg-yellow-400 text-black">SHINY</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-center">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400'
                      : 'bg-white/5 border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        achievement.unlocked ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-bold ${
                          achievement.unlocked ? 'text-green-300' : 'text-gray-300'
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                      <div className="mb-2">
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                      <p className="text-xs text-gray-500">{achievement.requirement}</p>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-green-500 text-white">Unlocked!</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
