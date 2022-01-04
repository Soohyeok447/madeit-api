import { Day } from "./enum/day.enum";

export class Alarm {

  userId: string;
  
  label: string;

  time: number;

  day: Day[];

  routineId: string;
}
