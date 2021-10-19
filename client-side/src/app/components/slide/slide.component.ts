import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepColorService, PepLayoutService, PepScreenSizeType, PepSizeType, PepStyleType } from '@pepperi-addons/ngx-lib';
import { ISlideEditor, ISlideShow, ISlideshowEditor } from '../slideshow.model';

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
    
    private getDefaultHostObject(): ISlideShow {
        return { slideshowConfig: new ISlideshowEditor(), slides: Array<ISlideEditor>() };
    }
    
    getRGBAcolor(){
        let rgba = 'rgba(255,255,255,0';
            if(this.slide && this.slide?.gradientOverlay){
            let color = this.slide?.gradientOverlay?.color;
            let opacity = parseInt(this.slide?.gradientOverlay?.opacity);

            opacity = opacity > 0 ? opacity / 100 : 0;
            //check if allready rgba
            
            let hsl = this.pepColorService.hslString2hsl(color);
            let rgb = this.pepColorService.hsl2rgb(hsl);
            
            rgba = 'rgba('+ rgb.r + ','  + rgb.g + ',' + rgb.b + ',' + opacity + ')';
        }
        return rgba;
    }

    ngOnChanges(changes) { 
        if (changes) {
        }
    }

    ngOnInit() {
        this.slideIndex = this.slide.id;
    }

    onSlideButtonClicked(btnName: string){
        if(this.slide[btnName] && this.slide[btnName].linkTo != ''){
            var linkTo = window.open('', '_blank');
            linkTo.location.href = this.slide[btnName].linkTo;
        }
    }

}
