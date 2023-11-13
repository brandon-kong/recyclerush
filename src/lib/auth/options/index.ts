import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { JWTCallbackParams, SessionCallbackParams } from '@/types/types';
import type { JWT } from 'next-auth/jwt';

import { api } from '@/lib/auth/axios';
import { refreshToken } from '@/lib/auth/util';

import { jwtDecode } from 'jwt-decode';

const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET as string,
    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/login',
        newUser: '/register',
        //error: '/?login=1&auth_error=1',
    },

    providers: [

        CredentialProvider({
            id: 'email-password',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'Email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Password',
                },
            },

            async authorize(credentials: any, req: any): Promise<any> {
                const { email, password } = credentials;
                try {
                    const { data, status } = await api.post('/users/verify/email/', {
                        email,
                        password,
                    });

                    const detail = data.detail as { [key: string]: any };
                    if (status === 200) {
                        return {
                            access: detail.access,
                            refresh: detail.refresh,
                            //...detail.user,
                        };
                    }

                    return null;
                } catch (error: any) {
                    return null;
                }
            },
        }),

        CredentialProvider({
            id: 'phone-otp',
            name: 'Phone OTP',
            credentials: {
                phone: {
                    label: 'Phone',
                    type: 'text',
                    placeholder: 'Phone',
                },
                token: {
                    label: 'Token',
                    type: 'text',
                    placeholder: 'Token',
                },
                country_code: {
                    label: 'Country Code',
                    type: 'text',
                    placeholder: 'Country Code',
                },
            },

            async authorize(credentials: any, req: any): Promise<any> {
                const { phone, token, country_code } = credentials;

                const phoneWithCountryCode = country_code + phone;

                try {
                    const { data, status } = await api.post('/users/verify/phone/', {
                        phone: phoneWithCountryCode,
                        token,
                    });

                    const detail = data.detail as { [key: string]: any };

                    if (status === 200) {
                        return {
                            access: detail.access,
                            refresh: detail.refresh,
                            ...detail.user,
                        };
                    }

                    return null;
                } catch (error: any) {
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }: JWTCallbackParams): Promise<any> {
            if (user) {
                if (!user.access || !user.refresh) {
                    return token;
                }
                token.access = user.access;
                token.refresh = user.refresh;

                token.user = user;
            }

            const tokenAccess = token.access;
            const tokenRefresh = token.refresh;

            const decodedAccess = jwtDecode<JWT>(tokenAccess);
            const decodedRefresh = jwtDecode<JWT>(tokenRefresh);

            if (decodedAccess.exp * 1000 > Date.now()) {
                return Promise.resolve(token);
            }

            if (decodedRefresh.exp * 1000 < Date.now()) {
                return null;
            }

            const newToken = await refreshToken(token);
            if (newToken) {
                newToken.user = token.user;
                newToken.user.access = newToken.access;
                newToken.user.refresh = newToken.refresh;

                return newToken;
            }
        },

        async session({ session, token, user }: SessionCallbackParams): Promise<any> {
            if (!token) {
                return null;
            }

            session.access = token.access;
            session.refresh = token.refresh;
            session.error = token.error;

            session.user = token.user;
            return session;
        },

        async signIn({ user, account, profile, email, credentials, callback }: any) {
            if (credentials) {
                return true;
            }

            return false;
        },
    },
};

export default authOptions;