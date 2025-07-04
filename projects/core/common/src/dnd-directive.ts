/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
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

import {Directive, EventEmitter, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Directive({
  selector: '[ajfDnd]',
  host: {
    '[class.ajf-dnd-over]': 'over',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class AjfDndDirective {
  private _file: EventEmitter<FileList> = new EventEmitter<FileList>();
  @Output() readonly file: Observable<FileList> = this._file as Observable<FileList>;

  private _over: boolean = false;
  get over(): boolean {
    return this._over;
  }

  onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this._over = true;
  }

  onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this._over = false;
  }

  onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.dataTransfer == null || evt.dataTransfer.files.length === 0) {
      return;
    }
    let files: FileList = evt.dataTransfer.files;
    if (files.length > 0) {
      this._over = false;
      this._file.emit(files);
    }
  }
}
