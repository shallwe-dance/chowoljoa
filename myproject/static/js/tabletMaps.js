const tabletMaps = {
    'upper-1' : [
        ['path','path','path','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path']
    ],
    'upper-2' : [
        ['path','path','path','wall','wall','wall'],
        ['path','wall','path','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','path','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path']
    ],
    'upper-3' : [
        ['path','path','path','path','path','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path']
    ],
    'upper-4' : [
        ['path','path','path','wall','wall','wall','wall','wall'],
        ['path','wall','path','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path','path','path']
    ],
    'upper-5' : [
        ['path','path','path','wall','wall','path','path','path'],
        ['path','wall','path','wall','wall','path','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path','path','path']
    ],
    'upper-6' : [
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['path','path','path','wall','wall','path','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','wall','wall','path','path','path'],
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['wall','wall','path','path','path','path','wall','wall']
    ],
    'upper-7' : [
        ['path','path','path','path','path','wall','wall','wall'],
        ['path','wall','wall','wall','path','wall','wall','wall'],
        ['path','wall','wall','path','path','wall','wall','wall'],
        ['path','wall','wall','wall','wall','path','path','path'],
        ['path','wall','wall','wall','wall','path','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path','path','path']
    ],

    'others-1' : [
        ['path','path','path','path','path','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','path','wall','wall','wall','path'],
        ['wall','wall','wall','wall','wall','path'],
        ['wall','wall','wall','path','wall','path'],
        ['wall','wall','wall','path','path','path']
    ],
    'others-2' : [
        ['path','path','path','path','path','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','path','wall','wall','wall','path'],
        ['wall','wall','path','wall','wall','path'],
        ['wall','wall','path','path','path','path']
    ],
    'others-3' : [
        ['path','path','path','path','path','path','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','wall','wall','path','path','path']
    ],
    'others-4' : [
        ['path','path','path','path','path','path','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','wall','wall','wall','wall','wall','path'],
        ['wall','wall','wall','wall','wall','wall','wall','path'],
        ['wall','wall','wall','wall','wall','wall','wall','path'],
        ['wall','wall','wall','wall','path','wall','wall','path'],
        ['wall','wall','wall','wall','path','path','path','path']
    ],
    'others-5' : [
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['path','path','path','wall','wall','path','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','wall','wall','path','path','path'],
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['wall','wall','path','wall','wall','path','wall','wall']
    ],
    'others-6' : [
        ['path','path','path','path','path','path','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path','path','path']
    ],
    'others-7' : [
        ['path','path','path','path','path','path','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','path','path','wall','wall','wall','path'],
        ['path','path','path','wall','path','wall','wall','path'],
        ['wall','wall','wall','path','path','wall','wall','path'],
        ['wall','wall','wall','path','wall','wall','wall','path'],
        ['wall','wall','wall','path','path','path','path','path']
    ],
'weapon-1' : [
        ['path','path','path','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path']
    ],
    'weapon-2' : [
        ['path','path','path','wall','wall','wall'],
        ['path','wall','path','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','path','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path']
    ],
    'weapon-3' : [
        ['path','path','path','path','path','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path']
    ],
    'weapon-4' : [
        ['path','path','path','wall','wall','wall','wall','wall'],
        ['path','wall','path','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall','wall','wall'],
        ['path','wall','wall','wall','wall','wall','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path','path','path']
    ],
    'weapon-5' : [
        ['path','path','path','wall','wall','path','path','path'],
        ['path','wall','path','wall','wall','path','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path','path','path']
    ],
    'weapon-6' : [
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['path','path','path','wall','wall','path','path','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','wall','wall','path','path','path'],
        ['wall','wall','path','wall','wall','path','wall','wall'],
        ['wall','wall','path','path','path','path','wall','wall']
    ],
    'weapon-7' : [
        ['path','path','path','path','path','wall','wall','wall'],
        ['path','wall','wall','wall','path','wall','wall','wall'],
        ['path','wall','wall','path','path','wall','wall','wall'],
        ['path','wall','wall','wall','wall','path','path','path'],
        ['path','wall','wall','wall','wall','path','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','wall','wall','wall','wall','wall','wall','path'],
        ['path','path','path','path','path','path','path','path']
    ]
}