import '~/app/globals.css'
import 'focus-visible'

import { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { useId } from 'react'

import { getMessages } from '~/app/getMessages'
import { ThemeProvider } from '~/app/ThemeProvider'
import { i18n } from '~/i18n'

import { ThemeSwitcher } from './ThemeSwitcher'

const sansFontEn = Manrope({
  weight: ['400', '500', '700'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans-en',
  fallback: ['ui-sans-serif'],
})

function randomBetween(min: number, max: number, seed = 1) {
  return () => {
    let rand = Math.sin(seed++) * 10000
    rand = rand - Math.floor(rand)
    return Math.floor(rand * (max - min + 1) + min)
  }
}

function Waveform(props: React.SVGProps<SVGSVGElement>) {
  const id = useId()
  const bars = {
    total: 100,
    width: 2,
    gap: 2,
    minHeight: 40,
    maxHeight: 100,
  }

  const barHeights = Array.from(
    { length: bars.total },
    randomBetween(bars.minHeight, bars.maxHeight)
  )

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="40%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>
        <linearGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="#4989E8" />
          <stop offset="50%" stopColor="#6159DA" />
          <stop offset="100%" stopColor="#FF54AD" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
        </mask>
        <pattern
          id={`${id}-pattern`}
          width={bars.total * bars.width + bars.total * bars.gap}
          height="100%"
          patternUnits="userSpaceOnUse"
        >
          {Array.from({ length: bars.total }, (_, index) => (
            <rect
              key={index}
              width={bars.width}
              height={`${barHeights[index]}%`}
              x={bars.gap * (index + 1) + bars.width * index}
              fill={`url(#${id}-fade)`}
            />
          ))}
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id}-gradient)`}
        mask={`url(#${id}-mask)`}
        opacity="0.25"
      />
    </svg>
  )
}

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: RootParams }) {
  return {
    title: 'Podvoic',
    description:
      'Discover, listen, and engage with the most captivating podcasts from diverse genres in one place.',
    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
      { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    ],
    openGraph: {
      locale: params.locale,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  } satisfies Metadata
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: RootParams
}) {
  let messages
  try {
    messages = await getMessages(locale)
  } catch (error) {
    notFound()
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`font-sans ${sansFontEn.variable}`}
    >
      <body className="bg-stone-50 dark:bg-neutral-900">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Waveform className="fixed left-0 top-0 z-10 h-20 w-full opacity-75" />
            <div className="fixed right-4 top-4 z-10">
              <ThemeSwitcher />
            </div>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
