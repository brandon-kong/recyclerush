'use client';

import { Button } from "@/components/ui/button"
import { TypographyH2, TypographyP } from "@/components/typography"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function LoginPage () {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const attemptEmailLogin = async (e: any) => {
        e.preventDefault();

        setLoading(true);

        let callback = 'http://localhost:3000/';
        const verified = await signIn('email-password', {
            email,
            password,

            callbackUrl: callback,
        });

        if (!verified?.error) {
            router.push('/');
        } else {
            // TODO: handle error
        }

        setLoading(false);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <form onSubmit={attemptEmailLogin} className={'flex flex-col items-center w-full max-w-sm gap-8'}>
                <div className={'flex flex-col items-center justify-center'}>
                    <TypographyH2>
                        Recycle Rush 
                    </TypographyH2>
                    <TypographyP className={'text-gray-500'}>
                        Join the game and start recycling!
                    </TypographyP>
                </div>
                
                <div
                className={'flex flex-col gap-4 w-full'}
                >
                    <Input placeholder="Email"  
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                    <Input placeholder="Password" type={'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                    type={'submit'}
                    >
                        Login
                    </Button>
                    <Link href="/register"
                    className={'text-center text-secondary-foreground/70 underline-offset-4 hover:underline'}
                    >
                        Register an account
                    </Link>
                </div>
            </form>
            
            
        </main>
    )
}