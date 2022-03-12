import { Level } from '../common/enums/Level';

export abstract class LevelProvider {
  abstract calculateLevel(exp: number): Level;
}
