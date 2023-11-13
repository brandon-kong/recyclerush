import { User } from 'next-auth';
import React from 'react';

export type UserSession =
    | (User & {
          id: string;
      })
    | undefined;

export type ProtectedPageProps = {
    children: React.ReactNode;
};

export type SessionUser = {
    pk: number;
    email: string;

    access?: string;
    refresh?: string;
};

declare module 'next-auth' {
    interface Session {
        token: JWT;
        user: SessionUser;
    }
}

declare module 'next-auth' {
    interface User {
        pk: number;
        email: string;

        access: string | null;
        refresh: string | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        name: string;
        picture: string;

        access: string;
        refresh: string;
        exp: number;

        user: SessionUser;
    }
}

export type JWTCallbackParams = {
    token: JWT;
    user: User | AdapterUser;
    account: Account | null;
    profile?: Profile;
    isNewUser?: boolean;
    session?: any;
    trigger?: 'signIn' | 'signUp' | 'update' | undefined;
};

export type SessionCallbackParams = {
    session: Session;
    token: JWT;
    user: AdapterUser;
};

export type TokenTypes = {
    access: string;
    refresh: string;
    error?: string;
    user: SessionUser;
};