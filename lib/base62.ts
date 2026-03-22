const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// converts the url into a base62 number
export function encodeBase62(num: number): string {
  if (num === 0) return BASE62[0];

  let result = "";

  while (num > 0) {
    const remainder = num % 62;
    result = BASE62[remainder] + result;
    num = Math.floor(num / 62);
  }

  return result;
}

// converts a base62 number to an url
export function decodeBase62(str: string): number {
  let num = 0;

  for (let i = 0; i < str.length; i++) {
    const value = BASE62.indexOf(str[i]);
    num = num * 62 + value;
  }

  return num;
}