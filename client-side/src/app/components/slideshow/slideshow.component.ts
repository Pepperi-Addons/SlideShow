import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { SlideshowService } from './index';
import { IHostObject, ISlideEditor, ISlideShow, ISlideshowEditor } from '../slideshow.model';
import { NgtscCompilerHost } from '@angular/compiler-cli/src/ngtsc/file_system';


@Component({
  selector: 'slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
  providers: [TranslatePipe]
})

export class SlideshowComponent implements OnInit {
    @ViewChild('mainSlideCont', { static: true }) slideContainer: ElementRef;
    screenSize: PepScreenSizeType;
    isMobileView = false; // TODO - GET THIS PARAM FROM PAGE BUILDER

    @Input()
    set hostObject(value: IHostObject) {
        // TODO: support all other properties if needed.
        this._configuration = value?.configuration;
        // if (value && value.configuration) {
        //     this._configuration = value.configuration;
        // } else {
        //     this._configuration = this.getDefaultHostObject();
        // }
    }
    
    private _configuration: ISlideShow; // = this.getDefaultHostObject();
    get configuration(): ISlideShow {
        return this._configuration;
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    public isPause = false;
    public slideIndex = 0;
    private timer: any;

    constructor(
        public addonService: SlideshowService,
        public layoutService: PepLayoutService,
        public translate: TranslateService
    ) {
        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });

    }

    private raiseBlockLoadedEvent() {
        this.hostEvents.emit({action: 'block-loaded'});
    }
    
    ngOnInit() {
        this.raiseBlockLoadedEvent();
        this.showSlides();
    }

    showSlides() {

        if (this.configuration && Object.keys(this.configuration).length > 0) {
            if (!this.configuration.slideshowConfig.isTransition) {
                this.isPause = true;
                clearTimeout(this.timer);
            }
            else {
                var slides = this.configuration.slides; 
                if (this.slideIndex >= slides.length) {this.slideIndex = 0}
                
                var that = this;
                var duration = this.configuration.slideshowConfig.transitionDuration * 1000;
                this.timer = setTimeout(function(){that.slideIndex ++; that.showSlides() }, duration);
            }
        }   
      }

      setSlideIndex(index){
          this.slideIndex = index;
      }

      setRunState(event){
        this.isPause = !this.isPause;
        
        if(this.isPause){
            clearTimeout(this.timer);
        }
        else{
            this.showSlides();
        } 
      }

      navigate(event){
        
        this.slideIndex = event === 'forward' ? this.slideIndex + 1 : this.slideIndex - 1;
        
        if(this.slideIndex == this.configuration.slides.length) {
            this.slideIndex = 0
        }
        else if(this.slideIndex < 0) {
            this.slideIndex = this.configuration.slides.length -1;
        }
        
      }

      getSliderFooterTop(){
          let sliderHeight = parseFloat(this.configuration?.slideshowConfig?.height);
          let numToDec = this.configuration?.slideshowConfig?.showControllersInSlider ? -2.5 : 0.5; 
          numToDec = this.configuration?.slideshowConfig?.heightUnit === 'VH' ? this.convertREMToVH(numToDec) : numToDec;
          
          let footerPos = sliderHeight +  numToDec;
          
          return footerPos.toString() + this.configuration?.slideshowConfig?.heightUnit;
      }

      convertREMToVH(rem) {
	    return rem * 16 * (100 / document.documentElement.clientHeight);
      }  
      
      getSlideShowHeight(){
          if(this.configuration && Object.keys(this.configuration).length > 0){
            let heightToAdd = this.configuration?.slideshowConfig.heightUnit === 'REM' ? 2.75 : this.convertREMToVH(2.75);
            heightToAdd = this.configuration?.slideshowConfig?.showControllersInSlider ?  0 : heightToAdd;
            return (parseFloat(this.configuration?.slideshowConfig.height) + heightToAdd).toString() + this.configuration?.slideshowConfig.heightUnit;
          }
      }
}
