import { PepStyleType, PepStyleStateType, PepSizeType, PepHorizontalAlignment, PepVerticalAlignment, PepScreenSizeType} from '@pepperi-addons/ngx-lib';
import { PageConfiguration } from '@pepperi-addons/papi-sdk';

export interface IHostObject {
    configuration: ISlideShow;
    // pageConfiguration?: PageConfiguration;
    // pageType?: any;
    // context?: any;
    // filter?: any;
}

export type HeightUnit = 'REM' | 'VH';
export type TransitionType = 'none' | 'fade' | 'zoom' | 'slide';
export type ArrowType = 'arrow_back_right' | 'arrow_left' | 'arrow_left_alt';
export type ArrowShape = 'none' | 'regular' | 'round';
export type WidthUnits = 'Narrow' | 'Regular' | 'Wide';
export type Intensity = 'Soft' | 'Regular';
export type textColor = 'system' | 'dimmed' | 'inverted' | 'strong';
export type buttonColor = 'system' | 'system-inverted' | 'primary' | 'secondary'

export class SlideButton {
    useButton: boolean = true;
    label: string = 'Button';
    linkTo: string = '';
    style: PepStyleStateType = 'system'
}

export class Overlay {
    useGradientOverlay: boolean = true;
    color: string = '#000';
    opacity: string = '100';
}

export class SlideImage {
    useImage: boolean = false;
    src: string = '';
    horizontalPosition: string = '0';
    verticalPosition: string = '0';
}

export class DropShadow {
    useDropShadow: boolean = true;
    intensity:  Intensity = 'Regular';
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
    arrowType: ArrowType = 'arrow_left';
    arrowShape: ArrowShape = 'regular';
    arrowsStyle: PepStyleType = 'regular';
    arrowsColor: PepStyleType = 'weak';
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
    useSubTitle: boolean = true;
    subTitleContent: string = 'Sub title';
    subTitleSize: PepSizeType = 'md';
    contentWidth: WidthUnits = 'Regular';
    horizontalAlign: PepHorizontalAlignment = 'left';
    verticalAlign: PepVerticalAlignment = 'middle';
    innerSpacing: PepSizeType = "md";
    textColor: textColor = 'inverted';
    buttonsSize: PepSizeType  = 'md';
    buttonsColor: buttonColor= 'system-inverted';
    firstButton: SlideButton = new SlideButton();
    secondButton: SlideButton  = new SlideButton();
    gradientOverlay: Overlay = new Overlay();
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
