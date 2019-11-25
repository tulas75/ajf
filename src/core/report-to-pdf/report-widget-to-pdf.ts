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

import {AjfColumnWidgetInstance, AjfFormulaWidgetInstance, AjfLayoutWidgetInstance,
  AjfTextWidgetInstance, AjfWidgetInstance, AjfWidgetType} from '@ajf/core/reports';
import * as pdfMake from 'pdfmake/build/pdfmake';

import {stylesToProps} from './styles-to-props';
import {wrapIfHasBackground} from './wrap-if-has-background';

export function reportWidgetToPdf(widget: AjfWidgetInstance): pdfMake.Content {
  let content: pdfMake.Content = {};
  switch (widget.widget.widgetType) {
    case AjfWidgetType.Layout:
      const lw = widget as AjfLayoutWidgetInstance;
      content = {columns: lw.content.map((c, idx) => ({
        ...reportWidgetToPdf(c),
        width: idx < lw.widget.columns.length
          ? (
            lw.widget.columns[idx] > -1
            ? `${lw.widget.columns[idx] * 100}%`
            : '*'
          ) : undefined
      }))};
      break;
    case AjfWidgetType.PageBreak:
      content =  {pageBreak: 'after'};
      break;
    // case AjfWidgetType.Image:
    case AjfWidgetType.Text:
      const tw = widget as AjfTextWidgetInstance;
      content = {text: tw.htmlText};
      break;
    // case AjfWidgetType.Chart:
    // case AjfWidgetType.Table:
    case AjfWidgetType.Column:
      const cw = widget as AjfColumnWidgetInstance;
      content = {stack: cw.content.map(c => reportWidgetToPdf(c)), width: '100%'};
      break;
    case AjfWidgetType.Formula:
      const fw = widget as AjfFormulaWidgetInstance;
      content = {text: fw.formula};
      break;
    // case AjfWidgetType.ImageContainer:
  }
  if (Object.keys(content).length === 0) {
    content.text = '';
  }
  return wrapIfHasBackground({...content, ...stylesToProps(widget.styles)}, widget.styles);
}
