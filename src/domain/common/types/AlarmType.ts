const alarmTypes: readonly ['Vibration', 'Youtube'] = [
  'Vibration',
  'Youtube',
] as const;

export type AlarmType = typeof alarmTypes[number];

export function isAlarmType(input: string): boolean {
  const alarmType: 'Vibration' | 'Youtube' = alarmTypes.find((t) => {
    return t === input;
  });

  if (!alarmType) return false;

  return true;
}
