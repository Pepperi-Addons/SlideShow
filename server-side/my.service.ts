import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

class MyService {
    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.AddonUUID
        });
    }

    // getRelations(relationName: string): Promise<any> {
    //     return this.papiClient.get(`/addons/data/relations?where=RelationName=${relationName}`);
    // }

    upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }

    async importDataSource(body) {
        console.log(`@@@@importing Slideshow: ${JSON.stringify(body)}@@@@`);
        body.DIMXObjects = await Promise.all(body.DIMXObjects.map(async (item) => {
            // TODO - NEED TO CHANGE THE OBJET TO RETURN.
            // For example item.Object.Key = "TODO 123"
            return item;
        }));
        console.log('returned object is:', JSON.stringify(body));
        return body;
    }
  

    async exportDataSource(body: any): Promise<any> {
        const res = await this.getDIMXResult(body, false);
        return res;
    }

    private async getDIMXResult(body: any, isImport: boolean): Promise<any> {
        // Validate the pages.
        if (body.DIMXObjects?.length > 0) {
            console.log('@@@@@@@@ getDIMXResult - enter ', JSON.stringify(body));
            console.log('@@@@@@@@ getDIMXResult - isImport = ', isImport);

            for (let index = 0; index < body.DIMXObjects.length; index++) {
                const dimxObject = body.DIMXObjects[index];
                try {
                    //const page = await this.validateAndOverridePageAccordingInterface(dimxObject['Object'], isImport);
                    
                    // For import always generate new Key and set the Hidden to false.
                    if (isImport) {
                        //page.Key = uuidv4(); // This step happans in the importMappingPages function
                        //page.Hidden = false;
                    }
                    //dimxObject['Object'] = page;
                } catch (err) {
                    // Set the error on the page.
                    dimxObject['Status'] = 'Error';
                    dimxObject['Details'] = err;
                }
            }

            console.log('@@@@@@@@ getDIMXResult - exit ', JSON.stringify(body));
        }
        
        return body;
    }
}

export default MyService;