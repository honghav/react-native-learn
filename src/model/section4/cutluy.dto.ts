export interface CutLuyReqDTO {
    amount: number;
    paymentMethodCode?: string;
    projectCode?: string;
    reference_id: string;
}

export interface CheckStatusResDTO {
    id: string,
    status: string,
    amount: string,
    currency: string,
    reference_id: string,
    approved_at: string,
    created_at: string,
    expires_at: string
}