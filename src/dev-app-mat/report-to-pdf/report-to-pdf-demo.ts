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

import {AjfReportSerializer, createReportInstance} from '@ajf/core/reports';
import {AjfReportToPdf} from '@ajf/core/report-to-pdf';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {testReport} from './report';

@Component({
  moduleId: module.id,
  selector: 'report-to-pdf-demo',
  templateUrl: 'report-to-pdf-demo.html',
  styleUrls: ['report-to-pdf-demo.css'],
})
export class ReportToPdfDemo implements OnInit {
  @ViewChild('preview', {static: true}) previewEl: ElementRef<HTMLIFrameElement>;

  reportStr: string = JSON.stringify(testReport);
  context: string = '{}';

  constructor(private _ts: TranslateService, private _rtp: AjfReportToPdf) { }

  ngOnInit(): void {
    this._populateReport();
  }

  setReport(): void {
    this._populateReport();
  }

  private _populateReport(): void {
    if (this.previewEl == null) { return; }
    try {
      const schema = JSON.parse(this.reportStr);
      const report = AjfReportSerializer.fromJson(schema);
      const ctx = JSON.parse(this.context);
      const instance = createReportInstance(report, ctx, this._ts);
      this._rtp.getReport(instance).then(url =>
        this.previewEl.nativeElement.setAttribute('src', url));
    } catch (e) { }
  }
}
