
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/
const SLIDESHOW_TABLE_NAME = '';

import { Client, Request } from '@pepperi-addons/debug-server'
import { Relation } from '@pepperi-addons/papi-sdk';
import MyService from './my.service';
import { blockName, DimxRelations, SlideshowScheme } from './metadata';
import { servicesVersion } from 'typescript';
 
 

export async function install(client: Client, request: Request): Promise<any> {

    const slideshowRelationsRes = await runMigration(client);
    const dimxRes = await createDimxRelations(client);
    const dimxSchemeRes = await addDimxScheme(client);
   
    return {
        success: slideshowRelationsRes.success && dimxRes.success && dimxSchemeRes.success,
        errorMessage: `slideshowRelationsRes: ${slideshowRelationsRes.errorMessage}, userDeviceResourceRes: ${dimxRes.errorMessage}, userDeviceResourceRes: ${dimxSchemeRes.errorMessage}`
    };
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    const slideshowRelationsRes = await runMigration(client);
    const dimxRes = await createDimxRelations(client);
    const dimxSchemeRes = await addDimxScheme(client);
   
    return {
        success: slideshowRelationsRes.success && dimxRes.success && dimxSchemeRes.success,
        errorMessage: `slideshowRelationsRes: ${slideshowRelationsRes.errorMessage}, userDeviceResourceRes: ${dimxRes.errorMessage}, userDeviceResourceRes: ${dimxSchemeRes.errorMessage}`
    };
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

async function runMigration(client){
    try {
        const pageComponentRelation: Relation = {
            RelationName: "PageBlock",
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: blockName.toLowerCase(),
            ComponentName: `${blockName}Component`,
            ModuleName: `${blockName}Module`,
            EditorComponentName: `${blockName}EditorComponent`,
            EditorModuleName: `${blockName}EditorModule`,
            ElementsModule: 'WebComponents',
            ElementName: `slideshow-element-${client.AddonUUID}`,
            EditorElementName: `slideshow-editor-element-${client.AddonUUID}`,
            Schema: {
                "Fields": {
                    "slideshowConfig": {
                        "Type": "Object",
                        "Fields": {
                            "heightUnit": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "height": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "innerPadding": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            /*"isTransition": {
                                "Type": "Bool",
                                "ConfigurationPerScreenSize": true
                            },
                            "transitionDuration": {
                                "Type": "Integer",
                                "ConfigurationPerScreenSize": true
                            },
                            "transitionType": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "transitionTime": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "isUseArrows": {
                                "Type": "Bool",
                                "ConfigurationPerScreenSize": true
                            },
                            "arrowType": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "arrowShape": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "arrowsStyle": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "arrowsColor": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "usePauseButton": {
                                "Type": "Bool",
                                "ConfigurationPerScreenSize": true
                            },
                            "hideOnMobile": {
                                "Type": "Bool",
                                "ConfigurationPerScreenSize": true
                            },
                            "useInverStyle": {
                                "Type": "Bool",
                                "ConfigurationPerScreenSize": true
                            },
                            "showControllersInSlider": {
                                "Type": "Bool",
                                "ConfigurationPerScreenSize": true
                            },
                            "controllerSize": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "dropShadow": { 
                                "Type": "Object",
                                "Fields": {
                                    "use": {
                                        "Type": "Bool",
                                        "ConfigurationPerScreenSize": true, 
                                    },
                                    "size": {
                                        "Type": "String",
                                        "ConfigurationPerScreenSize": true, 
                                    },
                                    "intensity": {
                                        "Type": "String",
                                        "ConfigurationPerScreenSize": true, 
                                    }
                                }
                            }*/
                        }
                    },
                    "slides": {
                        "Type": "Array",
                        "Items": {
                            "Type": "Object",
                            "Fields": {
                                /*"useTitle": {
                                    "Type": "Bool",
                                    "ConfigurationPerScreenSize": true
                                },
                                "titleContent": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },*/
                                "titleSize": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                /*"titleWeight": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                "useSubTitle": {
                                    "Type": "Bool",
                                    "ConfigurationPerScreenSize": true
                                },
                                "subTitleContent": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },*/
                                "subTitleSize": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                "contentWidth": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                "horizontalAlign": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                "verticalAlign": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                /*"innerSpacing": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                "textColor": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },*/
                                "buttonsSize": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                /*"buttonColor": {
                                    "Type": "String",
                                    "ConfigurationPerScreenSize": true
                                },
                                "firstButton": {
                                    "Type": "Object",
                                    "Fields": {
                                        "useButton": {
                                            "Type": "Bool",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "label": {
                                            "Type": "String",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "script": {
                                            "Type": "Object",
                                             "Fields": {
                                                "Key": {
                                                    "Type": "String",
                                                    "ConfigurationPerScreenSize": false, 
                                                },
                                                "Data": {
                                                    "Type": "Object",
                                                    "Fields": {
                                                        "TODO - ADD THE PARAMS"
                                                    }
                                                }
                                        },
                                        "style": {
                                            "Type": "String",
                                            "ConfigurationPerScreenSize": true, 
                                        }
                                    }
                                },
                                "secondButton": {
                                    "Type": "Object",
                                    "Fields": {
                                        "useButton": {
                                            "Type": "Bool",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "label": {
                                            "Type": "String",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "script": {
                                            "Type": "Object",
                                             "Fields": {
                                                "Key": {
                                                    "Type": "String",
                                                    "ConfigurationPerScreenSize": false, 
                                                },
                                                "Data": {
                                                    "Type": "Object",
                                                    "Fields": {
                                                        "TODO - ADD THE PARAMS"
                                                    }
                                                }
                                        },
                                        "style": {
                                            "Type": "String",
                                            "ConfigurationPerScreenSize": true, 
                                        }
                                    }
                                },
                                "gradientOverlay": { 
                                    "Type": "Object",
                                    "Fields": {
                                        "use": {
                                            "Type": "Bool",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "value": {
                                            "Type": "String",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "opacity": {
                                            "Type": "Integer",
                                            "ConfigurationPerScreenSize": true, 
                                        }
                                    }
                                },
                                "overlay": { 
                                    "Type": "Object",
                                    "Fields": {
                                        "use": {
                                            "Type": "Bool",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "value": {
                                            "Type": "String",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "opacity": {
                                            "Type": "Integer",
                                            "ConfigurationPerScreenSize": true, 
                                        }
                                    }
                                },*/
                                "image": {
                                    "Type": "Object",
                                    "Fields": {
                                        "useImage": {
                                            "Type": "Bool",
                                            "ConfigurationPerScreenSize": false, 
                                        },
                                        "asset": {
                                            "Type": "Resource",
                                            "Fields": {
                                                "url": {
                                                    "Type": "String"
                                                },
                                                "key": {
                                                    "Type": "String"
                                                }
                                            },
                                            "ConfigurationPerScreenSize": false, 
                                        },
                                        "horizontalPosition": {
                                            "Type": "String",
                                            "ConfigurationPerScreenSize": true, 
                                        },
                                        "verticalPosition": {
                                            "Type": "String",
                                            "ConfigurationPerScreenSize": true, 
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
             }
        }; 
        
        const service = new MyService(client);
        const result = await service.upsertRelation(pageComponentRelation);
        return {success:true, errorMessage: '' };
    } catch(e) {
        return { success: false, errorMessage: e || '' };
    }
}

async function createDimxRelations(client) {
    
    let relations: Relation[] = DimxRelations;
    let relationName = '';

    try {
        const service = new MyService(client);

        relations.forEach(async (relation) => {
            relationName = relation.RelationName;
            const result = await service.upsertRelation(relation);
        });
        return {
            success: true,
            errorMessage: ''
        }
    }
    catch (err) {
        return {
            success: false,
            errorMessage: relationName + ' ' + (err ? err : 'Unknown Error Occured'),
        }
    }
}

async function addDimxScheme(client) {
    try {
        const service = new MyService(client);
        service.papiClient.addons.data.schemes.post(SlideshowScheme);
        return {
            success: true,
            errorMessage: ''
        }
    }
    catch (err) {
            return {
                success: false,
                errorMessage: `Error in creating slideshow scheme for dimx . error - ${err}`
            }
    }
}


