import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { SlideshowService } from './index';
import { ISlideEditor, ISlideShow, ISlideshowEditor } from '../slideshow.model';
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
    
    private updateHostObject() {  
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.hostObject
        });
    }

    private getDefaultHostObject(): ISlideShow {
        return { slideshowConfig: new ISlideshowEditor(), slides: Array<ISlideEditor>() };
    }

    private raiseBlockLoadedEvent() {
        this.hostEvents.emit({action: 'block-loaded'});
    }
    
    ngOnInit() {
        if(this.hostObject.slides.length === 0){ // add default slides
            let a = new ISlideEditor();
            a.id = 0;
            this.hostObject.slides.push( a);

            this.updateHostObject();
        }
    
        this.raiseBlockLoadedEvent();
        this.showSlides();
    }

    showSlides() {
        if(!this.hostObject.slideshowConfig.isTransition || this.hostObject.slideshowConfig.transitionType === 'none'){
            this.isPause = true;
            clearTimeout(this.timer);
        }
        else{
            var slides = this.hostObject.slides; 
            if (this.slideIndex >= slides.length) {this.slideIndex = 0}
            
            var that = this;
            var duration = this.hostObject.slideshowConfig.transitionDuration * 1000;
            this.timer = setTimeout(function(){that.slideIndex ++; that.showSlides() }, duration);
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
        
        if(this.slideIndex == this.hostObject.slides.length) {
            this.slideIndex = 0
        }
        else if(this.slideIndex < 0) {
            this.slideIndex = this.hostObject.slides.length -1;
        }
        
      }




}
