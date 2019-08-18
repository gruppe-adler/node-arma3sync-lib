import {A3sEvents} from 'src/model/a3sEventsDto';

test('serialize event', () => {
    const jEvents = new A3sEvents({
        list: [
            {
                name: 'foo',
                description: 'foo desc',
                addonNames: {},
                userconfigFolderNames: {}
            },
            {
                name: 'bar',
                description: 'bar desc',
                addonNames: {
                    '@tfar_autoswitch': false,
                    'GM': false,
                },
                userconfigFolderNames: {}
            }
        ]
    });

    expect(jEvents.asJava()).toEqual({
        '$': {
            'list': {
                '$': {
                    'capacity': 2,
                    'size': 2
                },
                '$class': {
                    'fields': [{
                        'name': 'size',
                        'type': 'I'
                    }],
                    'flags': 3,
                    'name': 'java.util.ArrayList',
                    'serialVersionUID': '8683452581122892189',
                    'superClass': null
                },
                '_$': [{
                    '$': {
                        'addonNames': {
                            '$': {
                                'loadFactor': 0.75,
                                'threshold': 0
                            },
                            '$class': {
                                'fields': [{
                                    'name': 'loadFactor',
                                    'type': 'F'
                                }, {
                                    'name': 'threshold',
                                    'type': 'I'
                                }],
                                'flags': 3,
                                'name': 'java.util.HashMap',
                                'serialVersionUID': '362498820763181265',
                                'superClass': null
                            },
                            '_$': {}
                        },
                        'description': 'foo desc',
                        'name': 'foo',
                        'userconfigFolderNames': {
                            '$': {
                                'loadFactor': 0.75,
                                'threshold': 0
                            },
                            '$class': {
                                'fields': [{
                                    'name': 'loadFactor',
                                    'type': 'F'
                                }, {
                                    'name': 'threshold',
                                    'type': 'I'
                                }],
                                'flags': 3,
                                'name': 'java.util.HashMap',
                                'serialVersionUID': '362498820763181265',
                                'superClass': null
                            },
                            '_$': {}
                        }
                    },
                    '$class': {
                        'fields': [{
                            'classname': 'Ljava/util/Map;',
                            'name': 'addonNames',
                            'type': 'L'
                        }, {
                            'classname': 'Ljava/lang/String;',
                            'name': 'description',
                            'type': 'L'
                        }, {
                            'classname': 'Ljava/lang/String;',
                            'name': 'name',
                            'type': 'L'
                        }, {
                            'classname': 'Ljava/util/Map;',
                            'name': 'userconfigFolderNames',
                            'type': 'L'
                        }],
                        'flags': 2,
                        'name': 'fr.soe.a3s.domain.repository.Event',
                        'serialVersionUID': '7456226002765813117',
                        'superClass': null
                    }
                }, {
                    '$': {
                        'addonNames': {
                            '$': {
                                'loadFactor': 0.75,
                                'threshold': 12
                            },
                            '$class': {
                                'fields': [{
                                    'name': 'loadFactor',
                                    'type': 'F'
                                }, {
                                    'name': 'threshold',
                                    'type': 'I'
                                }],
                                'flags': 3,
                                'name': 'java.util.HashMap',
                                'serialVersionUID': '362498820763181265',
                                'superClass': null
                            },
                            '_$': {
                                '@tfar_autoswitch': {
                                    '$': {
                                        'value': false
                                    },
                                    '$class': {
                                        'fields': [{
                                            'type': 'Z',
                                            'name': 'value'
                                        }],
                                        'flags': 2,
                                        'name': 'java.lang.Boolean',
                                        'serialVersionUID': '-3665804199014368530',
                                        'superClass': null
                                    }
                                },
                                'GM': {
                                    '$': {
                                        'value': false
                                    },
                                    '$class': {
                                        'fields': [{
                                            'type': 'Z',
                                            'name': 'value'
                                        }],
                                        'flags': 2,
                                        'name': 'java.lang.Boolean',
                                        'serialVersionUID': '-3665804199014368530',
                                        'superClass': null
                                    }
                                }
                            }
                        },
                        'description': 'bar desc',
                        'name': 'bar',
                        'userconfigFolderNames': {
                            '$': {
                                'loadFactor': 0.75,
                                'threshold': 0
                            },
                            '$class': {
                                'fields': [{
                                    'name': 'loadFactor',
                                    'type': 'F'
                                }, {
                                    'name': 'threshold',
                                    'type': 'I'
                                }],
                                'flags': 3,
                                'name': 'java.util.HashMap',
                                'serialVersionUID': '362498820763181265',
                                'superClass': null
                            },
                            '_$': {}
                        }
                    },
                    '$class': {
                        'fields': [{
                            'classname': 'Ljava/util/Map;',
                            'name': 'addonNames',
                            'type': 'L'
                        }, {
                            'classname': 'Ljava/lang/String;',
                            'name': 'description',
                            'type': 'L'
                        }, {
                            'classname': 'Ljava/lang/String;',
                            'name': 'name',
                            'type': 'L'
                        }, {
                            'classname': 'Ljava/util/Map;',
                            'name': 'userconfigFolderNames',
                            'type': 'L'
                        }],
                        'flags': 2,
                        'name': 'fr.soe.a3s.domain.repository.Event',
                        'serialVersionUID': '7456226002765813117',
                        'superClass': null
                    }
                }]
            }
        },
        '$class': {
            'fields': [{
                'classname': 'Ljava/util/List;',
                'name': 'list',
                'type': 'L'
            }],
            'flags': 2,
            'name': 'fr.soe.a3s.domain.repository.Events',
            'serialVersionUID': '-5141643688299352462',
            'superClass': null
        }
    })
});
