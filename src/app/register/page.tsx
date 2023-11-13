import { Button } from "@/components/ui/button"
import { TypographyH2, TypographyP } from "@/components/typography"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function RegisterPage () {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <div className={'flex flex-col items-center w-full max-w-sm gap-8'}>
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
                        <Input placeholder="First name" />
                        <Input placeholder="Last name" />
                    </div>
                    <Input placeholder="Email" />
                    <Input placeholder="Password" type={'password'} />
                    <Button>
                        Register
                    </Button>
                    <Link href="/login"
                    className={'text-center text-secondary-foreground/70 underline-offset-4 hover:underline'}
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </div>
            
            
        </main>
    )
}