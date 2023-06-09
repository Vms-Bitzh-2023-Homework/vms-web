export interface VisitorInfoData {
    id: number | null;
    carNo: string;
    visPhone: string;
    visName: string;
}

export interface VisitorRequest {
    statusCode: number;
    msg: string;
    data: VisitorInfoData[];
}

export interface CreateVisitorInfo {
    id?: number | null;
    carNo: string;
    visPhone: string;
    visName: string;
}

export interface UpdateVisitorInfo {
    id: number | null;
    carNo: string;
    visPhone: string;
    visName: string;
}
