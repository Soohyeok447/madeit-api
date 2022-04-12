/* eslint-disable @typescript-eslint/typedef */
import { Inject } from '@nestjs/common';

export const contextForLoggers: string[] = new Array<string>();

export function Logger(context = ''): any {
  if (!contextForLoggers.includes(context)) {
    contextForLoggers.push(context);
  }

  return Inject(`${context}`);
}
