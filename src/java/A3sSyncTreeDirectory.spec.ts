import {serializeA3sSyncTreeDirectory} from './A3sSyncTreeDirectory';
import {serializeA3sSyncTreeLeaf} from './A3sSyncTreeLeaf';

const exampleSerialized = {
    '$': {
        'deleted': false,
        'hidden': false,
        'markAsAddon': false,
        'updated': false,
        'list': {
            '$': {
                'size': 1,
                'capacity': 1
            },
            '$class': {
                'name': 'java.util.ArrayList',
                'serialVersionUID': '8683452581122892189',
                'flags': 3,
                'fields': [{
                    'type': 'I',
                    'name': 'size'
                }],
                'superClass': null
            },
            '_$': [{
                '$': {
                    'deleted': false,
                    'hidden': false,
                    'markAsAddon': true,
                    'updated': false,
                    'list': {
                        '$': {
                            'size': 1,
                            'capacity': 1
                        },
                        '$class': {
                            'name': 'java.util.ArrayList',
                            'serialVersionUID': '8683452581122892189',
                            'flags': 3,
                            'fields': [{
                                'type': 'I',
                                'name': 'size'
                            }],
                            'superClass': null
                        },
                        '_$': [{
                            '$': {
                                'deleted': false,
                                'hidden': false,
                                'markAsAddon': false,
                                'updated': false,
                                'list': {
                                    '$': {
                                        'size': 1,
                                        'capacity': 1
                                    },
                                    '$class': {
                                        'name': 'java.util.ArrayList',
                                        'serialVersionUID': '8683452581122892189',
                                        'flags': 3,
                                        'fields': [{
                                            'type': 'I',
                                            'name': 'size'
                                        }],
                                        'superClass': null
                                    },
                                    '_$': [{
                                        '$': {
                                            'compressed': false,
                                            'compressedSize': 0,
                                            'deleted': false,
                                            'size': 151887,
                                            'updated': false,
                                            'name': 'ace_advanced_ballistics.pbo',
                                            'sha1': '5c577a28f826972165fe2f16fa66298e66ef867d'
                                        },
                                        '$class': {
                                            'name': 'fr.soe.a3s.domain.repository.SyncTreeLeaf',
                                            'serialVersionUID': '8849248143660225239',
                                            'flags': 2,
                                            'fields': [{
                                                'type': 'Z',
                                                'name': 'compressed'
                                            }, {
                                                'type': 'J',
                                                'name': 'compressedSize'
                                            }, {
                                                'type': 'Z',
                                                'name': 'deleted'
                                            }, {
                                                'type': 'J',
                                                'name': 'size'
                                            }, {
                                                'type': 'Z',
                                                'name': 'updated'
                                            }, {
                                                'type': 'L',
                                                'name': 'name',
                                                'classname': 'Ljava/lang/String;'
                                            }, {
                                                'type': 'L',
                                                'name': 'parent',
                                                'classname': 'Lfr/soe/a3s/domain/repository/SyncTreeDirectory;'
                                            }, {
                                                'type': 'L',
                                                'name': 'sha1',
                                                'classname': 'Ljava/lang/String;'
                                            }],
                                            'superClass': null
                                        }
                                    }],
                                },
                                'name': 'addons',
                            },
                            '$class': {
                                'name': 'fr.soe.a3s.domain.repository.SyncTreeDirectory',
                                'serialVersionUID': '-2855304993780573704',
                                'flags': 2,
                                'fields': [
                                    {
                                        'type': 'Z',
                                        'name': 'deleted'
                                    },
                                    {
                                        'type': 'Z',
                                        'name': 'hidden'
                                    },
                                    {
                                        'type': 'Z',
                                        'name': 'markAsAddon'
                                    },
                                    {
                                        'type': 'Z',
                                        'name': 'updated'
                                    },
                                    {
                                        'type': 'L',
                                        'name': 'list',
                                        'classname': 'Ljava/util/List;'
                                    },
                                    {
                                        'type': 'L',
                                        'name': 'name',
                                        'classname': 'Ljava/lang/String;'
                                    },
                                    {
                                        'type': 'L',
                                        'name': 'parent',
                                        'classname': 'Lfr/soe/a3s/domain/repository/SyncTreeDirectory;'
                                    }
                                ],
                                'superClass': null
                            }
                        }],
                    },
                    'name': '@ace'
                },
                '$class': {
                    'name': 'fr.soe.a3s.domain.repository.SyncTreeDirectory',
                    'serialVersionUID': '-2855304993780573704',
                    'flags': 2,
                    'fields': [
                        {
                            'type': 'Z',
                            'name': 'deleted'
                        },
                        {
                            'type': 'Z',
                            'name': 'hidden'
                        },
                        {
                            'type': 'Z',
                            'name': 'markAsAddon'
                        },
                        {
                            'type': 'Z',
                            'name': 'updated'
                        },
                        {
                            'type': 'L',
                            'name': 'list',
                            'classname': 'Ljava/util/List;'
                        },
                        {
                            'type': 'L',
                            'name': 'name',
                            'classname': 'Ljava/lang/String;'
                        },
                        {
                            'type': 'L',
                            'name': 'parent',
                            'classname': 'Lfr/soe/a3s/domain/repository/SyncTreeDirectory;'
                        }
                    ],
                    'superClass': null
                }
            }]
        },
        'name': 'racine'
    },
    '$class': {
        'name': 'fr.soe.a3s.domain.repository.SyncTreeDirectory',
        'serialVersionUID': '-2855304993780573704',
        'flags': 2,
        'fields': [
            {
                'type': 'Z',
                'name': 'deleted'
            },
            {
                'type': 'Z',
                'name': 'hidden'
            },
            {
                'type': 'Z',
                'name': 'markAsAddon'
            },
            {
                'type': 'Z',
                'name': 'updated'
            },
            {
                'type': 'L',
                'name': 'list',
                'classname': 'Ljava/util/List;'
            },
            {
                'type': 'L',
                'name': 'name',
                'classname': 'Ljava/lang/String;'
            },
            {
                'type': 'L',
                'name': 'parent',
                'classname': 'Lfr/soe/a3s/domain/repository/SyncTreeDirectory;'
            }
        ],
        'superClass': null
    }
};

const exampleDto = {
    'deleted': false,
    'hidden': false,
    'markAsAddon': false,
    'updated': false,
    'list': [{
        'deleted': false,
        'hidden': false,
        'markAsAddon': true,
        'updated': false,
        'list': [{
            'deleted': false,
            'hidden': false,
            'markAsAddon': false,
            'updated': false,
            'list': [{
                'compressed': false,
                'compressedSize': 0,
                'deleted': false,
                'size': 151887,
                'updated': false,
                'name': 'ace_advanced_ballistics.pbo',
                'sha1': '5c577a28f826972165fe2f16fa66298e66ef867d'
            }],
            'name': 'addons',
        }],
        'name': '@ace',
    }],
    'name': 'racine'
};

function stripExpandedCircularReferences(obj: any) {
    delete obj.$.parent;
    if (obj.$.list) {
        stripExpandedCircularReferences(obj.$.list)
    }
    if (obj._$ && Array.isArray(obj._$)) {
        obj._$.forEach(stripExpandedCircularReferences)
    }
}

describe(serializeA3sSyncTreeDirectory.name, () => {
    it('correctly serializes single file', () => {
        const serializedLeaf: any = serializeA3sSyncTreeLeaf(exampleDto.list[0].list[0].list[0], undefined);
        expect(serializedLeaf.$.deleted).toBe(false);
        expect(serializedLeaf.$.size).toBeGreaterThan(0);
        expect(serializedLeaf).toEqual(exampleSerialized.$.list._$[0].$.list._$[0].$.list._$[0]);
    });
    it('correctly serializes an inner single directory', () => {
        const mySerialized: any = serializeA3sSyncTreeDirectory(exampleDto.list[0].list[0], undefined);
        delete mySerialized.$.parent;
        delete mySerialized.$.list._$[0].$.parent;
        expect(mySerialized).toEqual(exampleSerialized.$.list._$[0].$.list._$[0]);
    });
    it('does its whole tree correctly', () => {
        const serializedRacine = serializeA3sSyncTreeDirectory(exampleDto);
        stripExpandedCircularReferences(serializedRacine);
        expect(serializedRacine).toEqual(exampleSerialized);
    });

});
