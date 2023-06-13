import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepColorService, PepLayoutService, PepScreenSizeType, PepSizeType, PepStyleType } from '@pepperi-addons/ngx-lib';
import { ISlideEditor, ISlideShow, ISlideshowEditor } from '../slideshow.model';
import { PepColorSettings } from '@pepperi-addons/ngx-composite-lib/color-settings';
import { CLIENT_ACTION_ON_SLIDE_BUTTON_CLICKED } from 'shared'

@Component({
    selector: 'slide',
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.scss']
})

export class SlideComponent implements OnInit {
    @ViewChild('mainSlideCont', { static: true }) slideContainer: ElementRef;

    //@Output() slideClick: EventEmitter<any> = new EventEmitter<any>();

    screenSize: PepScreenSizeType;
    
    @Input() slideshowConfig: ISlideshowEditor;
    @Input() slide: ISlideEditor;
    @Input() showSlide: boolean;

    public slideIndex;

    constructor(
        public layoutService: PepLayoutService,
        private pepColorService: PepColorService,
        public translate: TranslateService
    ) {

        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });

    }
    
    ngOnInit() {
        this.slideIndex = this.slide.id;
    }
    
    private getDefaultHostObject(): ISlideShow {
        return { slideshowConfig: new ISlideshowEditor(), slides: Array<ISlideEditor>() };
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
    getAssetWithPos(){
        let imagePosition = this.slide?.Image?.HorizontalPosition + '% ' + this.slide?.Image?.VerticalPosition + '%';
        let imageSrc = this.slide?.Image?.Use  && this.slide?.Image?.AssetUrl !== '' ? 'url(' +this.slide?.Image?.AssetUrl + ')' + ' ' + imagePosition : '';

        if(imageSrc != ''){
            return imageSrc ;
        }
        else{
            return 'unset';
        }
    }

    getGradientOverlay(){
        let gradient = this.slide?.GradientOverlay;
        let horAlign = this.slide?.Alignment?.Horizontal;
        let verAlign = this.slide?.Alignment?.Vertical; // 'top' | 'middle' | 'bottom'

        let direction = '0';

        switch(horAlign){
            case 'left':{
                direction = verAlign === 'start' ? '135' : verAlign === 'middle' ? '90' : '45';
                break;
            }
            case 'center':{
                direction = verAlign === 'start' ? '180' : verAlign === 'middle' ? 'circle' : '0';
                break;
            }
            case 'right':{
                direction = verAlign === 'start' ? '225' : verAlign === 'middle' ? '270' : '315';
                break;
            }
        }
            direction = direction === 'circle' ? direction : direction + 'deg';

        let colorsStr =  this.getRGBAcolor(gradient) +' , '+ this.getRGBAcolor(gradient,0);
        let gradType = direction === 'circle' ? 'radial-gradient' : 'linear-gradient';

        let gradStr = this.slide.GradientOverlay.use ? gradType + '(' + direction +' , '+ colorsStr +')' : '';

        if(gradStr != ''){
            return gradStr ;
        }
        else{
            return 'unset';
        }
    
    }

    getSlideContentHeight(){
        let numToDec = this.slideshowConfig?.Controllers?.ShowInSlider ? 0 : -0.5; 
        let height = parseFloat(this.slideshowConfig?.Structure.Height) + numToDec;

        return height.toString() + this.slideshowConfig?.Structure.Unit;   
    }

    ngOnChanges(changes) { 
        if (changes) {
        }
    }

    onSlideButtonClicked(btnName: string){
        const runScriptData = this.slide[btnName] && this.slide[btnName].script?.runScriptData;
        //if (runScriptData) {
                // Implement script click
                //this.slideClick.emit(runScriptData);
        //}
        
        try{
            const eventData = {
                detail: {
                    eventKey: CLIENT_ACTION_ON_SLIDE_BUTTON_CLICKED,
                    eventData: { script: runScriptData },
                    completion: (res: any) => {
                            if (res) {
                                debugger;
                            } else {
                                // Show default error.
                                debugger;
                            }
                        }
                }
            };

            const customEvent = new CustomEvent('emit-event', eventData);
            window.dispatchEvent(customEvent);
        }
        catch(err){

        }
    }
}
