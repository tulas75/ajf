/**
 * @license
 * Copyright (C) 2018 Gnucoop soc. coop.
 *
 * This file is part of the Advanced JSON forms (ajf).
 *
 * Advanced JSON forms (ajf) is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Advanced JSON forms (ajf) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Advanced JSON forms (ajf).
 * If not, see http://www.gnu.org/licenses/.
 *
 */

function isArray(a: any): boolean {
  return Array.isArray(a);
}

function isObject(o: any): boolean {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
}

function toCamel(s: string): string {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

export function keysToCamel(o: any): any {
  if (isObject(o)) {
    return Object.keys(o).reduce((n: any, k: string) => {
      n[toCamel(k)] = keysToCamel(o[k]);
      return n;
    }, {} as any);
  } else if (isArray(o)) {
    return o.map((i: string) => keysToCamel(i));
  }

  return o;
}
