'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { useSession, signOut } from 'next-auth/react';

import Image from 'next/image';
import Link from 'next/link';

import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { BlackSpinner } from '@/components/spinner';
import { TypographyH2, TypographyH3, TypographyH4, TypographyP } from '@/components/typography';
import { GetUsersName, GetUsersPoints } from '@/lib/auth/util';

export default function MainNavbar() {
    const { data: session, status } = useSession();
    const [name, setName] = useState<string>('');
    const [points, setPoints] = useState<number>(0);

    const [scrollPosition, setScrollPosition] = useState<number>(0);

    const handleScroll = () => {
        setScrollPosition(window.scrollY);
    };

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);

        if (status === 'authenticated') {
            GetUsersName().then((data) => {
                const detail = data.detail as any;
                setName(`${detail.first_name} ${detail.last_name}`);
            });

            GetUsersPoints().then((data) => {
                const detail = data.detail as any;
                setPoints(detail.points);
            });

        }
    });
    return (
        <div
            className={`transition-colors px-8 md:px-[80px] lg:px-[50px] flex justify-between items-center h-16 text-black w-full fixed top-0 z-10 ${
                scrollPosition > 10 ? 'bg-white drop-shadow-sm' : 'bg-transparent'
            }`}
            role="navigation"
        >
            <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                    <Link href="/">
                        <TypographyH4 className={'cursor-pointer'}>Recycle Rush</TypographyH4>
                            
                    </Link>

                    <NavigationMenu className={'ml-12 hidden lg:block'}>
                        <NavigationMenuList className={'gap-2'}>
                            <NavigationMenuItem>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/plan">
                                    Recycling centers in Chicago
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/leaderboard">
                                    Leaderboard
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem className={''}>
                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'bg-black text-white hover:text-white hover:bg-black/90 active:bg-black/80 active:text-white focus:bg-black focus:text-white')} href="/capture">
                                    Capture Recyclable
                                </NavigationMenuLink>
                            </NavigationMenuItem>


                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
            <div className="items-center h-full hidden md:flex gap-4">
                {status === 'loading' ? (
                    <BlackSpinner />
                ) : status === 'authenticated' ? (
                    <>
                    {
                        points ? (
                            <div
                            className={'flex items-center bg-green-100 p-1 rounded-md pr-3'}
                            >   
                                <div
                                className={'overflow-hidden h-8 w-8'}
                                >
                                    <Image
                                    src={'/currency.svg'}
                                    alt="Workflow"
                                    width={70}
                                    height={70}
                                    className={'object-cover scale-125 select-none'}
                                    />
                                </div>
                                
                                <TypographyP
                                className='text-black font-bold text-md'
                                >
                                    {points}
                                </TypographyP>
                            </div>
                        )
                        : (
                            <BlackSpinner />
                        )
                    } 

                    {
                        name ? (
                            <TypographyP className={'cursor-pointer'}>{name}</TypographyP>
                        ) : (
                            <BlackSpinner />
                        )
                    }

                        <Menubar className="border-none bg-transparent">
                            <MenubarMenu>
                                <MenubarTrigger className={'rounded-full border-none cursor-pointer'}>
                                    <Avatar className={'rounded-full'}>
                                        <AvatarImage className={'rounded-full'} src={'https://github.com/shadcn.png'} />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                </MenubarTrigger>

                                <MenubarContent align="end">
                                    <MenubarItem>Messages</MenubarItem>
                                    <MenubarItem>Account</MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>Manage trips</MenubarItem>
                                    <MenubarItem>Rewards</MenubarItem>

                                    <Link href={'/developers'}>
                                        <MenubarItem>Developers</MenubarItem>
                                    </Link>

                                    <MenubarSeparator />
                                    <MenubarItem>Help center</MenubarItem>
                                    <MenubarItem onClick={() => signOut()}>Logout</MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>

                        
                    </>
                ) : (
                    <div className="flex-shrink-0 flex gap-4">
                        <Link href={'/login'}>
                            <Button
                                variant={'ghost'}
                                className="rounded-lg px-6 hover:bg-green-200/50"
                                onClick={() => {}}
                            >
                                Log in
                            </Button>
                        </Link>
                        
                        <Link href={'/register'}>
                            <Button
                                variant={'outline'}
                                className="rounded-lg text-black border border-black px-6 bg-transparent hover:bg-green-200/50"
                                onClick={() => {}}
                            >
                                Sign up now
                            </Button>
                        </Link>
                        
                    </div>
                )}
            </div>
            <Button variant="outline" className={'border-black md:hidden'} size="icon">
                <Image src={'/icons/menu.svg'} alt="Workflow" width={20} height={20} />
            </Button>
        </div>
    );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, href, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <Link
                        href={href || '#'}
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </Link>
                </NavigationMenuLink>
            </li>
        );
    },
);

ListItem.displayName = 'NavigationMenu.Item';