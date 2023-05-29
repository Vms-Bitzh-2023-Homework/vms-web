export interface OrderData {
    value: { id: null; phone: string; carNumber: string; status: string; };
        id: number | null;
        phone: string;
        carNumber: string;
        status: string;
        money:number;
        parkingTime:number;
    }
    
    export interface VisitorRequest {
        statusCode: number;
        msg: string;
        data: OrderData[];
    }
    
    export interface CreateOrder {
        id?: number | null;
        phone: string;
        carNumber: string;
        status: string;
        money:number;
        parkingTime:number;
    }
    
    export interface UpdateOrder {
        id: number | null;
        phone: string;
        carNumber: string;
        status: string;
        money:number;
        parkingTime:number;
    }
    