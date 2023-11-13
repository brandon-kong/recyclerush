import MainNavbar from '@/components/layout/navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Open_Sans } from 'next/font/google'

import Image from 'next/image'
import Providers from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"> </script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"> </script>
      </head>
      <body className={openSans.className}>
        <Providers>
          <MainNavbar />
          <Image
          src="/background.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className={'-z-10 absolute pointer-events-none select-none top-0 left-0 opacity-30'}
          />
          {children}
        </Providers>
       
      </body>
    </html>
  )
}
