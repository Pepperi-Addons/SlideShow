import { PepStyleType, PepSizeType, PepHorizontalAlignment, PepVerticalAlignment, PepScreenSizeType} from '@pepperi-addons/ngx-lib';
import { PepShadowSettings} from "@pepperi-addons/ngx-composite-lib/shadow-settings";
import { PepColorSettings } from "@pepperi-addons/ngx-composite-lib/color-settings";
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
export type buttonColor = 'system-primary' | 'invert' | 'user-primary' | 'success' | 'caution' | 'system' ;

export class SlideButton {
    useButton: boolean;
    label: string = 'Button';
    script: any = {};
    style: PepStyleType;

    constructor(useButton = true, label = 'Yess', style: PepStyleType = 'weak-invert') {
        this.useButton = useButton;
        this.label = label;
        this.style = style;
      }
}

export class SlideImage {
    useImage: boolean = false;
    asset: string = '';
    assetURL: string = '';
    horizontalPosition: string = '50';
    verticalPosition: string = '50';
}

//export interface ISlideshowEditor {
export class ISlideshowEditor {
    editSlideIndex: string = "-1";
    heightUnit: HeightUnit = "REM";
    fillHeight: boolean = false;
    height: string = '16';
    innerPadding: PepSizeType = "md";
    isTransition: boolean = true;
    transitionDuration: number = 5;
    transitionType: TransitionType = 'fade';
    transitionTime: string = '0.75';
    isUseArrows: boolean = true;
    arrowType: ArrowType = 'arrow_right';
    arrowShape: ArrowShape = 'round';
    arrowsStyle: PepStyleType= 'weak';
    arrowsColor: buttonColor= 'system';
    usePauseButton: boolean = true;
    showOnMobile: boolean = false;
    useInverStyle: boolean = true;
    showControllersInSlider: boolean = true;
    controllerSize: PepSizeType = 'md';
    dropShadow: PepShadowSettings = new PepShadowSettings(false,'md','soft');
    useRoundCorners: boolean = false;
    roundCornersSize: PepSizeType = 'md';
}

export class ISlideEditor {
    id: number;
    useTitle: boolean = true;
    titleContent: string = 'Title';
    titleSize: PepSizeType = 'md';
    titleWeight: FontWeight = 'normal';
    useSubTitle: boolean = true;
    subTitleContent: string = 'Sub title';
    subTitleSize: PepSizeType = 'md';
    contentWidth: WidthUnits = 'Regular';
    horizontalAlign: PepHorizontalAlignment = 'left';
    verticalAlign: 'start' | 'middle' | 'end' = 'start';//  PepVerticalAlignment = 'middle';
    innerSpacing: PepSizeType = "md";
    textColor: textColor = 'inverted';
    buttonsSize: PepSizeType  = 'md';
    buttonColor: buttonColor= 'system-primary';
    firstButton: SlideButton = new SlideButton(true, 'Yess', 'weak-invert');
    secondButton: SlideButton  = new SlideButton(false, 'Noo', 'strong');
    gradientOverlay: PepColorSettings = new PepColorSettings(true, 'hsl(0, 100%, 50%)', 75);
    overlay: PepColorSettings = new PepColorSettings(true, 'hsl(0, 0%, 0%)', 75);
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
 