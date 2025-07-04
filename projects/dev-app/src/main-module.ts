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

import {AjfEchartsModule} from '@ajf/core/echarts';
import {AjfTranslocoModule} from '@ajf/core/transloco';
import {Directionality} from '@angular/cdk/bidi';
import {FullscreenOverlayContainer, OverlayContainer} from '@angular/cdk/overlay';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import {DevAppComponent} from './dev-app';
import {DevAppDirectionality} from './dev-app/dev-app-directionality';
import {DevAppModule} from './dev-app/dev-app-module';
import {DEV_APP_ROUTES} from './routes';

@NgModule({
  declarations: [DevAppComponent],
  bootstrap: [DevAppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DevAppModule,
    RouterModule.forRoot(DEV_APP_ROUTES),
    AjfEchartsModule.forRoot({echarts: () => import('echarts')}),
    AjfTranslocoModule.forRoot(),
  ],
  providers: [
    {provide: Directionality, useClass: DevAppDirectionality},
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class MainModule {}
