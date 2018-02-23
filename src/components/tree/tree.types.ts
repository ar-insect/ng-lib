
export interface TreeModel {
    id: number;
    ptext: string;
    children?: TreeModel[];
    _foldingType?: string;
}
