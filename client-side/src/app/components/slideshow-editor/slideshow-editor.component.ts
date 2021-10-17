import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PepStyleType, PepSizeType} from '@pepperi-addons/ngx-lib';
import { IPepButtonClickEvent, PepButton } from '@pepperi-addons/ngx-lib/button';
import { ISlideShow, ISlideshowEditor, slide, TransitionType, ArrowShape, ISlideEditor, textColor } from '../slideshow.model';

interface groupButtonArray {
    key: string; 
    value: string;
}

@Component({
    selector: 'slideshow-editor',
    templateUrl: './slideshow-editor.component.html',
    styleUrls: ['./slideshow-editor.component.scss']
})
export class SlideshowEditorComponent implements OnInit {
    
    @ViewChild('availableSlidesContainer', { read: ElementRef }) availableBlocksContainer: ElementRef;

    // @Input() slidesDropList = []; 
    
    private _hostObject: ISlideShow = this.getDefaultHostObject();
    @Input() 
    set hostObject(value: ISlideShow) {
        
        if (!value) {
            value = this.getDefaultHostObject();
        }

        this._hostObject = value;
    }
    get hostObject(): ISlideShow {
        return this._hostObject;
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    
    transitionTypes: Array<{key: TransitionType, value: string}>;
    buttonStyles: Array<{key: PepStyleType, value: string}>;
    SlideDropShadowStyle: Array<groupButtonArray>;
    HeightUnitsType: Array<groupButtonArray>;
    InnerSpacing: Array<{key: PepSizeType, value: string}>;
    ArrowsType: Array<PepButton>;
    ArrowButtons: Array<{key: ArrowShape, value: string}>;
    ControllerSize: Array<groupButtonArray>;
    
   

    currentSlideindex = 0;
    constructor(private translate: TranslateService) { 
        
    }

    private getDefaultHostObject(): ISlideShow {
        return { slideshowConfig: new ISlideshowEditor(), slides: Array<ISlideEditor>() };
    }

    private updateHostObject() {
        
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.hostObject
        });
    }
    onSlideFieldChange(key, event){
        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.hostObject.slides[this.currentSlideindex][keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.hostObject.slides[this.currentSlideindex][key] = value;
        }

        this.updateHostObject();
    }

    onSlideshowFieldChange(key, event){

        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
       
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.hostObject.slideshowConfig[keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.hostObject.slideshowConfig[key] = value;
        }
        
        // if(event && event.source && event.source.key){
        //     this.hostObject.slideshowConfig[key] = event.source.key;
        // }
        // else{
        //     this.hostObject.slideshowConfig[key] = event;
        // }

        this.updateHostObject();
    }

    async ngOnInit(): Promise<void> {

        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();
        
        

        this.SlideDropShadowStyle = [
            { key: 'Soft', value: this.translate.instant('SLIDE_EDITOR.SOFT') },
            { key: 'Regular', value: this.translate.instant('SLIDE_EDITOR.REGULAR') }
        ];

        this.transitionTypes = [
            { key: 'none', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.NONE') },
            { key: 'fade', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.FADE') },
            { key: 'blur', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.BLUR') },
            { key: 'dissolve', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.DISSOLVE') },
            { key: 'iris', value: this.translate.instant('SLIDESHOW.TRANSITIONTYPES.IRIS') }
        ]
        
        this.buttonStyles = [
            { key: 'regular', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.REGULAR') },
            { key: 'weak', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.WEAK') },
            { key: 'weak-invert', value:this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.WEAK-INVERT') },
            { key: 'strong', value:this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.STRONG') }
        ];
        

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
            { key: 'arrow_back', iconName: 'arrow_back', classNames: 'rotate180' },
            { key: 'arrow_right', iconName: 'arrow_right' },
            { key: 'arrow_right_alt', iconName: 'arrow_right_alt' }
        ];
    
        this.ArrowButtons = [
            { key: 'none', value: this.translate.instant('GROUP_SIZE.NONE') },
            { key: 'rect', value: this.translate.instant('SLIDESHOW.ARROW_BUTTON.RECT') },
            { key: 'rounded', value: this.translate.instant('SLIDESHOW.ARROW_BUTTON.ROUNDED') }
        ];
    
        this.ControllerSize = [
            { key: 'sm', value: this.translate.instant('GROUP_SIZE.SM') },
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') }
        ];

    }

    addNewSlideClick() {
        let slide = new ISlideEditor();
        slide.id = (this.hostObject.slides.length);

        this.hostObject.slides.push( slide);   
    }

    onSlideEditClick(event){
       
        if(this.hostObject.slideshowConfig.editSlideIndex === event.id){ //close the editor
            this.hostObject.slideshowConfig.editSlideIndex = "-1";
        }
        else{ 
            this.currentSlideindex = this.hostObject.slideshowConfig.editSlideIndex = event.id;
        }

        this.updateHostObject();
    }
    onSlideRemoveClick(event){
        this.hostObject.slides.splice(event.id, 1);
        this.hostObject.slides.forEach(function(slide, index, arr) {slide.id = index; });
    }

    onValueChange(event){

    }
}
