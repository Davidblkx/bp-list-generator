import { Option, some } from '../helpers';
import { Pagination } from '../models';

const $pagination: string = '#pagination .pages';

export function loadTotalPages($: CheerioStatic): Option<Pagination> {
  const node = $($pagination).first();
  return some(node)
    .some(c => c.html()).to<string>()
    .some(e => e.replace(',', '').match(/\d+/g))
    .to<RegExpExecArray>()
    .some(e => <Pagination> {
      current: parseInt(e[0], 10) || 0,
      total: parseInt(e[1], 10) || 0
    });
}
