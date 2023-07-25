import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ISlideShow, ISlideshowEditor, slide, TransitionType, ArrowShape, ISlideEditor, textColor, IHostObject } from '../slideshow.model';
import { PepStyleType, PepSizeType, PepColorService} from '@pepperi-addons/ngx-lib';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { PepColorSettings } from '@pepperi-addons/ngx-composite-lib/color-settings';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { SlideshowService } from 'src/services/slideshow.service';

interface groupButtonArray {
    key: string; 
    value: string;
}

@Component({
    selector: 'slide-editor',
    templateUrl: './slide-editor.component.html',
    styleUrls: ['./slide-editor.component.scss']
})
export class SlideEditorComponent implements OnInit {
    
    @Input() configuration: ISlideShow;
    @Input() configurationSource: ISlideShow;
    
    @Input() id: string;
    
    public title: string;
    
    @Input() isDraggable = false;
    @Input() showActions = true;

    private _pageParameters: any = {};
    @Input()
    set pageParameters(value: any) {
        this._pageParameters = value;
    }


    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() editClick: EventEmitter<any> = new EventEmitter();

    dialogRef: MatDialogRef<any>;
    
    // TitleSize: Array<PepButton> = [];
    TitleWeight: Array<PepButton> = [];
    // SubTitleSize: Array<PepButton> = [];
    //ButtonsSize: Array<PepButton> = [];
    WidthSize:  Array<PepButton> = [];
    //HorizentalAlign: Array<PepButton> = [];
    //VerticalAlign: Array<groupButtonArray> = [];
    
    textColors: Array<groupButtonArray> = [];
    buttonColor: Array<PepButton> = [];
    buttonStyle: Array<{key: PepStyleType, value: string}> = [];
    
    slideFirstBtnFlowName = undefined;
    slideSecondBtnFlowName = undefined;

    constructor(
        private translate: TranslateService,
        private pepColorService: PepColorService,
        private viewContainerRef: ViewContainerRef,
        private addonBlockLoaderService: PepAddonBlockLoaderService,
        private slideshowService: SlideshowService
        // private utilitiesService: PepUtilitiesService
    ) { 

    }

    async ngOnInit(): Promise<void> {
        
        this.title = this.configuration.Slides[this.id].Title.Content;

        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();

        this.TitleWeight = [
            { key: 'normal', value: this.translate.instant('SLIDE_EDITOR.FONT_WEIGHT.NORMAL'), callback: (event: any) => this.onSlideFieldChange('titleWeight',event) },
            { key: 'bold', value: this.translate.instant('SLIDE_EDITOR.FONT_WEIGHT.BOLD'), callback: (event: any) => this.onSlideFieldChange('titleWeight',event) }
        ]
    
        this.WidthSize =  [
            { key: 'Narrow', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.NARROW'), callback: (event: any) => this.onSlideFieldChange('ContentWidth',event) },
            { key: 'Regular', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.REGULAR'), callback: (event: any) => this.onSlideFieldChange('ContentWidth',event) },
            { key: 'Wide', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.WIDE'), callback: (event: any) => this.onSlideFieldChange('ContentWidth',event) },
        ];
        
        this.textColors = [  
            { key: 'system', value: this.translate.instant('SLIDE_EDITOR.TEXT_COLOR.SYSTEM') },
            { key: 'dimmed', value: this.translate.instant('SLIDE_EDITOR.TEXT_COLOR.DIMMED') },
            { key: 'inverted', value: this.translate.instant('SLIDE_EDITOR.TEXT_COLOR.INVERTED') },
            { key: 'strong', value: this.translate.instant('SLIDE_EDITOR.TEXT_COLOR.STRONG') }
        ];

        this.buttonColor = [
            { key: 'system-primary', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLOR.SYSTEM') },
            { key: 'user-primary', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLOR.USER') },
        ]

        this.buttonStyle = [
            { key: 'weak', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.WEAK')},
            { key: 'weak-invert', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.WEAK_INVERT')},
            { key: 'regular', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.REGULAR')},
            { key: 'strong', value:this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.STRONG')}
        ];  
        
        const slide = this.configuration.Slides[this.id];
    
        if(slide?.FirstButton?.Flow){
            const flow = JSON.parse(atob(slide?.FirstButton?.Flow));
            this.slideFirstBtnFlowName = await this.slideshowService.getFlowName(flow.FlowKey) || undefined;
 
        }
        if(slide?.SecondButton?.Flow){
            const flow = JSON.parse(atob(slide?.SecondButton?.Flow));
            this.slideSecondBtnFlowName = await this.slideshowService.getFlowName(flow.FlowKey) || undefined;
        }
        
    }

    onRemoveClick() {
        this.removeClick.emit({id: this.id});
    }

    onEditClick() {
        this.editClick.emit({id: this.id});
    }

    onSlideFieldChange(key, event){
        //const value = key.indexOf('image') > -1 && key.indexOf('src') > -1 ? event.fileStr :  event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.Slides[this.id][keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration.Slides[this.id][key] = value;
        }

        //this.updateHostObject();
        this.updateHostObjectField(`Slides[${this.id}].${key}`, value);
        //this.updateHostObjectField(`Slides[${this.id}][${key}]`, value);
    }

    private updateHostObjectField(fieldKey: string, value: any, updatePageConfiguration = false) {
        
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey,
            value: value,
            updatePageConfiguration: updatePageConfiguration
        });
    }

    //  private updateHostObject() {
        
    //      this.hostEvents.emit({
    //          action: 'set-configuration',
    //          configuration: this.configuration
    //      });
    //  }

    // onSlideshowFieldChange(key, event){
    //     if(event && event.source && event.source.key){
    //         this.configuration.SlideshowConfig[key] = event.source.key;
    //     }
    //     else{
    //         this.configuration.SlideshowConfig[key] = event;
    //     }

    //     this.updateHostObject();
    // }

    getSliderBackground( color){
        let alignTo = 'right';

        let col: PepColorSettings = new PepColorSettings();

        col.value = color;
        col.opacity = 100;

        let gradStr =  this.getRGBAcolor(col,0) +' , '+ this.getRGBAcolor(col); 
        
        return 'linear-gradient(to ' + alignTo +', ' +  gradStr +')';
    }

    getRGBAcolor(colObj: PepColorSettings, opac = null){
        let rgba = 'rgba(255,255,255,0';
            if(colObj){
                let color = colObj.value;
                let opacity = opac != null ? opac : colObj.opacity;

                opacity = opacity > 0 ? opacity / 100 : 0;
                //check if allready rgba
                
                let hsl = this.pepColorService.hslString2hsl(color);
                let rgb = this.pepColorService.hsl2rgb(hsl);
                
                rgba = 'rgba('+ rgb.r + ','  + rgb.g + ',' + rgb.b + ',' + opacity + ')';
        }
        return rgba;
    }

    onHostEvents(event: any) {
        if(event?.url){
            const encodeImgurl = "'"+ encodeURI(event.url) +"'";
            this.configuration.Slides[this.id]['Image'].AssetKey = event.key;
            this.configuration.Slides[this.id]['Image'].AssetUrl = encodeImgurl;

            this.updateHostObjectField(`Slides[${this.id}].Image.AssetUrl`, encodeImgurl);
            this.updateHostObjectField(`Slides[${this.id}].Image.AssetKey`, event.key);
        }     
    }

    openFlowPickerDialog(btnName: string) {
        const flow = this.configuration?.Slides[this.id][btnName].Flow ? JSON.parse(atob(this.configuration?.Slides[this.id][btnName].Flow)) : null;
        let hostObj = {};
  
        if(flow?.FlowKey !== ''){
            hostObj = { 
                runFlowData: { 
                    FlowKey: flow.FlowKey, 
                    FlowParams: flow.FlowParams 
                },
                fields: {
                    OnLoad: {
                        Type: 'Object',
                    },
                    Test: {
                        Type: 'String'
                    }
                }
            };
        }
        else{
            hostObj = { 
                fields: {
                        OnLoad: {
                            Type: 'Object',
                        },
                        Test: {
                            Type: 'String'
                        }
                    },
                }
        }

        //hostObj = Object.keys(flow).length && flow.FlowKey !== '' ? { 'runFlowData': { 'FlowKey': flow.FlowKey, 'FlowParams': flow.FlowParams }} : hostObj;
        const self = this;
        this.dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'FlowPicker',
            size: 'large',
            hostObject: hostObj,
            hostEventsCallback: async (event) => {
                if (event.action === 'on-done') {
                        const base64Flow = btoa(JSON.stringify(event.data));
                        this.configuration.Slides[this.id][btnName].Flow =  base64Flow;
                        this.updateHostObjectField(`Slides[${this.id}][${btnName}].Flow`, base64Flow, true);
                        this.dialogRef.close();
                        // upfate flows buttons names by key 
                        if(btnName === 'FirstButton'){
                            self.slideFirstBtnFlowName = await (this.slideshowService.getFlowName(event.data.FlowKey) || undefined);
                        }
                        else{
                            self.slideSecondBtnFlowName = await this.slideshowService.getFlowName(event.data.FlowKey) || undefined;
                        }
                       
                } else if (event.action === 'on-cancel') {
                                this.dialogRef.close();
                }
            }
        })
    }
}
