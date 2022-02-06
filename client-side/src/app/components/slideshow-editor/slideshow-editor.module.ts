import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideEditorModule } from '../slide-editor/slide-editor.module';
import { SlideshowEditorComponent } from './slideshow-editor.component';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepSliderModule } from '@pepperi-addons/ngx-lib/slider';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { MatTabsModule } from '@angular/material/tabs';
import { PepAddonService, PepCustomizationService, PepFileService, PepHttpService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepGroupButtonsModule } from '@pepperi-addons/ngx-lib/group-buttons';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
import { PepColorModule } from '@pepperi-addons/ngx-lib/color';
import { PepImageModule } from '@pepperi-addons/ngx-lib/image';
import { PepTextareaModule, } from '@pepperi-addons/ngx-lib/textarea';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { pepIconTextAlignCenter, pepIconTextAlignLeft, pepIconTextAlignRight, pepIconArrowBackRight, pepIconArrowBackLeft, pepIconArrowBack, pepIconArrowLeftAlt,pepIconArrowDown, pepIconArrowUp, PepIconModule, pepIconNumberPlus, PepIconRegistry, pepIconSystemBin, pepIconSystemBolt, pepIconSystemClose, pepIconSystemEdit, pepIconSystemMove } from '@pepperi-addons/ngx-lib/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepShadowSettingsModule } from '@pepperi-addons/ngx-composite-lib/shadow-settings';
import { PepColorSettingsModule } from '@pepperi-addons/ngx-composite-lib/color-settings';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib/';
import { config } from '../addon.config';

const pepIcons = [
    pepIconTextAlignCenter, 
    pepIconTextAlignLeft, 
    pepIconTextAlignRight, 
    pepIconArrowBackRight, 
    pepIconArrowBackLeft,
    pepIconArrowBack,
    pepIconSystemClose,
    pepIconNumberPlus,
    pepIconSystemBolt,
    pepIconSystemEdit,
    pepIconSystemMove,
    pepIconSystemBin,
    pepIconArrowLeftAlt,
    pepIconArrowDown,
    pepIconArrowUp
];

export function createTranslateLoader(addonService: PepAddonService) {
    const addonStaticFolder = addonService.getAddonStaticFolder(config.AddonUUID);
    const ngxLibTranslationResource = addonService.getNgxLibTranslationResource(config.AddonUUID);
    const addonTranslationResource = addonService.getAddonTranslationResource(config.AddonUUID);
    const ngxCompositeLibAssetsFolder = 'assets/ngx-composite-lib/i18n/';

    return addonService.translateService.createMultiTranslateLoader([
        ngxLibTranslationResource,
        addonTranslationResource,
        {
            prefix: `${addonStaticFolder}/${ngxCompositeLibAssetsFolder}`,
            suffix: '.ngx-composite-lib.json',
        }
    ]);
}

@NgModule({
    declarations: [SlideshowEditorComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        PepNgxLibModule,
        PepButtonModule,
        PepTextboxModule,
        PepSelectModule,
        PepSliderModule,
        PepCheckboxModule,
        MatDialogModule,
        PepPageLayoutModule,
        PepGroupButtonsModule,
        PepGroupButtonsSettingsModule,
        MatTabsModule,
        SlideEditorModule,
        PepColorModule,
        PepImageModule,
        PepTextareaModule,
        DragDropModule,
        PepColorSettingsModule,
        PepNgxCompositeLibModule,
        PepShadowSettingsModule,
        
        // When not using module as sub-addon please remark this for not loading twice resources
        // TranslateModule.forChild({
        //     loader: {
        //         provide: TranslateLoader,
        //         useFactory: (http: HttpClient, fileService: PepFileService, addonService: PepAddonService) => 
        //             PepAddonService.createDefaultMultiTranslateLoader(http, fileService, addonService, config.AddonUUID),
        //         deps: [HttpClient, PepFileService, PepAddonService],
        //     }, isolate: false
        // }),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [PepAddonService]
            }, isolate: false
        }),
        
    ],
    exports: [SlideshowEditorComponent],
    providers: [
        HttpClient,
        TranslateStore,
        PepHttpService,
        PepAddonService,
        PepFileService,
        PepCustomizationService,
        PepDialogService
    ]
})
export class SlideshowEditorModule { 
    constructor(
        translate: TranslateService,
        private pepIconRegistry: PepIconRegistry,
        private addonService: PepAddonService,
    ) {
        this.addonService.setDefaultTranslateLang(translate);
        this.pepIconRegistry.registerIcons(pepIcons);
    }
}
