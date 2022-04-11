import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsButtonComponent } from './assets-button.component';
import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { PepFileService, PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { config } from '../addon.config';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepAddonBlockLoaderModule } from '@pepperi-addons/ngx-composite-lib/addon-block-loader';

@NgModule({
    declarations: [AssetsButtonComponent],
    imports: [
        CommonModule,
        PepNgxLibModule,
        PepButtonModule,
        PepAddonBlockLoaderModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient, fileService: PepFileService, addonService: PepAddonService) => 
                    PepAddonService.createDefaultMultiTranslateLoader(http, fileService, addonService, config.AddonUUID),
                deps: [HttpClient, PepFileService, PepAddonService],
            }, isolate: false
        }),
    ],
    exports: [AssetsButtonComponent]
})
export class AssetsButtonModule { }
