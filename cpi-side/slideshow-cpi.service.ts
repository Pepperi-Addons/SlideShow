import { Client, Context, IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { CLIENT_ACTION_ON_SLIDE_BUTTON_CLICKED, CLIENT_ACTION_ON_SLIDESHOW_LOAD } from 'shared'
import { AddonUUID } from '../addon.config.json';

class SlidesowCpiService {
    
    constructor() {}

    /***********************************************************************************************/
    //                              Private functions
    /************************************************************************************************/
    
    private async getGallery(headerKey: string): Promise<any> {
     

        return {};
    }

    public async runFlowData(flowData, context){

        let res;
        try{
                const flow = JSON.parse(Buffer.from(flowData, 'base64').toString('utf8'));
                //todo - change to pepperi.flows(script.ScriptKey).run
                res = await pepperi.scripts.key(flow.Key).run(flow.FlowData, context);
        }
        catch(err){
            res = {
                success: false
            }
        }

        return res;
    }


     /***********************************************************************************************/
    //                              Public functions
    /************************************************************************************************/


}
export default SlidesowCpiService;