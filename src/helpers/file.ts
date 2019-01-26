import * as fs from 'fs';

import { none, Option, some } from './option';

/**
 * load json file and parse it
 * @param path path to json file
 */
export async function loadJsonFile<T>(path: string): Promise<Option<T>> {
  const fileData = await loadFile(path);

  return fileData.some(e => JSON.parse(e));
}

/**
 * tries to load file from path
 * @param path path to file
 */
export async function loadFile(path: string): Promise<Option<string>> {
  if (!await testReadFile(path)) {
    return none();
  }

  return new Promise(res => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res(none());
        return;
      }

      res(some(data));
    });
  });
}

/**
 * check if current user can read the file
 * @param path path to file
 */
export async function testReadFile(path: string) {
  return await testFile(path, fs.constants.R_OK);
}

/**
 * check if current user can access the file
 *
 * @param path path to file
 * @param mode access mode code
 */
export function testFile(path: string, mode: number): Promise<boolean> {
  return new Promise(res => {
    fs.access(path, mode, err => {
      if (err) { console.info('Error accessing file: ' + err.message); }
      res(!err);
    });
  });
}
