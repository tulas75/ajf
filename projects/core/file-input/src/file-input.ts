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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {AjfFile, AjfFileSizeLimit} from './file';

@Directive({selector: '[ajfDropMessage]'})
export class AjfDropMessage {}

@Directive({
  selector: '[ajfFilePreview]',
  exportAs: 'ajfFilePreview',
})
export class AjfFilePreview implements OnDestroy {
  private _value: AjfFile | undefined;
  get value(): AjfFile | undefined {
    return this._value;
  }

  private _valueSub = Subscription.EMPTY;

  constructor(vcr: ViewContainerRef) {
    const input = vcr.injector.get(AjfFileInput, null);
    const isValueGuard = (value: AjfFile | undefined): value is AjfFile => value != null;
    if (input) {
      this._value = input.value;
      this._valueSub = input.valueChange.pipe(filter(isValueGuard)).subscribe(value => {
        this._value = value;
      });
    }
  }

  ngOnDestroy(): void {
    this._valueSub.unsubscribe();
  }
}

/**
 * It allows the upload of a file inside an AjfForm.
 *
 * @export
 * @class AjfFileInput
 */
@Component({
  selector: 'ajf-file-input',
  templateUrl: './file-input.html',
  styleUrls: ['./file-input.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ajf-file-input]': 'true',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AjfFileInput),
      multi: true,
    },
  ],
})
export class AjfFileInput implements ControlValueAccessor {
  @ContentChildren(AjfDropMessage, {descendants: false})
  _dropMessageChildren!: QueryList<AjfDropMessage>;

  @ContentChildren(AjfFilePreview, {descendants: false})
  _filePreviewChildren!: QueryList<AjfFilePreview>;

  @ViewChild('nativeInput') _nativeInput!: ElementRef<HTMLInputElement>;

  readonly fileIcon: SafeResourceUrl;
  readonly removeIcon: SafeResourceUrl;

  /**
   * Enable drop for a new file to upload
   */
  private _emptyFile: boolean;
  get emptyFile(): boolean {
    return this._emptyFile;
  }

  /**
   * Accepted MimeType
   * Es. "image/*" or "application/pdf"
   */
  @Input() accept: string | undefined;

  private _value: any;
  get value(): any {
    return this._value;
  }
  @Input()
  set value(value: any) {
    if (value instanceof File) {
      this._processFileUpload(value);
    } else if (value instanceof FileList) {
      if (value.length === 1) {
        this._processFileUpload(value[0]);
      }
    } else if (value == null || (isAjfFile(value) && isValidMimeType(value.type, this.accept))) {
      this._value = value;
      if (isAjfFile(value)) {
        this._emptyFile = false;
      }
      this._valueChange.emit(this._value);
      if (this._controlValueAccessorChangeFn != null) {
        this._controlValueAccessorChangeFn(this.value);
      }
      this._cdr.detectChanges();
    }
  }

  private _valueChange = new EventEmitter<AjfFile | undefined>();
  @Output()
  readonly valueChange: Observable<AjfFile | undefined> = this._valueChange as Observable<
    AjfFile | undefined
  >;

  /**
   * Event emitter for the delete file action
   */
  private _deleteFile = new EventEmitter<string>();
  @Output()
  readonly deleteFile: Observable<string> = this._deleteFile as Observable<string>;

  /**
   * The method to be called in order to update ngModel.
   */
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   */
  _onTouched: () => any = () => {};

  constructor(domSanitizer: DomSanitizer, private _cdr: ChangeDetectorRef) {
    this._emptyFile = true;
    this.fileIcon = domSanitizer.bypassSecurityTrustResourceUrl(fileIcon);
    this.removeIcon = domSanitizer.bypassSecurityTrustResourceUrl(trashIcon);
  }

  onFileDrop(files: FileList): void {
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    this._processFileUpload(file);
  }

  onSelectFile(): void {
    const files = this._nativeInput.nativeElement.files;
    if (files == null) {
      return;
    }
    const file = files.item(0);
    if (file == null) {
      return;
    }
    this._processFileUpload(files.item(0) as File);
  }

  registerOnChange(fn: any): void {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  resetValue(): void {
    if (this.value !== null) {
      if (this.value.url && this.value.url.length) {
        this._deleteFile.emit(this.value.url);
        this.value.deleteUrl = true;
        this.value.content = null;
        this.value.name = null;
        this.value.size = 0;
      } else {
        this.value = null;
      }
    }
    this._nativeInput.nativeElement.value = '';
    this._emptyFile = true;
    this._cdr.markForCheck();
  }

  triggerNativeInput(): void {
    if (!this._nativeInput) {
      return;
    }
    this._nativeInput.nativeElement.click();
  }

  writeValue(value: any) {
    this.value = value;
    if (value == null || value == undefined || (value !== null && value.deleteUrl)) {
      this._emptyFile = true;
    } else {
      this._emptyFile = false;
    }
    this._cdr.markForCheck();
  }

  private _processFileUpload(file: File): void {
    const reader = new FileReader();
    const {name, size, type} = file;
    if (!isValidMimeType(type, this.accept)) {
      return;
    }
    if (size >= AjfFileSizeLimit) {
      this.value = {name, size, type, content: 'File too large'};
      this._emptyFile = false;
      return;
    }
    reader.onload = (_: ProgressEvent<FileReader>) => {
      const content = reader.result;
      if (typeof content !== 'string') {
        return;
      }
      this.value = {name, size, type, content};
      this._emptyFile = false;
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Test if a value is an AjfFile interface.
 * The AjfFile is valid if it contains the name and
 * the content or the url of the file
 */
function isAjfFile(value: any): value is AjfFile {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  if ('name' in value && ('content' in value || 'url' in value)) {
    return true;
  }
  return false;
}

function isValidMimeType(mimeType: string, accept: string | undefined): boolean {
  if (accept == null) {
    return true;
  }
  let terminate = true;
  if (accept.endsWith('*')) {
    accept = accept.slice(0, accept.length - 1);
    terminate = false;
  }
  const regExStr = '^' + accept + (terminate ? '$' : '');
  const regEx = new RegExp(regExStr);
  return regEx.test(mimeType);
}

export const fileIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwM' +
  'C9zdmciIHdpZHRoPSIxNzA2LjY2NyIgaGVpZ2h0PSIxNzA2LjY2NyIgdmlld0JveD0iMCAwIDEyODAgMTI4MCIgcHJl' +
  'c2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+PHBhdGggZD0iTTI4MyAxMDNjLTE3LjcgMi40LTMzLjkgMTM' +
  'uOC00Mi4yIDI5LjYtNy40IDE0LTYuOC0zMi41LTYuOCA0OTcuNHMtLjYgNDgzLjQgNi44IDQ5Ny40YzYuOCAxMy4xID' +
  'E4LjYgMjIuNyAzMy43IDI3LjhsNyAyLjNoNzE3bDctMi4zYzE1LjEtNS4xIDI2LjktMTQuNyAzMy43LTI3LjggNy40L' +
  'TE0IDYuOCAxOS4yIDYuOC0zNzYuNlYzOTQuMWwtMTExLjItLjMtMTExLjMtLjQtOC41LTIuM2MtMjMuOC02LjUtNDMt' +
  'MjEuMy01Mi40LTQwLjUtNy41LTE1LjMtNy02LTcuMy0xMzMuOWwtLjQtMTE0LjctMjMzLjIuMS0yMzguNy45em01MTI' +
  'gMTA5LjhjMCAxMjAuNS0uMyAxMTQuOSA2IDEyNC40IDMuNiA1LjUgMTEuNiAxMS4yIDE5LjcgMTQuMSA1LjggMi4yID' +
  'YuNCAyLjIgMTE1LjggMi41bDExMCAuMy0xMjUtMTI1LjQtMTI1LjctMTI1LjVjLS41LS4xLS44IDQ5LjItLjggMTA5L' +
  'jZ6Ii8+PC9zdmc+';

const trashIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmc' +
  'iIHZpZXdCb3g9IjAgLTI1NiAxNzkyIDE3OTIiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik03MD' +
  'kuNDI0IDQ1NS4wNXY1NzZxMCAxNC05IDIzLTkgOS0yMyA5aC02NHEtMTQgMC0yMy05LTktOS05LTIzdi01NzZxMC0xN' +
  'CA5LTIzIDktOSAyMy05aDY0cTE0IDAgMjMgOSA5IDkgOSAyM3ptMjU2IDB2NTc2cTAgMTQtOSAyMy05IDktMjMgOWgt' +
  'NjRxLTE0IDAtMjMtOS05LTktOS0yM3YtNTc2cTAtMTQgOS0yMyA5LTkgMjMtOWg2NHExNCAwIDIzIDkgOSA5IDkgMjN' +
  '6bTI1NiAwdjU3NnEwIDE0LTkgMjMtOSA5LTIzIDloLTY0cS0xNCAwLTIzLTktOS05LTktMjN2LTU3NnEwLTE0IDktMj' +
  'MgOS05IDIzLTloNjRxMTQgMCAyMyA5IDkgOSA5IDIzem0xMjggNzI0di05NDhoLTg5NnY5NDhxMCAyMiA3IDQwLjUgN' +
  'yAxOC41IDE0LjUgMjcgNy41IDguNSAxMC41IDguNWg4MzJxMyAwIDEwLjUtOC41IDcuNS04LjUgMTQuNS0yNyA3LTE4' +
  'LjUgNy00MC41em0tNjcyLTEwNzZoNDQ4bC00OC0xMTdxLTctOS0xNy0xMWgtMzE3cS0xMCAyLTE3IDExem05MjggMzJ' +
  '2NjRxMCAxNC05IDIzLTkgOS0yMyA5aC05NnY5NDhxMCA4My00NyAxNDMuNS00NyA2MC41LTExMyA2MC41aC04MzJxLT' +
  'Y2IDAtMTEzLTU4LjUtNDctNTguNS00Ny0xNDEuNXYtOTUyaC05NnEtMTQgMC0yMy05LTktOS05LTIzdi02NHEwLTE0I' +
  'DktMjMgOS05IDIzLTloMzA5bDcwLTE2N3ExNS0zNyA1NC02MyAzOS0yNiA3OS0yNmgzMjBxNDAgMCA3OSAyNiAzOSAy' +
  'NiA1NCA2M2w3MCAxNjdoMzA5cTE0IDAgMjMgOSA5IDkgOSAyM3oiLz48L3N2Zz4=';
