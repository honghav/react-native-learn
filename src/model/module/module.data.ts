import { ModuleDTO } from "./module.dto";

export const moduleData: ModuleDTO[] = [
    {
        id: '1',
        name: 'Section 1: React Native Component Basic',
        path: '/section1',
        description: 'Section 1 description',
    },
    {
        id: '2',
        name: 'Section 2: React Native Project 1 Basic Project: Expense Tracker',
        path: '/section2',
        description: 'Section 2 description',
    },
    {
        id: '3',
        name: 'Section 3: React Native Project Advanced Project: Phone Permission',
        path: '/section3',
        description: 'Section 3 description',
    },
    {
        id: '4',
        name: 'Section 4: React Native Project Advanced Project: Webhook Project',
        path: '/section4',
        description: 'Section 4 description',
    },
];

export const modulePermission: ModuleDTO[] = [
    {
        id: '1',
        name: 'Google Maps',
        path: '/section3/google-map',
        icon: 'map',
        description: 'Google Maps description',
    },
    {
        id: '2',
        name: 'Scan QR Code',
        path: '/section3/scan-qr-code',
        icon: 'scan',
        description: 'Scan QR Code description',
    }
]

