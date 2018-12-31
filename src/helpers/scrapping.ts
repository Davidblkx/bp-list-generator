import { load as _loadHtml } from 'cheerio';
import { get as _get } from 'request-promise';
import { none, Option, some } from './option';
import { isCheerioStatic } from './validators';

/**
 * atempts to fetch a url
 * @param url url to load
 */
export async function getHtmlDocument(url: string): Promise<Option<CheerioStatic>> {
  try {
    const htmlData = await _get(url);
    const data = _loadHtml(htmlData);
    return some(data, isCheerioStatic);
  } catch (err) {
    console.error(`Loading url: ${url}`, err);
    return none();
  }
}
