export interface ParkingCarData {
    id: number,
    carNo: string,
    out_time: string | null,
    in_time: string
}

export interface ParkingRespon {
    statusCode: number,
    msg: string,
    data: ParkingCarData[]
}

export interface CreateParkingCar {
    id?: number,
    carNo: string,
    out_time?: string | null,
    in_time: string
}

export interface UpdateParkingCar {
    id: number,
    carNo: string,
    out_time: string | null,
    in_time: string
}