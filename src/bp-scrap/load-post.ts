import { load } from 'cheerio';
import { some } from '../helpers';
import { Post } from '../models';

const $title: string = '.entry-title>a';
const $by: string = '.byline';
const $subtitle: string = 'h2';
const $post: string = '.post';

export function loadBrainPickingsPost(node: CheerioElement): Post {
  const $ = load(node);
  return {
    author: loadAuthor($),
    date: loadDate($),
    link: loadLink($),
    subtitle: loadSubtitle($),
    tags: loadTags($),
    title: loadTitle($),
    hashId: '',
    id: loadId($)
  };
}

function loadAuthor($: CheerioStatic) {
  return some($($by))
    .some(e => e.text())
    .some(e => e.replace('By ', ''))
    .getValue() || '';
}

function loadLink($: CheerioStatic) {
  return some($($title))
    .some(e => e.attr('href'))
    .getValue() || '';
}

function loadDate($: CheerioStatic) {
  return some(loadLink($))
    .some(e => e.match(/\d{4}\/\d{2}\/\d{2}/g))
    .to<RegExpExecArray>()
    .some(e => e[0])
    .some(e => e.replace(/\//g, '-'))
    .getValue() || '1970-01-01';
}

function loadSubtitle($: CheerioStatic) {
  return some($($subtitle))
    .some(e => e.text())
    .getValue() || '';
}

function loadTitle($: CheerioStatic) {
  return some($($title))
    .some(e => e.text())
    .getValue() || '';
}

function loadClass($: CheerioStatic) {
  return some($($post))
    .some(e => e.attr('class'));
}

function loadId($: CheerioStatic) {
  return loadClass($)
    .some(e => e.match(/post-(\d+)/g))
    .to<RegExpExecArray>()
    .some(e => e[0])
    .some(e => e.replace('post-', ''))
    .getValue() || '';
}

function loadTags($: CheerioStatic) {
  return loadClass($)
    .some(e => e.match(/tag-[\w-]*/g))
    .to<RegExpExecArray>()
    .some(e => e.map(s => s.replace('tag-', '')))
    .getValue() || [];
}
