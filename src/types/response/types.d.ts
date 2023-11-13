export type Error = {
    detail: { [key: string]: any } | string;
    status_code: number;
    error_type: string;
    error_message: string;
};

export type Success = {
    detail: string;
    status_code: number;
};