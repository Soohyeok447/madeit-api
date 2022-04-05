import { Injectable } from '@nestjs/common';

@Injectable()
export class UserUtils {
  public static validateUsername(username: string): boolean {
    if (!username.length) return false;

    const usernameSubstring: string[] = username.split('');

    const byte: number = usernameSubstring.reduce((acc, cur) => {
      const code: number = cur.charCodeAt(0);

      if (code > 127) {
        return (acc += 2);
      } else if (code > 64 && code < 91) {
        return (acc += 2);
      } else {
        return (acc += 1);
      }
    }, 0);

    if (byte > 16 || byte < 2) return false;

    return true;
  }
}
