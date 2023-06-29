import '@pepperi-addons/cpi-node'
export const router:any = Router()
import SlidesowCpiService from './slideshow-cpi.service';
import path from 'path';
import { CLIENT_ACTION_ON_SLIDE_BUTTON_CLICKED, CLIENT_ACTION_ON_SLIDESHOW_LOAD } from 'shared'

router.post('/prepare_assets', async (req, res)=>{
    const configuration = req.body.Configuration;
    if(!(await pepperi['environment'].isWebApp())) {
        const Slides = configuration.Data.Slides as any[];
        await Promise.all(Slides.map(async (slide) => {
            // overwrite the slides assetURL with the local file path
            return slide.Image.AssetUrl = await getFilePath(slide.image)
        }))
        configuration.Data.Slides = Slides;
    }
    res.json({Configuration: configuration});
});

async function getFilePath(slide) {
    let fileUrl;
        try {
            const res = await pepperi.addons.pfs.uuid("ad909780-0c23-401e-8e8e-f514cc4f6aa2").schema("Assets").key(slide.AssetKey).get();
            fileUrl = res.URL;
            console.log(fileUrl);
            }
        catch (error) {
            console.error(error);
            fileUrl = fixURLIfNeeded(slide.AssetUrl);        
        }
    //}
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
pepperi.events.intercept(CLIENT_ACTION_ON_SLIDE_BUTTON_CLICKED as any, {}, async (data): Promise<any> => {
    const cpiService = new SlidesowCpiService();
    const res = cpiService.runFlowData(data.flow);
    return res;
});

pepperi.events.intercept(CLIENT_ACTION_ON_SLIDESHOW_LOAD as any, {}, async (data): Promise<any> => {
    const cpiService = new SlidesowCpiService();
    const res = cpiService.runFlowData(data);
    return res;
});
/***********************************  client events ends /***********************************/

