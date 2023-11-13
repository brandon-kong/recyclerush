import { Button } from "@/components/ui/button"
import { TypographyH2, TypographyP } from "@/components/typography"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage () {
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
                    <Input placeholder="Email" />
                    <Input placeholder="Password" type={'password'} />
                    <Button>
                        Login
                    </Button>
                    <Link href="/register"
                    className={'text-center text-secondary-foreground/70 underline-offset-4 hover:underline'}
                    >
                        Register an account
                    </Link>
                </div>
            </div>
            
            
        </main>
    )
}