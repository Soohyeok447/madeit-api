import { Day } from "./enum/day.enum";

export class Alarm {

  userId: string;
  
  alias: string;

  time: number;

  day: Day[];

  routineId: string;
}
