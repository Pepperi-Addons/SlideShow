import '@pepperi-addons/cpi-node'
export const router:any = Router()
import SlidesowCpiService from './slideshow-cpi.service';
import path from 'path';
import { CLIENT_ACTION_ON_SLIDE_BUTTON_CLICK } from 'shared'

router.post('/prepare_assets', async (req, res)=>{
    let configuration = req.body.Configuration;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if(configuration?.Data?.SlideshowConfig?.OnLoadFlow){
        const cpiService = new SlidesowCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const res: any = await cpiService.getOptionsFromFlow(configuration?.Data.SlideshowConfig.OnLoadFlow, {onLoad: configuration}, req.context );
        configuration = res?.configuration || configuration;
    }

   /* if(!(await pepperi['environment'].isWebApp())) {
        let Slides = configuration.Data.Slides as any[];
        if(Slides.length){
            await Promise.all(Slides.map(async (slide) => {
                // overwrite the slides assetURL with the local file path
                return slide.Image.AssetUrl = await getFilePath(slide.Image)
            }))
            
            configuration.Data.Slides = Slides;
         }
    }*/

    res.json({Configuration: configuration});
});

async function getFilePath(image) {
    let fileUrl;
    const assetKey = image.AssetKey;
   
    try {
            const res = await pepperi.addons.pfs.uuid("ad909780-0c23-401e-8e8e-f514cc4f6aa2").schema("Assets").key(assetKey).get();
            fileUrl = res.URL;
        }
        catch (error) {
           fileUrl = fixURLIfNeeded(image.AssetUrl);        
        }
    return fileUrl;
}

function fixURLIfNeeded(url) {
    // "'https://pfs.pepperi.com/2234563d-b17b-4ace-b836-916b039504ae/ad909780-0c23-401e-8e8e-f514cc4f6aa2/Assets/nof3.jpeg'"
    // remove the ' from the start and the end of the string only if they exist
    if (url.startsWith("'") && url.endsWith("'")) {
        url = url.substring(1, url.length - 1);
    }
    return url;
}

export async function load(configuration: any) {
    
}

/**********************************  client events starts /**********************************/
pepperi.events.intercept(CLIENT_ACTION_ON_SLIDE_BUTTON_CLICK as any, {}, async (data): Promise<any> => {
    const cpiService = new SlidesowCpiService();
    const res = await cpiService.getOptionsFromFlow(data.flow, data.parameters, data );
    return res;
});

/***********************************  client events ends /***********************************/

