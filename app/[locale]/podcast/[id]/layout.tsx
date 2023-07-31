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

export async function generateMetadata({
  params,
}: {
  params: RootParams & { id: number }
}) {
  const { id } = params
  const { info } = await getPodcastConfig(id)
  const compiler = compile()
  const description = compiler(info.description).split('\n').join(' ')

  return {
    title: {
      default: `${info.title} | Podvoic`,
      template: `%s | ${info.title} | Podvoic`,
    },
    description,
    keywords: info.title,
    icons: {
      icon: info.coverArt,
      apple: info.coverArt,
    },
    openGraph: {
      title: {
        default: `${info.title} | Podvoic`,
        template: `%s | ${info.title} ｜ Podvoic`,
      },
      description,
      locale: params.locale,
      type: 'website',
      images: [getOpenGraphImage(info.coverArt)],
    },
  } satisfies Metadata
}

export default async function RootLayout({
  children,
  params: { locale, id },
}: {
  children: React.ReactNode
  params: RootParams & { id: number }
}) {
  const config = await getPodcastConfig(id)

  return (
    <AudioProvider artist={config.info.title}>
      <PodcastLayout podcastConfig={config}>{children}</PodcastLayout>
    </AudioProvider>
  )
}
