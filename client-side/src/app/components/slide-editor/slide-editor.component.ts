import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ISlideShow, ISlideshowEditor, slide, TransitionType, ArrowShape, ISlideEditor, textColor, IHostObject } from '../slideshow.model';
import { PepStyleType, PepSizeType, PepColorService} from '@pepperi-addons/ngx-lib';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { PepColorSettings } from '@pepperi-addons/ngx-composite-lib/color-settings';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';

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
    
    TitleSize: Array<PepButton> = [];
    TitleWeight: Array<PepButton> = [];
    SubTitleSize: Array<PepButton> = [];
    ButtonsSize: Array<PepButton> = [];
    WidthSize:  Array<PepButton> = [];
    HorizentalAlign: Array<PepButton> = [];
    VerticalAlign: Array<groupButtonArray> = [];
    
    textColors: Array<groupButtonArray> = [];
    buttonColor: Array<PepButton> = [];
    buttonStyle: Array<{key: PepStyleType, value: string}> = [];
    InnerSpacing: Array<PepButton> = [];

    constructor(
        private translate: TranslateService,
        private pepColorService: PepColorService,
        private viewContainerRef: ViewContainerRef,
        private addonBlockLoaderService: PepAddonBlockLoaderService
        // private utilitiesService: PepUtilitiesService
    ) { 

    }

    async ngOnInit(): Promise<void> {
        this.title = this.configuration.slides[this.id].titleContent;

        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();

        this.TitleSize = [
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD'), callback: (event: any) => this.onSlideFieldChange('titleSize',event) },
            { key: 'lg', value: this.translate.instant('GROUP_SIZE.LG'), callback: (event: any) => this.onSlideFieldChange('titleSize',event) },
            { key: 'xl', value: this.translate.instant('GROUP_SIZE.XL'), callback: (event: any) => this.onSlideFieldChange('titleSize',event) },
        ];

        this.ButtonsSize = [
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD'), callback: (event: any) => this.onSlideFieldChange('buttonsSize',event) },
            { key: 'lg', value: this.translate.instant('GROUP_SIZE.LG'), callback: (event: any) => this.onSlideFieldChange('buttonsSize',event) },
            { key: 'xl', value: this.translate.instant('GROUP_SIZE.XL'), callback: (event: any) => this.onSlideFieldChange('buttonsSize',event) },
        ];
    
        this.SubTitleSize = [
            { key: 'sm', value: this.translate.instant('GROUP_SIZE.SM'), callback: (event: any) => this.onSlideFieldChange('subTitleSize',event) },
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') , callback: (event: any) => this.onSlideFieldChange('subTitleSize',event) },
            { key: 'lg', value: this.translate.instant('GROUP_SIZE.LG'), callback: (event: any) => this.onSlideFieldChange('subTitleSize',event) }
        ];

        this.InnerSpacing = [
            { key: 'sm', value: this.translate.instant('GROUP_SIZE.SM'), callback: (event: any) => this.onSlideFieldChange('innerSpacing',event) },
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') , callback: (event: any) => this.onSlideFieldChange('innerSpacing',event) },
            { key: 'lg', value: this.translate.instant('GROUP_SIZE.LG'), callback: (event: any) => this.onSlideFieldChange('innerSpacing',event) }
        ]
        this.TitleWeight = [
            { key: 'normal', value: this.translate.instant('SLIDE_EDITOR.FONT_WEIGHT.NORMAL'), callback: (event: any) => this.onSlideFieldChange('titleWeight',event) },
            { key: 'bold', value: this.translate.instant('SLIDE_EDITOR.FONT_WEIGHT.BOLD'), callback: (event: any) => this.onSlideFieldChange('titleWeight',event) },
            { key: 'bolder', value: this.translate.instant('SLIDE_EDITOR.FONT_WEIGHT.BOLDER'), callback: (event: any) => this.onSlideFieldChange('titleWeight',event) }
        ]
    
        this.WidthSize =  [
            { key: 'Narrow', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.NARROW'), callback: (event: any) => this.onSlideFieldChange('contentWidth',event) },
            { key: 'Regular', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.REGULAR'), callback: (event: any) => this.onSlideFieldChange('contentWidth',event) },
            { key: 'Wide', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.WIDE'), callback: (event: any) => this.onSlideFieldChange('contentWidth',event) },
        ];
        
        this.HorizentalAlign =  [
            { key: 'left', iconName: 'text_align_right' },
            { key: 'center', iconName: 'text_align_center' },
            { key: 'right', iconName: 'text_align_left' }
        ];
    
        this.VerticalAlign =  [
            { key: 'top', value: this.translate.instant('SLIDE_EDITOR.VERTICAL_ALIGN_DIRECTION.TOP') },
            { key: 'middle', value: this.translate.instant('SLIDE_EDITOR.VERTICAL_ALIGN_DIRECTION.MIDDLE') },
            { key: 'bottom', value: this.translate.instant('SLIDE_EDITOR.VERTICAL_ALIGN_DIRECTION.BOTTOM') }
        ];
        
        this.textColors = [  
            { key: 'system', value: this.translate.instant('SLIDE_EDITOR.TEXT_COLOR.SYSTEM') },
            { key: 'dimmed', value: this.translate.instant('SLIDE_EDITOR.TEXT_COLOR.DIMMED') },
            { key: 'inverted', value: this.translate.instant('SLIDE_EDITOR.TEXT_COLOR.INVERTED') },
            { key: 'strong', value: this.translate.instant('SLIDE_EDITOR.TEXT_COLOR.STRONG') }
        ];

        this.buttonColor = [
            { key: 'system-primary', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLOR.SYSTEM') },
            { key: 'invert', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLOR.INVERTED') },
            { key: 'user-primary', value:this.translate.instant('SLIDE_EDITOR.BUTTON_COLOR.USER') },
        ]

        this.buttonStyle = [
            { key: 'weak', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.WEAK') },
            { key: 'regular', value: this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.REGULAR') },
            { key: 'strong', value:this.translate.instant('SLIDE_EDITOR.BUTTON_STYLES.STRONG') }
        ];   
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
            this.configuration.slides[this.id][keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration.slides[this.id][key] = value;
        }

        //this.updateHostObject();
        this.updateHostObjectField(`slides[${this.id}].${key}`, value);
        //this.updateHostObjectField(`slides[${this.id}][${key}]`, value);
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
    //         this.configuration.slideshowConfig[key] = event.source.key;
    //     }
    //     else{
    //         this.configuration.slideshowConfig[key] = event;
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
            this.configuration.slides[this.id]['image'].asset = event.key;
            this.configuration.slides[this.id]['image'].assetURL = event.url;

            this.updateHostObjectField(`slides[${this.id}].image.assetURL`, encodeURI(event.url));
            this.updateHostObjectField(`slides[${this.id}].image.asset`, event.key);
        }     
    }

    openScriptPickerDialog(btnName: string) {
        const script = this.configuration.slides[this.id][btnName].script || {};

        const fields = {};
        Object.keys(this._pageParameters).forEach(paramKey => {
            fields[paramKey] = {
                Type: 'String'
        }
        });
        
        script['fields'] = fields;
        
        //const dialogConfig = new MatDialogConfig();
        //dialogConfig.height = '500px';

        this.dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'ScriptPicker',
            size: 'large',
            //config: dialogConfig,
            hostObject: this.configuration.slides[this.id][btnName].script,
            hostEventsCallback: (event) => { 
                if (event.action === 'script-picked') {
                    this.configuration.slides[this.id][btnName].script = event.data || {};
                    this.updateHostObjectField(`slides[${this.id}][${btnName}].script`, event.data, true);
                    this.dialogRef.close();
                } else if (event.action === 'close') {
                    this.dialogRef.close();
                }
            }
        });
    }
}
