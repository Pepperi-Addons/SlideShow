import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepSliderModule} from '@pepperi-addons/ngx-lib/slider';
import { PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { MatDialogModule } from '@angular/material/dialog';
import { PepColorModule } from '@pepperi-addons/ngx-lib/color';
import { PepGroupButtonsModule } from '@pepperi-addons/ngx-lib/group-buttons';
import { PepImageModule } from '@pepperi-addons/ngx-lib/image';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { PepShadowSettingsModule } from '@pepperi-addons/ngx-composite-lib/shadow-settings';
import { PepColorSettingsModule } from '@pepperi-addons/ngx-composite-lib/color-settings';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
import { AssetsButtonModule } from '../assets-button/assets-button.module';

import { config } from '../addon.config';
import { SlideEditorComponent } from './slide-editor.component';

@NgModule({
    declarations: [SlideEditorComponent],
    imports: [
        CommonModule,
        DragDropModule,
        PepButtonModule,
        PepMenuModule,
        PepTextboxModule,
        PepCheckboxModule,
        PepSliderModule,
        PepNgxLibModule,
        PepSelectModule,
        MatDialogModule,
        PepGroupButtonsModule,
        PepColorModule,
        PepImageModule,
        PepTextareaModule,
        PepShadowSettingsModule,
        PepColorSettingsModule,
        PepNgxCompositeLibModule,
        PepGroupButtonsSettingsModule,
        AssetsButtonModule,
        
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [SlideEditorComponent]
})

export class SlideEditorModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
