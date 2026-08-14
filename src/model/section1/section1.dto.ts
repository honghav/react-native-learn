export interface ListDTO {
    id: number;
    name: string;
}

export interface SectionDTO {
    title: string;
    data: ListDTO[];
}