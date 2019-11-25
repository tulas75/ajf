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
import {Injectable} from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';

import {reportInstanceToPdf} from './report-instance-to-pdf';

@Injectable()
export class AjfReportToPdf {
  downloadReport(report: AjfReportInstance): void {
    this._createPdf(report).download();
  }

  getReport(report: AjfReportInstance): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        this._createPdf(report).getDataUrl(url => resolve(url));
      } catch (e) {
        console.log(e);
        reject('Invalid PDF');
      }
    });
  }

  private _createPdf(report: AjfReportInstance): pdfMake.TCreatedPdf {
    const pdfDef = reportInstanceToPdf(report);
    console.log(pdfDef);
    if (pdfDef.header) {
      console.log(pdfDef.header(0, 0, {width: 100, height: 100}));
    }
    return pdfMake.createPdf(pdfDef, {
      noBordersNoPadding: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        hLineColor: () => 0,
        vLineColor: () => 0,
        fillColor: () => 0,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      }
    });
  }
}
