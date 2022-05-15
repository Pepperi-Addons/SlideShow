import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PepStyleType, PepSizeType} from '@pepperi-addons/ngx-lib';
import { IPepButtonClickEvent, PepButton } from '@pepperi-addons/ngx-lib/button';
import { ISlideShow, ISlideshowEditor, slide, TransitionType, ArrowShape, ISlideEditor, textColor, IHostObject } from '../slideshow.model';
import { PageConfiguration, PageConfigurationParameterBase } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'slideshow-editor',
    templateUrl: './slideshow-editor.component.html',
    styleUrls: ['./slideshow-editor.component.scss']
})
export class SlideshowEditorComponent implements OnInit {
    
    @ViewChild('availableSlidesContainer', { read: ElementRef }) availableBlocksContainer: ElementRef;

    @Input()
    //set hostObject(value: IHostObject) {
    set hostObject(value: any) {
        if (value && value.configuration && Object.keys(value.configuration).length > 0) {
            this._configuration = value.configuration
            if(value.configurationSource && Object.keys(value.configuration).length > 0){
                this.configurationSource = value.configurationSource;
            }
        } else {
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }
        
        this._pageParameters = value?.pageParameters || {};
        this._pageConfiguration = value?.pageConfiguration || this.defaultPageConfiguration;

    }
    // the source config used to do if need to show the Reset button or not
    public configurationSource: ISlideShow;

    private _configuration: ISlideShow;
    get configuration(): ISlideShow {
        return this._configuration;
    }

     // All the page parameters to set in page configuration when needed (for ScriptPicker addon usage).
     private _pageParameters: any;
     get pageParameters(): any {
         return this._pageParameters;
     }
 
     private defaultPageConfiguration: PageConfiguration = { "Parameters": [] };
     private _pageConfiguration: PageConfiguration = this.defaultPageConfiguration;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    blockLoaded = false;

    transitionTypes: Array<{key: TransitionType, value: string}> = [];
    buttonStyle: Array<{key: PepStyleType, value: string}> = [];
    buttonColor: Array<PepButton> = [];
    DropShadowStyle: Array<PepButton> = [];
    HeightUnitsType: Array<PepButton> = [];
    ArrowsType: Array<PepButton> = [];
    ArrowButtons: Array<PepButton> = [];// Array<{key: ArrowShape, value: string}> = [];
    ControllerSize: Array<PepButton> = [];
    
    currentSlideindex = 0;

    constructor(private translate: TranslateService) { 
    }

    private loadDefaultConfiguration() {
        this._configuration = this.getDefaultHostObject();
        this.updateHostObject();
    }

    private getDefaultSlide(): ISlideEditor {
        let a = new ISlideEditor();
        a.id = 0;

        return a;
    }

    private getDefaultHostObject(): ISlideShow {
        return { slideshowConfig: new ISlideshowEditor(), slides: [this.getDefaultSlide()] };
    }

    public onHostObjectChange(event) {
        if(event && event.action){
            if(event.action === 'set-configuration'){
                this._configuration = event.configuration;
                this.updateHostObject();
            }
            if(event.action === 'set-configuration-field'){
                //this._configuration = event.configuration;
                this.updateHostObjectField(event.key, event.value);
            }
            // Update page configuration only if updatePageConfiguration
            if (event.updatePageConfiguration) {
                this.updatePageConfigurationObject();
            }
            
        }
    }

    private updateHostObject() {
        
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }

    onSlideshowFieldChange(key, event){

        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
       
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.slideshowConfig[keyObj[0]][keyObj[1]] = value;
        }
        else {
            this.configuration.slideshowConfig[key] = value;
        }
        
        //this.updateHostObject();
        this.updateHostObjectField(`slideshowConfig.${key}`, value);
    }

    private updateHostObjectField(fieldKey: string, value: any) {
        
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey,
            value: value
        });
    }

    async ngOnInit(): Promise<void> {
        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }

        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();

        this.DropShadowStyle = [
            { key: 'Soft', value: this.translate.instant('SLIDE_EDITOR.SOFT') },
            { key: 'Regular', value: this.translate.instant('SLIDE_EDITOR.REGULAR') }
        ];

        this.transitionTypes = [
            { key: 'none', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.NONE') },
            { key: 'fade', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.FADE') },
            { key: 'slide', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.SLIDE') },
            { key: 'blur', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.BLUR') }
            
        ]
        
        this.buttonStyle = [
            { key: 'weak', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.WEAK') },
            { key: 'regular', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.REGULAR') },
            { key: 'strong', value:this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.STRONG') }
        ];

        this.buttonColor = [
            { key: 'system-primary', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLOR.SYSTEM') },
            { key: 'invert', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLOR.INVERTED') },
            { key: 'user-primary', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLOR.USER') },
        ]

        this.HeightUnitsType = [
            { key: 'REM', value: this.translate.instant('SLIDESHOW.HEIGHTUNITS_REM'), callback: (event: any) => this.onSlideshowFieldChange('heightUnit',event) },
            { key: 'VH', value: this.translate.instant('SLIDESHOW.HEIGHTUNITS_VH'), callback: (event: any) => this.onSlideshowFieldChange('heightUnit',event) }
        ];
    
        this.ArrowsType = [
            { key: 'arrow_back_right', iconName: 'arrow_back_right', callback: (event: any) => this.onSlideshowFieldChange('ArrowsType',event) },
            { key: 'arrow_right', iconName: 'arrow_right', callback: (event: any) => this.onSlideshowFieldChange('ArrowsType',event) },
            { key: 'arrow_right_alt', iconName: 'arrow_right_alt', callback: (event: any) => this.onSlideshowFieldChange('ArrowsType',event) }
        ];
    
        this.ArrowButtons = [
            // { key: 'none', value: this.translate.instant('GROUP_SIZE.NONE') },
            { key: 'regular', value: this.translate.instant('SLIDESHOW.ARROW_BUTTON.REGULAR'), callback: (event: any) => this.onSlideshowFieldChange('arrowShape',event) },
            { key: 'round', value: this.translate.instant('SLIDESHOW.ARROW_BUTTON.ROUND'), callback: (event: any) => this.onSlideshowFieldChange('arrowShape',event) }
        ];
    
        this.ControllerSize = [
            { key: 'sm', value: this.translate.instant('GROUP_SIZE.SM') },
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') }
        ];

        // When finish load raise block-editor-loaded.
        //this.hostEvents.emit({action: 'block-editor-loaded'});
        this.blockLoaded = true;
    }

    addNewSlideClick() {
        let slide = new ISlideEditor();
        slide.id = (this.configuration.slides.length);

        this.configuration.slides.push( slide);   
    }

    onSlideEditClick(event){
       
        if(this.configuration.slideshowConfig.editSlideIndex === event.id){ //close the editor
            this.configuration.slideshowConfig.editSlideIndex = "-1";
        }
        else{ 
            this.currentSlideindex = this.configuration.slideshowConfig.editSlideIndex = event.id;
        }

        this.updateHostObject();
    }
    onSlideRemoveClick(event){
        this.configuration.slides.splice(event.id, 1);
        this.configuration.slides.forEach(function(slide, index, arr) {slide.id = index; });
        this.updateHostObject();
    }

    onValueChange(event){

    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
         moveItemInArray(this.configuration.slides, event.previousIndex, event.currentIndex);
         for(let index = 0 ; index < this.configuration.slides.length; index++){
            this.configuration.slides[index].id = index;
         }
          this.updateHostObject();
        } 
    }

    onDragStart(event: CdkDragStart) {
        //this.galleryService.changeCursorOnDragStart();
    }

    onDragEnd(event: CdkDragEnd) {
        //this.galleryService.changeCursorOnDragEnd();
    }

    private getPageConfigurationParametersNames(): Array<string> {
        const parameters = new Set<string>();
        // Array of actions buttons
        const scriptBtns = ['firstButton','secondButton'];

        // Go for all slides scripts and add parameters to page configuration if Source is dynamic.
        for (let index = 0; index < this.configuration.slides.length; index++) {
            const slide = this.configuration.slides[index];
            scriptBtns.forEach(actButton => {
                if (slide[actButton]?.script?.runScriptData) {
                    Object.keys(slide[actButton]?.script.runScriptData?.ScriptData).forEach(paramKey => {
                        const param = slide[actButton]?.script.runScriptData.ScriptData[paramKey];
            
                        if (!parameters.has(param.Value) && param.Source === 'dynamic') {
                            parameters.add(param.Value);
                        }
                    });
                }
            });
        }

        // Return the parameters as array.
        return [...parameters];
    }

    private updatePageConfigurationObject() {
        const params = this.getPageConfigurationParametersNames();
        this._pageConfiguration = this.defaultPageConfiguration;

        // Add the parameter to page configuration.
        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {
            const param = params[paramIndex];
            
            this._pageConfiguration.Parameters.push({
                Key: param,
                Type: 'String',
                Consume: true,
                Produce: false
            });
        }

        this.hostEvents.emit({
            action: 'set-page-configuration',
            pageConfiguration: this._pageConfiguration
        });
    }
}
