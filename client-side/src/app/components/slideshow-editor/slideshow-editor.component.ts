import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PepStyleType, PepSizeType} from '@pepperi-addons/ngx-lib';
import { IPepButtonClickEvent, PepButton } from '@pepperi-addons/ngx-lib/button';
import { ISlideShow, ISlideshowEditor, slide, TransitionType, ArrowShape, ISlideEditor, textColor, IHostObject } from '../slideshow.model';

@Component({
    selector: 'slideshow-editor',
    templateUrl: './slideshow-editor.component.html',
    styleUrls: ['./slideshow-editor.component.scss']
})
export class SlideshowEditorComponent implements OnInit {
    
    @ViewChild('availableSlidesContainer', { read: ElementRef }) availableBlocksContainer: ElementRef;

    // @Input() slidesDropList = []; 
    
    @Input()
    set hostObject(value: ISlideShow) {
        debugger;
        if (value && value.slides.length) {
            this._configuration = value;
        } else {
            // TODO - NEED TO ADD DEFAULT SLIDE
            this.loadDefaultConfiguration();
        }
    }
    
    private _configuration: ISlideShow;
    get configuration(): ISlideShow {
        return this._configuration;
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    
    transitionTypes: Array<{key: TransitionType, value: string}> = [];
    buttonStyles: Array<{key: PepStyleType, value: string}> = [];
    buttonColors: Array<PepButton> = [];
    SlideDropShadowStyle: Array<PepButton> = [];
    HeightUnitsType: Array<PepButton> = [];
    InnerSpacing: Array<{key: PepSizeType, value: string}> = [];
    ArrowsType: Array<PepButton> = [];
    ArrowButtons: Array<{key: ArrowShape, value: string}> = [];
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

    private updateHostObject() {
        
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }
    onSlideFieldChange(key, event){
        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.slides[this.currentSlideindex][keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration.slides[this.currentSlideindex][key] = value;
        }

        this.updateHostObject();
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
        
        this.updateHostObject();
    }

    async ngOnInit(): Promise<void> {
        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }

        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();

        this.SlideDropShadowStyle = [
            { key: 'Soft', value: this.translate.instant('SLIDE_EDITOR.SOFT') },
            { key: 'Regular', value: this.translate.instant('SLIDE_EDITOR.REGULAR') }
        ];

        this.transitionTypes = [
            { key: 'none', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.NONE') },
            { key: 'fade', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.FADE') },
            { key: 'slide', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.SLIDE') },
            { key: 'zoom', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.ZOOM') }
            
        ]
        
        this.buttonStyles = [
            { key: 'weak', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.WEAK') },
            { key: 'regular', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.REGULAR') },
            { key: 'strong', value:this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.STRONG') }
        ];

        this.buttonColors = [
            { key: 'system', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLORS_') },
            { key: 'inverted', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLORS_INVERTED') },
            { key: 'user', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLORS_USER') },
        ]

        this.HeightUnitsType = [
            { key: 'REM', value: this.translate.instant('SLIDESHOW.HEIGHTUNITS_REM') },
            { key: 'VH', value: this.translate.instant('SLIDESHOW.HEIGHTUNITS_VH') }
        ];
    
        this.InnerSpacing = [
            { key: 'sm', value: this.translate.instant('GROUP_SIZE.SM') },
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') },
            { key: 'lg', value: this.translate.instant('GROUP_SIZE.LG') }
        ];
    
        this.ArrowsType = [
            { key: 'arrow_back_right', iconName: 'arrow_back_right' },
            { key: 'arrow_right', iconName: 'arrow_right' },
            { key: 'arrow_right_alt', iconName: 'arrow_right_alt' }
        ];
    
        this.ArrowButtons = [
            // { key: 'none', value: this.translate.instant('GROUP_SIZE.NONE') },
            { key: 'regular', value: this.translate.instant('SLIDESHOW.ARROW_BUTTON.REGULAR') },
            { key: 'round', value: this.translate.instant('SLIDESHOW.ARROW_BUTTON.ROUND') }
        ];
    
        this.ControllerSize = [
            { key: 'sm', value: this.translate.instant('GROUP_SIZE.SM') },
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') }
        ];

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
    }

    onValueChange(event){

    }
}
