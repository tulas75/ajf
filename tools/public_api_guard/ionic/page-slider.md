## API Report File for "ajf-srcs"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AfterContentInit } from '@angular/core';
import { AjfPageSlider as AjfPageSlider_2 } from '@ajf/core/page-slider';
import { AnimationBuilder } from '@angular/animations';
import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import * as i0 from '@angular/core';
import * as i2 from '@ajf/core/page-slider';
import * as i3 from '@angular/common';
import * as i4 from '@ionic/angular';
import { OnDestroy } from '@angular/core';
import { Renderer2 } from '@angular/core';

// @public (undocumented)
export class AjfPageSlider extends AjfPageSlider_2 implements AfterContentInit, OnDestroy {
    constructor(animationBuilder: AnimationBuilder, cdr: ChangeDetectorRef, renderer: Renderer2, _el: ElementRef);
    // (undocumented)
    static ngAcceptInputType_fixedOrientation: BooleanInput;
    // (undocumented)
    static ngAcceptInputType_hideNavigationButtons: BooleanInput;
    // (undocumented)
    ngAfterContentInit(): void;
    // (undocumented)
    ngOnDestroy(): void;
    // (undocumented)
    static ɵcmp: i0.ɵɵComponentDeclaration<AjfPageSlider, "ajf-page-slider", never, {}, {}, never, ["*", "[ajfPageSliderBar]"]>;
    // (undocumented)
    static ɵfac: i0.ɵɵFactoryDeclaration<AjfPageSlider, never>;
}

// @public (undocumented)
export class AjfPageSliderModule {
    // (undocumented)
    static ɵfac: i0.ɵɵFactoryDeclaration<AjfPageSliderModule, never>;
    // (undocumented)
    static ɵinj: i0.ɵɵInjectorDeclaration<AjfPageSliderModule>;
    // (undocumented)
    static ɵmod: i0.ɵɵNgModuleDeclaration<AjfPageSliderModule, [typeof i1.AjfPageSlider], [typeof i2.AjfPageSliderModule, typeof i3.CommonModule, typeof i4.IonicModule], [typeof i2.AjfPageSliderModule, typeof i1.AjfPageSlider]>;
}

// (No @packageDocumentation comment for this package)

```