import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'

// add functions here
// this function will run on the 'api/foo' endpoint
// the real function is runnning on another typescript file
export async function foo(client: Client, request: Request) {
    // const service = new MyService(client)
    // const res = await service.getAddons()
    // return res
};

export function export_mapping(client: Client, request: Request) {
    
    if (request.method == 'POST') {
        let body = request.body;
        console.log(`exporting gallery: ${JSON.stringify(body)}`);
        return body; 
    }
    else if (request.method == 'GET') {
        throw new Error(`Method ${request.method} not supported`);       
    }
}

export function import_mapping(client: Client, request: Request) {

    if (request.method == 'POST') {
        let body = request.body;
        console.log(`import gallery: ${JSON.stringify(body)}`);
        return body; 
    }
    else if (request.method == 'GET') {
        throw new Error(`Method ${request.method} not supported`);       
    }
}

