import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepColorService, PepLayoutService, PepScreenSizeType, PepSizeType, PepStyleType } from '@pepperi-addons/ngx-lib';
import { ISlideEditor, ISlideShow, ISlideshowEditor } from '../slideshow.model';
import { PepColorSettings } from '@pepperi-addons/ngx-composite-lib/color-settings';

@Component({
    selector: 'slide',
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.scss']
})

export class SlideComponent implements OnInit {
    @ViewChild('mainSlideCont', { static: true }) slideContainer: ElementRef;

    @Output() slideClick: EventEmitter<any> = new EventEmitter<any>();

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
        let imagePosition = this.slide?.image?.horizontalPosition + '% ' + this.slide?.image?.verticalPosition + '%';
        let imageSrc = this.slide?.image?.useImage  && this.slide?.image?.assetURL !== '' ? 'url(' +this.slide?.image?.assetURL + ')' + ' ' + imagePosition : '';

        if(imageSrc != ''){
            return imageSrc ;
        }
        else{
            return 'unset';
        }
    }
    getGradientOverlay(){
        let gradient = this.slide?.gradientOverlay;
        let horAlign = this.slide?.horizontalAlign;
        let verAlign = this.slide?.verticalAlign; // 'top' | 'middle' | 'bottom'

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
                direction = verAlign === 'start' ? '225' : verAlign === 'middle' ? '135' : '315';
                break;
            }
        }
            direction = direction === 'circle' ? direction : direction + 'deg';

        let colorsStr =  direction ! == 'circle' ? this.getRGBAcolor(gradient,0) +' , '+ this.getRGBAcolor(gradient) :
                                                 this.getRGBAcolor(gradient) +' , '+ this.getRGBAcolor(gradient,0);
        //let imagePosition = this.slide?.image?.horizontalPosition + '% ' + this.slide?.image?.verticalPosition + '%';
        //let imageSrc = this.slide?.image?.useImage  && this.slide?.image?.assetURL !== '' ? 'url(' +this.slide?.image?.assetURL + ')' + ' ' + imagePosition : '';
        let gradType = direction === 'circle' ? 'radial-gradient' : 'linear-gradient';

        let gradStr = this.slide.gradientOverlay.use ? gradType + '(' + direction +' , '+ colorsStr +')' : '';
        // if(gradStr != '' && imageSrc != ''){
        //     return gradStr + ',' + imageSrc;
        // }
        // else if(gradStr != '' && imageSrc == ''){
        //     return gradStr ;
        // }
        // else if(gradStr == '' && imageSrc != ''){
        //     return imageSrc ;
        // }

        if(gradStr != ''){
            return gradStr ;
        }
        else{
            return 'unset';
        }
    
    }
    

    getSlideContentHeight(){

        let height = parseFloat(this.slideshowConfig?.height) ;
        let numToDec = this.slideshowConfig?.showControllersInSlider ? 0 : -0.5; 
            numToDec = this.slideshowConfig?.heightUnit === 'VH' ? this.convertREMToVH(numToDec) : numToDec;
            height = height + numToDec;

        return height.toString() + this.slideshowConfig?.heightUnit;
           
    }

    convertVH2REM(vh){
       return 16 * (vh * (100 / document.documentElement.clientHeight));
    }

    convertREMToVH(rem) {
	    return rem * 16 * (100 / document.documentElement.clientHeight);
}

    ngOnChanges(changes) { 
        if (changes) {
        }
    }

    onSlideButtonClicked(btnName: string){
        const runScriptData = this.slide[btnName] && this.slide[btnName].script?.runScriptData;
        if (runScriptData) {
                // Implement script click
                this.slideClick.emit(runScriptData);
            }
        }
}
