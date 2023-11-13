'use client';

import { Button } from "@/components/ui/button"
import { TypographyH2, TypographyP } from "@/components/typography"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { registerUserWithEmail } from "@/lib/auth/util";

export default function RegisterPage () {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastname] = useState('');

    const attemptEmailRegister = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const registered = await registerUserWithEmail({
            email,
            firstName,
            lastName,
            password,
        });

        if (registered.status_code === 201) {
            // sign in

            let callback = 'http://localhost:3000/';

            const signedIn = await signIn('email-password', {
                email,
                password,

                callbackUrl: callback,
            });

            if (!signedIn?.error) {
                setLoading(false);
                router.push('/');
            } else {
                // TODO: handle error
            }
        } else {
            // TODO: handle error
        }

        setLoading(false);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <form onSubmit={attemptEmailRegister} className={'flex flex-col items-center w-full max-w-sm gap-8'}>
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
                    <div className={'flex gap-4'}>
                        <Input placeholder="First name" 
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        />
                        <Input placeholder="Last name"
                        value={lastName}
                        onChange={e => setLastname(e.target.value)}
                        />
                    </div>
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
                        Register
                    </Button>
                    <Link href="/login"
                    className={'text-center text-secondary-foreground/70 underline-offset-4 hover:underline'}
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </form>
            
            
        </main>
    )
}