import '@pepperi-addons/cpi-node'
export const router:any = Router()
import path from 'path';

router.post('/prepare_assets', async (req, res)=>{
    const configuration = req.body.Configuration;
    if(!(await pepperi['environment'].isWebApp())) {
        const slides = configuration.Data.slides as any[];
        await Promise.all(slides.map(async (slide) => {
            // overwrite the slides assetURL with the local file path
            return slide.image.assetURL = await getFilePath(slide.image.assetURL)
        }))
        configuration.Data.slides = slides;
    }
    res.json({Configuration: configuration});
});

async function getFilePath(url) {
    let fileUrl;
    // url =  "'https://pfs.pepperi.com/2234563d-b17b-4ace-b836-916b039504ae/ad909780-0c23-401e-8e8e-f514cc4f6aa2/Assets/bibi.jpeg';
    // check if the url is a valid url
    const fixedURL = fixURLIfNeeded(url);
    if (fixedURL && fixedURL.startsWith('http')) {
        const filePath = new URL(fixedURL).pathname;
        const fileName = path.basename(filePath);
        try {
            const res = await pepperi.addons.pfs.uuid("ad909780-0c23-401e-8e8e-f514cc4f6aa2").schema("Assets").key(fileName).get();
            fileUrl = res.URL;
            }
        catch (error) {
            console.error(error);
            fileUrl = url;        
        }
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

