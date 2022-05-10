import config from '../addon.config.json';
import { AddonDataScheme, Relation } from '@pepperi-addons/papi-sdk';

const blockName = 'Slideshow';

export const DimxRelations: Relation[] = [{
        AddonUUID: config.AddonUUID,
        Name: `${blockName}`,
        RelationName: 'DataImportResource',
        Type: 'AddonAPI',
        Description: `${blockName} Import Relation`,
        FixRelativeURL: "/api/import_mapping"
    },
    {
        AddonUUID: config.AddonUUID,
        Name: `${blockName}`,
        RelationName: 'DataExportResource',
        Type: 'AddonAPI',
        Description: `${blockName} Export Relation`,
        FixRelativeURL: "" // If MappingRelativeURL is empty, the mapping object will be an empty object.
    }];

export const SlideshowScheme: AddonDataScheme = {
    Name: '',
    Type: 'data',
    Fields: {
        'slideshowConfig': {
            'Type': 'Object',
            'Fields': {
                'heightUnit': {
                    'Type': 'String'
                },
                'height': {
                    'Type': 'String'
                },
                'innerPadding': {
                    'Type': 'String'
                },
                'isTransition': {
                    'Type': 'Bool'
                },
                'transitionDuration': {
                    'Type': 'Integer'
                },
                'transitionType': {
                    'Type': 'String'
                },
                'transitionTime': {
                    'Type': 'String'
                },
                'isUseArrows': {
                    'Type': 'Bool'
                },
                'arrowType': {
                    'Type': 'String'
                },
                'arrowShape': {
                    'Type': 'String'
                },
                'arrowsStyle': {
                    'Type': 'String'
                },
                'arrowsColor': {
                    'Type': 'String'
                },
                'usePauseButton': {
                    'Type': 'Bool'
                },
                'showOnMobile': {
                    'Type': 'Bool'
                },
                'useInverStyle': {
                    'Type': 'Bool'
                },
                'showControllersInSlider': {
                    'Type': 'Bool'
                },
                'controllerSize': {
                    'Type': 'String'
                },
                'dropShadow': { 
                    'Type': 'Object',
                    'Fields': {
                        'use': {
                            'Type': 'Bool'
                        },
                        'size': {
                            'Type': 'String' 
                        },
                        'intensity': {
                            'Type': 'String' 
                        }
                    }
                }
            } 
        } as any,
        'slides': {
            'Type': 'Array',
            'Items': {
                'Type': 'Object',
                'Fields': {
                    'useTitle': {
                        'Type': 'Bool'
                    },
                    'titleContent': {
                        'Type': 'String'
                    },
                    'titleSize': {
                        'Type': 'String'
                    },
                    'titleWeight': {
                        'Type': 'String'
                    },
                    'useSubTitle': {
                        'Type': 'Bool'
                    },
                    'subTitleContent': {
                        'Type': 'String'
                    },
                    'subTitleSize': {
                        'Type': 'String'
                    },
                    'contentWidth': {
                        'Type': 'String'
                    },
                    'horizontalAlign': {
                        'Type': 'String'
                    },
                    'verticalAlign': {
                        'Type': 'String'
                    },
                    'innerSpacing': {
                        'Type': 'String'
                    },
                    'textColor': {
                        'Type': 'String'
                    },
                    'buttonsSize': {
                        'Type': 'String'
                    },
                    'buttonColor': {
                        'Type': 'String'
                    },
                    'firstButton': {
                        'Type': 'Object',
                        'Fields': {
                            'useButton': {
                                'Type': 'Bool'
                            },
                            'label': {
                                'Type': 'String'
                            },
                            'script': {
                                'Type': 'Object',
                                 'Fields': {
                                    'Key': {
                                        'Type': 'String'
                                    },
                                    'Data': {
                                        'Type': 'Object',
                                        'Fields': {
                                            'TODO': 'ADD THE PARAMS'
                                        }
                                    }
                                }
                            },
                            'style': {
                                'Type': 'String'
                            }
                        }
                    },
                    'secondButton': {
                        'Type': 'Object',
                        'Fields': {
                            'useButton': {
                                'Type': 'Bool'
                            },
                            'label': {
                                'Type': 'String'
                            },
                            'script': {
                                'Type': 'Object',
                                 'Fields': {
                                    'Key': {
                                        'Type': 'String'
                                    },
                                    'Data': {
                                        'Type': 'Object',
                                        'Fields': {
                                            'TODO': 'ADD THE PARAMS'
                                        }
                                    }
                                }
                            },
                            'style': {
                                'Type': 'String'
                            }
                        }
                    },
                    'gradientOverlay': { 
                        'Type': 'Object',
                        'Fields': {
                            'use': {
                                'Type': 'Bool' 
                            },
                            'value': {
                                'Type': 'String' 
                            },
                            'opacity': {
                                'Type': 'Integer'
                            }
                        }
                    },
                    'overlay': { 
                        'Type': 'Object',
                        'Fields': {
                            'use': {
                                'Type': 'Bool'
                            },
                            'value': {
                                'Type': 'String' 
                            },
                            'opacity': {
                                'Type': 'Integer' 
                            }
                        }
                    },
                    'image': {
                        'Type': 'Object',
                        'Fields': {
                            'useImage': {
                                'Type': 'Bool'
                            },
                            'src': {
                                'Type': 'String' 
                            },
                            'horizontalPosition': {
                                'Type': 'String' 
                            },
                            'verticalPosition': {
                                'Type': 'String' 
                            }
                        }
                    }
                }
            }
        }        
    } as any
}


