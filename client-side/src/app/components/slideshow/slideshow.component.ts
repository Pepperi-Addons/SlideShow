import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { IHostObject, ISlideEditor, ISlideShow, ISlideshowEditor } from '../slideshow.model';


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
    
    private _parameters: any;
    
    private _configuration: ISlideShow; // = this.getDefaultHostObject();
    get configuration(): ISlideShow {
        return this._configuration;
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    public isPause = false;
    public slideIndex = 0;
    private timer: any;

    constructor(
        public layoutService: PepLayoutService,
        public translate: TranslateService
    ) {
        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });

    }
    
    ngOnInit() {
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
          
          let footerPos = sliderHeight +  numToDec;
          
          return footerPos.toString() + this.configuration?.slideshowConfig?.heightUnit;
      } 
      
    getSlideShowHeight(){
        if(this.configuration && Object.keys(this.configuration).length > 0){
            let heightToAdd = this.configuration?.slideshowConfig.controllerSize == 'sm' ? 2.75 : 3.25;
            heightToAdd = this.configuration?.slideshowConfig?.showControllersInSlider ?  0 : heightToAdd;
            return (parseFloat(this.configuration?.slideshowConfig.height) + heightToAdd).toString() + this.configuration?.slideshowConfig.heightUnit;
        }
    }

    getSlideHeight(){
        let retHeight = 'inherit';
        if(this.configuration?.slideshowConfig?.fillHeight && !this.configuration?.slideshowConfig?.showControllersInSlider){
            retHeight = 'calc(100%  - 3rem)';
        }

        return retHeight;
    }
    // ? '95%' : 'inherit'

    private getScriptParams(scriptData: any) {
        const res = {};
        
        if (scriptData) {
            // Go for all the script data and parse the params.
            Object.keys(scriptData).forEach(paramKey => {
                const scriptDataParam = scriptData[paramKey];
                
                // If the param source is dynamic get the value from the _parameters with the param value as key, else it's a simple param.
                if (scriptDataParam.Source === 'dynamic') {
                    res[paramKey] = this._parameters[scriptDataParam.Value] || '';
                } else { // if (scriptDataParam.Source === 'static')
                    res[paramKey] = scriptDataParam.Value;
                }
            });
        }

        return res;
    }

    onSlideClicked(event){
        // Parse the params if exist.
        const params = this.getScriptParams(event.ScriptData);
    
        this.hostEvents.emit({
            action: 'emit-event',
            eventKey: 'RunScript',
            eventData: {
                ScriptKey: event.ScriptKey,
                ScriptParams: params
            }
        });
    }
}
