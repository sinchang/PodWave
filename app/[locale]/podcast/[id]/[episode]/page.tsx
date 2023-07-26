import { compile } from 'html-to-text'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EpisodePage } from '~/app/[locale]/podcast/[id]/[episode]/EpisodePage'
import { getOpenGraphImage } from '~/app/getOpenGraphImage'
import { getPodcastConfig, getPodcastEpisode } from '~/podcast.config'

export async function generateMetadata({
  params,
}: {
  params: { episode: string; locale: string, id: number }
}) {
  const { rssUrl } = await getPodcastConfig(params.id)
  const data = await getPodcastEpisode(params.episode, rssUrl)
  if (!data) {
    return {}
  }

  const description = compile()(data.description).split('\n').join(' ')

  return {
    title: data.title,
    description,
    openGraph: {
      title: data.title,
      description,
      locale: params.locale,
      type: 'website',
      images: data.coverArt ? [getOpenGraphImage(data.coverArt)] : undefined,
    },
    icons: data.coverArt
      ? {
        icon: data.coverArt,
        apple: data.coverArt,
      }
      : undefined,
  } satisfies Metadata
}

export default async function ServerEpisodePage({
  params: { episode, id },
}: {
  params: { episode: string, id: number }
}) {
  const { rssUrl } = await getPodcastConfig(id)
  const data = await getPodcastEpisode(episode, rssUrl)
  if (!data) {
    notFound()
  }

  return <EpisodePage episode={data} id={id} />
}

export const revalidate = 10
