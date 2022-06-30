import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsButtonComponent } from './assets-button.component';
import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { config } from '../addon.config';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';

@NgModule({
    declarations: [AssetsButtonComponent],
    imports: [
        CommonModule,
        PepNgxLibModule,
        PepButtonModule,
        PepRemoteLoaderModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(addonService, ['ngx-lib', 'ngx-composite-lib'], config.AddonUUID),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [AssetsButtonComponent]
})
export class AssetsButtonModule { }
