export interface InOutData {
  id: number,
  carNo: string,
  out_time: string | null,
  in_time: string,
  value1: ''
}

export interface InOutRespon {
  statusCode: number,
  msg: string,
  data: InOutData[]
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
