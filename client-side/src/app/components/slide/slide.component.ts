import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepColorService, PepLayoutService, PepScreenSizeType, PepSizeType, PepStyleType } from '@pepperi-addons/ngx-lib';
import { ISlideEditor, ISlideShow, ISlideshowEditor, Overlay } from '../slideshow.model';

@Component({
    selector: 'slide',
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.scss']
})

export class SlideComponent implements OnInit {
    @ViewChild('mainSlideCont', { static: true }) slideContainer: ElementRef;

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

    getBackground(){
        // todo - right left center ( 0 , color , 0 )
        let gradient = this.slide?.gradientOverlay;

        let alignTo = this.slide?.horizontalAlign == 'center' ? 'center' : this.slide?.horizontalAlign == 'right' ? 'left' : 'right';
        let imagePosition = this.slide?.image?.horizontalPosition + '% ' + this.slide?.image?.verticalPosition + '%';
        let imageSrc = this.slide?.image?.useImage ? 'url('+this.slide?.image?.src + ')' + ' ' + imagePosition : '';
        let gradStr = this.slide?.gradientOverlay?.useGradientOverlay ? (this.slide?.horizontalAlign != 'center' ? this.getRGBAcolor(gradient) +' , '+ this.getRGBAcolor(gradient,0) : this.getRGBAcolor(gradient,0) +' , '+ this.getRGBAcolor(gradient) +' , '+ this.getRGBAcolor(gradient,0)) : '';
        

        gradStr = gradStr != '' ? 'linear-gradient(to ' + alignTo +', ' +  gradStr +')' : '';
        
        return   gradStr  +  (this.slide?.image?.useImage && this.slide?.gradientOverlay?.useGradientOverlay ?  ',' : '') + imageSrc;
    }

    getSlideShadow(){
        
        let intensity = this.slideshowConfig?.dropShadow?.intensity.toString();
        let shadow = this.slideshowConfig?.dropShadow?.type === 'Soft' ? '0px 3px 6px 0px rgba(0, 0, 0, '+ intensity +'),0px 4px 8px 0px rgba(0, 0, 0, '+ intensity +'),0px 6px 12px 0px rgba(0, 0, 0, '+ intensity +')' :
                                                                       '0px 8px 16px 0px rgba(0, 0, 0, '+ intensity +'), 0px 12px 24px 0px rgba(0, 0, 0, '+ intensity +'),0px 24px 48px 0px rgba(0, 0, 0, '+ intensity +')'
        return shadow;
    }

    // getSlideboxHeight() {
    //         let height = parseInt(this.slideshowConfig.height);
    //         let remTodecrease =  8 * (100 / document.documentElement.clientHeight);
    //         return (height - remTodecrease).toString() + this.slideshowConfig.heightUnit;
    // }

    getSlideContentHeight(){

        let height = parseFloat(this.slideshowConfig?.height) ;
        let numToDec = this.slideshowConfig?.showControllersInSlider ? -2 : -0.5; 
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
        if(this.slide[btnName] && this.slide[btnName].linkTo != ''){
            var linkTo = window.open('', '_blank');
            linkTo.location.href = this.slide[btnName].linkTo;
        }
    }

}
