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

import {AjfReportInstance} from '@ajf/core/reports';
import * as pdfMake from 'pdfmake/build/pdfmake';

import {keysToCamel} from './keys-to-camel';
import {reportContainerToPdf} from './report-container-to-pdf';
import {stylesToProps} from './styles-to-props';

export function reportInstanceToPdf(report: AjfReportInstance): pdfMake.TDocumentDefinitions {
  return {
    header: report.header ? () => reportContainerToPdf(report.header!) : undefined,
    content: report.content ? reportContainerToPdf(report.content) : '',
    footer: report.footer ? () => reportContainerToPdf(report.footer!) : undefined,
    styles: keysToCamel(report.styles),
    ...stylesToProps(report.styles),
  };
}
