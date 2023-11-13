'use client';

import { TypographyH2, TypographyH3, TypographyP } from "@/components/typography";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GetRankedUsers } from "@/lib/auth/util";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


export default function LeaderboardView ()  {

    const { data: session, status } = useSession();

    const [loaded, setLoaded] = useState<boolean>(false);

    const [users, setUsers] = useState<{first_name: string, last_name: string, points: number, recycled_items: number}[]>([]);

    useEffect(() => {
        if (!loaded) {
            GetRankedUsers().then((data) => {
                const b = data as any;
                setUsers(b);
                setLoaded(true);
            });
        }
        
    }
    , [status, loaded]);

    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center p-24">
            <div className={'flex flex-col items-center justify-center min-w-[800px]'}>
                <TypographyH2>
                    Leaderboard
                </TypographyH2>
                <TypographyP className={'text-gray-500'}>
                    See where you rank against other players!
                </TypographyP>

                <div className={'flex flex-col items-center justify-center w-full my-4'}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={'w-[100px]'}>#</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Recycled items</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length > 0 && users.map((user, index) => (
                            <TableRow key={index}
                            className={index === 0 ? 'bg-green-100' :  index === 1 ? 'bg-yellow-100' : index === 2 ? 'bg-red-100' : ''}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.first_name} {user.last_name}</TableCell>
                                <TableCell>{user.points}</TableCell>
                                <TableCell>{user.recycled_items}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </div>
        </main>
    )
}