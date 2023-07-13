import { Client, Context, IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { CLIENT_ACTION_ON_SLIDE_BUTTON_CLICK } from 'shared'
import { AddonUUID } from '../addon.config.json';
import { FlowObject, RunFlowBody } from '@pepperi-addons/cpi-node';

class SlidesowCpiService {
    
    constructor() {}

    /***********************************************************************************************/
    //                              Private functions
    /************************************************************************************************/
    
    private async getGallery(headerKey: string): Promise<any> {
     

        return {};
    }

    public  async getOptionsFromFlow(flowData: FlowObject, parameters: any, eventData: any): Promise<Array<{ Key: string, Title: string }>> {
        const res: any = { Options: [] };
        if (flowData?.FlowKey?.length > 0) {
            const dynamicParamsData: any = {};
            
            if (flowData.FlowParams) {
                const dynamicParams: any = [];

                // Get all dynamic parameters to set their value on the data property later.
                const keysArr = Object.keys(flowData.FlowParams);
                for (let index = 0; index < keysArr.length; index++) {
                    const key = keysArr[index];
                    
                    if (flowData.FlowParams[key].Source === 'Dynamic') {
                        dynamicParams.push(flowData.FlowParams[key].Value);
                    }
                }
                
                // Set the dynamic parameters values on the dynamicParamsData property.
                for (let index = 0; index < dynamicParams.length; index++) {
                    const param = dynamicParams[index];
                    dynamicParamsData[param] = parameters[param] || '';
                }
            }
        
            const flowToRun: RunFlowBody = {
                RunFlow: flowData,
                Data: dynamicParamsData,
            };

            // TODO: Remove one of the context properties.
            if (eventData.client?.context) {
                flowToRun['context'] = eventData;
                flowToRun['Context'] = eventData;
            }
            // Run the flow and return the options.
            const flowRes = await pepperi.flows.run(flowToRun);
            res.Options = flowRes?.Options || [];
        }

        return res.Options;
    }
    
    public async runFlowData(flowData, configuration){
        let res;
        const flow = JSON.parse(Buffer.from(flowData, 'base64').toString('utf8'));
        try{
            if(flow){
                const runFlowObject: FlowObject = {
                    FlowKey: flow.FlowKey,
                    FlowParams: {
                        onLoad: {
                            Source: 'Dynamic',
                            Value: 'configurationObj'
                        }
                    }
                }

                res = await pepperi.flows.run({
                   // The runFlow object
                   RunFlow: runFlowObject,
                    // dynamic parameters that will be set to the flow data
                    Data: {
                        configurationObj: configuration
                    },
                    // optional, but needed for executing client actions within flow
                    // this is taken from the interceptor data
                    context: undefined,
                });

            }
        }
        catch(err){
            res = {
                success: false,
                configuration: configuration
            }
        }

        return res;
    }

     /***********************************************************************************************/
    //                              Public functions
    /************************************************************************************************/


}
export default SlidesowCpiService;