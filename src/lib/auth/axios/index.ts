import { Error, Success } from '@/types/response/types';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import authOptions from '../options';

const api = axios.create({
    baseURL: process.env.BACKEND_API_URL,
});

const clientApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
});

const localFetcherGet = async (url: string) => {
    const session = await getSession();
    const token = session?.user.access;

    return axios.get(url).then(res => res.data);
};

export { api, clientApi, localFetcherGet };

export const AuthenticatedRequest = async (url: string, method: string, data: any) => {
    const session = await getServerSession(authOptions);
    const token = session?.user.access;

    if (!token) {
        const B: Error = {
            status_code: 401,
            error_type: 'invalid_token',
            error_message: 'Invalid token',
            detail: 'Invalid token',
        };

        return B;
    }

    return api({
        method: method,
        url: url,
        data: data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(res => res.data as Success)
        .catch(err => {
            if (err.response) {
                const error: Error = err.response.data;
                return error;
            }
            
            const error: Error = {
                status_code: 500,
                error_type: 'internal_server_error',
                error_message: 'Internal server error',
                detail: 'Internal server error',
            };

            return error;
        });
};