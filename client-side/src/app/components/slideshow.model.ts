import { PepStyleType, PepStyleStateType, PepSizeType, PepHorizontalAlignment, PepVerticalAlignment, PepScreenSizeType} from '@pepperi-addons/ngx-lib';

export type HeightUnit = 'REM' | 'VH';
export type TransitionType = 'fade' | 'blur' | 'dissolve' | 'iris';
export type ArrowType = 'arrow_back' | 'arrow_left' | 'arrow_left_alt';
export type ArrowShape = 'None' | 'Rect' | 'Rounded';
export type WidthUnits = 'Narrow' | 'Regular' | 'Wide';
export type Intensity = 'Soft' | 'Regular';
export type textColor = 'system' | 'dimmed' | 'inverted' | 'strong';
export type buttonColor = 'system' | 'system-inverted' | 'primary' | 'secondary'

export class SlideButton {
    useButton: boolean = true;
    label: string = '1st button';
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
    useDropShadow: boolean = false;
    intensity:  Intensity = 'Regular';
}


//export interface ISlideshowEditor {
export class ISlideshowEditor {
    editSlideIndex: string = "-1";
    heightUnit: HeightUnit = "REM";
    height: string = '16';
    innerPadding: PepSizeType = "md";
    isTransition: boolean = false;
    transitionDuration: number = 10;
    transitionType: TransitionType = 'fade';
    transitionTime: string = '3s';
    isUseArrows: boolean = true;
    arrowType: ArrowType = 'arrow_back';
    arrowShape: ArrowShape = 'Rect';
    arrowsStyle: PepStyleType = 'regular';
    arrowsColor: PepStyleType = 'weak';
    useControllers: boolean = true;
    usePauseButton: boolean = true;
    showOnMobile: boolean = true;
    useInverStyle: boolean = true;
    showControllersInSlider: boolean = true;
    controllerSize: HeightUnit
}

export class ISlideEditor {
    id: number;
    useTitle: boolean = false;
    titleContent: string = 'Title';
    titleSize: PepSizeType = 'lg';
    useSubTitle: boolean = false;
    subTitleContent: string;
    subTitleSize: PepSizeType = 'md';
    contentWidth: WidthUnits = 'Regular';
    horizontalAlign: PepHorizontalAlignment = 'left';
    verticalAlign: PepVerticalAlignment = 'middle';
    innerSpacing: PepSizeType = "md";
    textColor: textColor = 'system';
    buttonsSize: PepSizeType  = 'md';
    buttonsColor: buttonColor= 'system';
    firstButton: SlideButton = new SlideButton();
    secondButton: SlideButton  = new SlideButton();
    gradientOverlay: Overlay = new Overlay();
    overlay: Overlay = new Overlay();
    image: SlideImage = new SlideImage();
    dropShadow: DropShadow = new DropShadow();
}

export interface slide {
    id: string,
    Title?: string,
}

export interface ISlideShow{
    slideshowConfig: ISlideshowEditor,
    slides: Array<ISlideEditor>
}
