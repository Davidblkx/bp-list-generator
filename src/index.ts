import { initKeyRead, readKey, readKeyRangeDigit } from './helpers/console';
import { importPostsToFile } from './menu-options';
import { MenuOptions } from './models';

const baseUrl = 'https://www.brainpickings.org';

/** Startup funciton */
async function init() {

  console.clear();
  console.info('Welcome to BrainPickings scrapper');
  console.info('\n*** What to do? ***');
  console.info('\n1 - Import to file');
  console.info('\n0 - Exit');
  console.info('\n*******************');

  const option = <MenuOptions> (await readKeyRangeDigit(0, 1));

  switch (option) {
    case MenuOptions.importToFile:
      console.info('Reading posts from web...');
      await importPostsToFile(baseUrl);
      process.exit();
      break;
    case MenuOptions.exit:
      process.exit();
      break;
    default:
      console.info('Unkown Option, try again..');
      await readKey();
      init();
      break;
  }

}

initKeyRead();
init();
