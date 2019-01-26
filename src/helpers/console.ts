// ================================================================================================
// helper functions to handle console
// ================================================================================================
import { createInterface, emitKeypressEvents, Key } from 'readline';

/**
 * initialize the stdin key read
 */
export function initKeyRead() {
  emitKeypressEvents(process.stdin);
  if (process.stdin.setRawMode) {
    process.stdin.setRawMode(true);
    return true;
  } else {
    console.error('cannot start raw mode!');
    return false;
  }
}

/** read a input key */
export function readKey(): Promise<Key> {
  return new Promise(res => {
    process.stdin.on('keypress', (str, key) => {
      res(key);
    });
  });
}

/** ask a question and waits for a answer */
export function question(query: string): Promise<string> {
  return new Promise(res => {
    createInterface(process.stdin, process.stdout)
      .question(query, e => res(e));
  });
}

/**
 * read a key and makes sure it is a number
 * @param min min bound
 * @param max max bound
 */
export async function readKeyRangeDigit(min: number, max: number): Promise<number> {
  if (max <= min || max === 0) { max = 9; }
  if (min >= max || min < 0) { min = 0; }

  const key = await readKey();
  const n = parseInt(key.sequence || '', 10);

  if (isNaN(n) || n < min || n > max) {
    console.info(`Please insert a number between ${min} and ${max}`);
    return await readKeyRangeDigit(min, max);
  }

  return n;
}
