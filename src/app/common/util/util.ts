import * as bcrypt from 'bcrypt';


export async function hash(data: string) {
  const salt = await bcrypt.genSalt();

  const hashedData = await bcrypt.hash(data, salt);

  return hashedData;
}