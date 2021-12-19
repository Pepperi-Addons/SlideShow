import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ISlideShow, ISlideshowEditor, slide, TransitionType, ArrowShape, ISlideEditor, textColor, IHostObject, Overlay } from '../slideshow.model';
import { PepStyleType, PepSizeType, PepColorService} from '@pepperi-addons/ngx-lib';
import { PepButton } from '@pepperi-addons/ngx-lib/button';

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
    @Input() id: string;
    
    public title: string;
    
    @Input() isDraggable = false;
    @Input() showActions = true;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() editClick: EventEmitter<any> = new EventEmitter();

    TitleSize:Array<groupButtonArray> = [];
    TitleWeight:Array<groupButtonArray> = [];
    SubTitleSize: Array<groupButtonArray> = [];
    WidthSize: Array<groupButtonArray> = [];
    HorizentalAlign: Array<PepButton> = [];
    VerticalAlign: Array<groupButtonArray> = [];
    DropShadowStyle: Array<groupButtonArray> = [];
    textColors: Array<groupButtonArray> = [];
    buttonColor: Array<PepButton> = [];
    buttonStyle: Array<{key: PepStyleType, value: string}> = [];
    InnerSpacing: Array<{key: PepSizeType, value: string}> = [];

    constructor(
        private translate: TranslateService,
        private pepColorService: PepColorService
        // private utilitiesService: PepUtilitiesService
    ) { 

    }

    async ngOnInit(): Promise<void> {
        this.title = this.configuration.slides[this.id].titleContent;

        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();

        this.TitleSize = [
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') },
            { key: 'lg', value: this.translate.instant('GROUP_SIZE.LG') },
            { key: 'xl', value: this.translate.instant('GROUP_SIZE.XL') },
        ];
    
        this.SubTitleSize = [
            { key: 'sm', value: this.translate.instant('GROUP_SIZE.SM') },
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') },
            { key: 'lg', value: this.translate.instant('GROUP_SIZE.LG') }
        ];

        this.TitleWeight = [
            { key: 'normal', value: this.translate.instant('SLIDE_EDITOR.FONT_WEIGHT.NORMAL') },
            { key: 'bold', value: this.translate.instant('SLIDE_EDITOR.FONT_WEIGHT.BOLD') },
            { key: 'bolder', value: this.translate.instant('SLIDE_EDITOR.FONT_WEIGHT.BOLDER') }
        ]
    
        this.WidthSize =  [
            { key: 'narrow', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.NARROW') },
            { key: 'regular', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.REGULAR') },
            { key: 'wide', value: this.translate.instant('SLIDE_EDITOR.WIDTH_SIZE.WIDE') }
        ];
        
        this.HorizentalAlign =  [
            { key: 'left', iconName: 'text_align_right' },
            { key: 'center', iconName: 'text_align_center' },
            { key: 'right', iconName: 'text_align_left' },
        ];
    
        this.VerticalAlign =  [
            { key: 'top', value: this.translate.instant('SLIDE_EDITOR.VERTICAL_ALIGN_DIRECTION.TOP') },
            { key: 'middle', value: this.translate.instant('SLIDE_EDITOR.VERTICAL_ALIGN_DIRECTION.MIDDLE') },
            { key: 'bottom', value: this.translate.instant('SLIDE_EDITOR.VERTICAL_ALIGN_DIRECTION.BOTTOM') }
        ];
    
        this.DropShadowStyle = [
            { key: 'Soft', value: this.translate.instant('SLIDE_EDITOR.SOFT') },
            { key: 'Regular', value: this.translate.instant('SLIDE_EDITOR.REGULAR') }
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

        this.InnerSpacing = [
            { key: 'sm', value: this.translate.instant('GROUP_SIZE.SM') },
            { key: 'md', value: this.translate.instant('GROUP_SIZE.MD') },
            { key: 'lg', value: this.translate.instant('GROUP_SIZE.LG') }
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

        this.updateHostObject();
    }

    private updateHostObject() {
        
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }

    onSlideshowFieldChange(key, event){
        if(event && event.source && event.source.key){
            this.configuration.slideshowConfig[key] = event.source.key;
        }
        else{
            this.configuration.slideshowConfig[key] = event;
        }

        this.updateHostObject();
    }

    getSliderBackground( color){
        let alignTo = 'right';

        let col: Overlay = new Overlay();

        col.color = color;
        col.opacity = '100';

        let gradStr =  this.getRGBAcolor(col,0) +' , '+ this.getRGBAcolor(col); 
        
        return 'linear-gradient(to ' + alignTo +', ' +  gradStr +')';
    }

    getRGBAcolor(colObj: Overlay, opac = null){
        let rgba = 'rgba(255,255,255,0';
            if(colObj){
                let color = colObj.color;
                let opacity = opac != null ? opac : parseInt(colObj.opacity);

                opacity = opacity > 0 ? opacity / 100 : 0;
                //check if allready rgba
                
                let hsl = this.pepColorService.hslString2hsl(color);
                let rgb = this.pepColorService.hsl2rgb(hsl);
                
                rgba = 'rgba('+ rgb.r + ','  + rgb.g + ',' + rgb.b + ',' + opacity + ')';
        }
        return rgba;
    }
}
