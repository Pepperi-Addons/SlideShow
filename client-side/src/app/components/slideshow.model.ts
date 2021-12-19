import { PepStyleType, PepSizeType, PepHorizontalAlignment, PepVerticalAlignment, PepScreenSizeType} from '@pepperi-addons/ngx-lib';
import { PageConfiguration } from '@pepperi-addons/papi-sdk';

export interface IHostObject {
    configuration: ISlideShow;
    // pageConfiguration?: PageConfiguration;
    // pageType?: any;
    // context?: any;
    // filter?: any;
}

export type HeightUnit = 'REM' | 'VH';
export type TransitionType = 'none' | 'fade' | 'blur' | 'slide';
export type ArrowType = 'arrow_back_right' | 'arrow_right' | 'arrow_right_alt';
export type ArrowShape = 'none' | 'regular' | 'round';
export type WidthUnits = 'Narrow' | 'Regular' | 'Wide';
export type Intensity = 'Soft' | 'Regular';
export type textColor = 'system' | 'dimmed' | 'inverted' | 'strong';
export type FontWeight = 'normal' | 'bold' | 'bolder';
export type buttonColor = 'system-primary' | 'invert' | 'user-primary' ;

export class SlideButton {
    useButton: boolean = true;
    label: string = 'Button';
    linkTo: string = '';
    style: PepStyleType = 'regular'
}

export class Overlay {
    useGradientOverlay: boolean;
    color: string;
    opacity: string ;

    constructor(use: boolean = false, color: string = 'hsl(0, 7%, 67%)' ,opacity: string = '50'){
        this.useGradientOverlay = use;
        this.color = color;
        this.opacity = opacity;
    }
}

export class SlideImage {
    useImage: boolean = false;
    src: string =  '';
    horizontalPosition: string = '50';
    verticalPosition: string = '50';
}

export class DropShadow {
    useDropShadow: boolean = true;
    type: Intensity = 'Regular';
    intensity:  number = 50;
}


//export interface ISlideshowEditor {
export class ISlideshowEditor {
    editSlideIndex: string = "-1";
    heightUnit: HeightUnit = "REM";
    height: string = '16';
    innerPadding: PepSizeType = "md";
    isTransition: boolean = true;
    transitionDuration: number = 3;
    transitionType: TransitionType = 'fade';
    transitionTime: string = '2';
    isUseArrows: boolean = true;
    arrowType: ArrowType = 'arrow_right';
    arrowShape: ArrowShape = 'regular';
    arrowsStyle: PepStyleType= 'weak';
    arrowsColor: buttonColor= 'system-primary';
    usePauseButton: boolean = true;
    showOnMobile: boolean = true;
    useInverStyle: boolean = true;
    showControllersInSlider: boolean = true;
    controllerSize: PepSizeType = 'sm';
    dropShadow: DropShadow = new DropShadow();
}

export class ISlideEditor {
    id: number;
    useTitle: boolean = true;
    titleContent: string = 'Title';
    titleSize: PepSizeType = 'lg';
    titleWeight: FontWeight = 'normal';
    useSubTitle: boolean = true;
    subTitleContent: string = 'Sub title';
    subTitleSize: PepSizeType = 'md';
    contentWidth: WidthUnits = 'Regular';
    horizontalAlign: PepHorizontalAlignment = 'left';
    verticalAlign: PepVerticalAlignment = 'middle';
    innerSpacing: PepSizeType = "md";
    textColor: textColor = 'inverted';
    buttonsSize: PepSizeType  = 'md';
    buttonColor: buttonColor= 'system-primary';
    firstButton: SlideButton = new SlideButton();
    secondButton: SlideButton  = new SlideButton();
    gradientOverlay: Overlay = new Overlay(true, 'hsl(0, 100%, 0%)', '75');
    overlay: Overlay = new Overlay();
    image: SlideImage = new SlideImage();
}

export interface slide {
    id: string,
    Title?: string,
}

export interface ISlideShow{
    slideshowConfig: ISlideshowEditor,
    slides: Array<ISlideEditor>
}
 