import { compile } from 'html-to-text'
import type { Metadata } from 'next'

import { AudioProvider } from '~/app/(audio)/AudioProvider'
import { PodcastLayout } from '~/app/[locale]/podcast/[id]/PodcastLayout'
import { getOpenGraphImage } from '~/app/getOpenGraphImage'
import { i18n } from '~/i18n'
import { getPodcastConfig } from '~/podcast.config'

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: RootParams }) {
  const { id } = params
  const { info } = await getPodcastConfig(id)
  const compiler = compile()
  const description = compiler(info.description).split('\n').join(' ')

  return {
    title: {
      default: info.title,
      template: `%s | ${info.title}`,
    },
    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
      { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    ],
    description,
    keywords: info.title,
    icons: {
      icon: info.coverArt,
      apple: info.coverArt,
    },
    openGraph: {
      title: {
        default: info.title,
        template: `%s | ${info.title}`,
      },
      description,
      locale: params.locale,
      type: 'website',
      images: [getOpenGraphImage(info.coverArt)],
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

  return (
    <AudioProvider>
      <PodcastLayout podcastConfig={config}>{children}</PodcastLayout>
    </AudioProvider>

  )
}
