export interface ParkcarInfoData {
    parkNo: number | null;
    parkID: String;
    allspace: String;
    occupied: String;
}

export interface ParkcarRequest {
    statusCode: number;
    msg: string;
    data: ParkcarInfoData[];
}

export interface CreateParkcarInfo {
    parkNo?: number | null;
    parkID: String;
    allspace: String;
    occupied: String;
}

export interface UpdateParkcarInfo {
    parkNo: number | null;
    parkID: String;
    allspace: String;
    occupied: String;
}
