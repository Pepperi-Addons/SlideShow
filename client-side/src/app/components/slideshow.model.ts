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
export type DisplayStates = 'show' | 'hide'; 

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

export class Structure {
    Unit: HeightUnit;
    FillHeight: boolean;
    Height: string;
    InnerPadding: PepSizeType = "md";

    constructor(unit: HeightUnit = "REM", fillHeight: boolean = false, height: string = '16', innerPadding: PepSizeType = 'md' ){
        this.Unit = unit;
        this.FillHeight = fillHeight;
        this.Height = height;
        this.InnerPadding = innerPadding;
    }
}

export class Corners {
    Use: boolean = false;
    Size: PepSizeType = 'md';
}

export class Transition {
    Use: boolean = true;
    Duration: number = 5;
    Type: TransitionType = 'fade';
    Time: string = '0.75';
}

export class Arrows {
    Use: boolean = true;
    Type: ArrowType = 'arrow_right';
    Shape: ArrowShape = 'round';
    Style: PepStyleType= 'weak';
    Display: DisplayStates = 'show';
    Color: buttonColor= 'system';
}

export class Controllers {
    ShowInSlider: boolean = true;
    Display: DisplayStates = 'show';
    Size: PepSizeType = 'md';
    Style: PepStyleType= 'weak';
    ShowPause: boolean = true;
}

//export interface ISlideshowEditor {
export class ISlideshowEditor {
    EditSlideIndex: string = "-1";
    Structure: Structure = new Structure('REM', false, '16', 'md');
    Transition: Transition = new Transition();
    Arrows: Arrows = new Arrows();
    Controllers: Controllers = new Controllers();
    DropShadow: PepShadowSettings = new PepShadowSettings(false,'md','soft');
    //HeightUnit: HeightUnit = "REM";
    //FillHeight: boolean = false;
    //height: string = '16';
    //innerPadding: PepSizeType = "md";
    //IsTransition: boolean = true;
    //transitionDuration: number = 5;
    //transitionType: TransitionType = 'fade';
    //transitionTime: string = '0.75';
    //isUseArrows: boolean = true;
    //arrowType: ArrowType = 'arrow_right';
    //arrowShape: ArrowShape = 'round';
    //arrowsStyle: PepStyleType= 'weak';
    //arrowsDisplay: DisplayStates = 'show';
    //arrowsColor: buttonColor= 'system';
    //usePauseButton: boolean = true;
    //showControllersInSlider: boolean = true;
    //controllersDisplay: DisplayStates = 'show';
    //controllerSize: PepSizeType = 'md';
    //controllerStyle: PepStyleType= 'weak';
    //dropShadow: PepShadowSettings = new PepShadowSettings(false,'md','soft');
    //useRoundCorners: boolean = false;
    //roundCornersSize: PepSizeType = 'md';
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
 