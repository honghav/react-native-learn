import { ListDTO, SectionDTO } from "./section1.dto";

export const listData: ListDTO[] = [
    {
        id: 1,
        name: 'List 1'
    },
    {
        id: 2,
        name: 'List 2'
    },
    {
        id: 3,
        name: 'List 3'
    },
];

export const sectionListData: SectionDTO[] = [
    {
        title: 'Section 1',
        data: [
            { id: 101, name: 'Item 1.1' },
            { id: 102, name: 'Item 1.2' },
        ],
    },
    {
        title: 'Section 2',
        data: [
            { id: 201, name: 'Item 2.1' },
            { id: 202, name: 'Item 2.2' },
        ],
    },
];
  