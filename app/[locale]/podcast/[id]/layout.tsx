import { compile } from 'html-to-text'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'

import { AudioProvider } from '~/app/(audio)/AudioProvider'
import { PodcastLayout } from '~/app/[locale]/podcast/[id]/PodcastLayout'
import { getMessages } from '~/app/getMessages'
import { getOpenGraphImage } from '~/app/getOpenGraphImage'
import { ThemeProvider } from '~/app/ThemeProvider'
import { i18n } from '~/i18n'
import { getPodcast, getPodcastConfig } from '~/podcast.config'

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: RootParams }) {
  const { id } = params
  const { rssUrl } = await getPodcastConfig(id)
  const podcast = await getPodcast(rssUrl)
  const compiler = compile()
  const description = compiler(podcast.description).split('\n').join(' ')

  return {
    title: {
      default: podcast.title,
      template: `%s | ${podcast.title}`,
    },
    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
      { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    ],
    description,
    keywords: podcast.title,
    icons: {
      icon: podcast.coverArt,
      apple: podcast.coverArt,
    },
    openGraph: {
      title: {
        default: podcast.title,
        template: `%s | ${podcast.title}`,
      },
      description,
      locale: params.locale,
      type: 'website',
      images: [getOpenGraphImage(podcast.coverArt)],
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
  params: { locale, id },
}: {
  children: React.ReactNode
  params: RootParams
}) {

  const config = await getPodcastConfig(id)
  const podcast = await getPodcast(config.rssUrl)

  return (
    <AudioProvider>
      <PodcastLayout podcast={podcast} podcastConfig={config}>{children}</PodcastLayout>
    </AudioProvider>

  )
}
