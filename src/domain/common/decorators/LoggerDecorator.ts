/* eslint-disable @typescript-eslint/typedef */
import { Inject } from '@nestjs/common';

export const contextForLoggers: string[] = new Array<string>();

export function Logger(
  context = '',
): (target: object, key: string | symbol, index?: number) => void {
  if (!contextForLoggers.includes(context)) {
    contextForLoggers.push(context);
  }

  return Inject(`${context}`);
}
