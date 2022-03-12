import { LevelDictionary } from '../../domain/common/dictionaries/LevelDictionary';
import { Level } from '../../domain/common/enums/Level';
import { LevelProvider } from '../../domain/providers/LevelProvider';

export class LevelProviderImpl implements LevelProvider {
  public calculateLevel(exp: number): Level {
    if (exp < 300) return LevelDictionary[0];
    else if (300 <= exp && exp < 600) return LevelDictionary[1];
    else if (600 <= exp && exp < 1000) return LevelDictionary[2];
    else if (1000 <= exp && exp < 1300) return LevelDictionary[3];
    else if (1300 <= exp && exp < 1600) return LevelDictionary[4];
    else if (1600 <= exp && exp < 2000) return LevelDictionary[5];
    else if (2000 <= exp && exp < 2300) return LevelDictionary[6];
    else return LevelDictionary[7];
  }
}
