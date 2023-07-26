import getPodcastPlatformLinks from 'podcast-platform-links'
import PodcastIndexClient from 'podcastdx-client'
import { cache } from 'react'
import { parse } from 'rss-to-json'

const client = new PodcastIndexClient({
  key: process.env.PODCAST_INDEX_API_KEY,
  secret: process.env.PODCAST_INDEX_API_SECRET,
  disableAnalytics: true,
})

export const getPodcastConfig = cache(async (itunesId: number) => {
  const podcast = await client.podcastByItunesId(itunesId)
  const platforms = await getPodcastPlatformLinks(itunesId, podcast.feed.url)
  return {
    platforms: [
      ...platforms.map((platform) => ({
        name: platform.platform,
        link: platform.link,
      })),
      {
        name: 'RSS',
        link: podcast.feed.url,
      },
    ],
    hosts: [
      {
        name: podcast.feed.author,
        link: podcast.feed.link,
      },
    ],
    rssUrl: podcast.feed.url,
    itunesId: podcast.feed.itunesId
  } as PodcastConfig
})

/**
 * Get podcast via RSS feed.
 */
export const getPodcast = cache(async (rssUrl: string) => {
  const feed = await parse(rssUrl)
  const podcast: Podcast = {
    title: feed.title,
    description: feed.description,
    link: feed.link,
    coverArt: feed.image,
  }

  return podcast
})

/**
 * Encode episode id.
 * (Certain episode id contains special characters that are not allowed in URL)
 */
function encodeEpisodeId(raw: string): string {
  if (!raw.startsWith('http')) {
    return raw
  }

  const url = new URL(raw)
  const path = url.pathname.split('/')
  const lastPathname = path[path.length - 1]

  if (lastPathname === '' && url.search) {
    return url.search.slice(1)
  }

  return lastPathname
}

/**
 * Get podcast episodes via RSS feed.
 */
export const getPodcastEpisodes = cache(async (rssUrl: string) => {
  const feed = await parse(rssUrl)
  const episodes: Episode[] = feed.items.map((item) => ({
    id: encodeEpisodeId(item.id ?? item.link),
    title: item.title,
    description: item.description,
    link: item.link,
    published: item.published,
    content: item.content,
    duration: item.itunes_duration,
    enclosure: item.enclosures[0],
    coverArt: item.itunes_image?.href,
  }))

  return episodes
})

/**
 * Get podcast episode by id.
 */
export const getPodcastEpisode = cache(async (id: string, rssUrl: string) => {
  const episodes = await getPodcastEpisodes(rssUrl)
  const decodedId = decodeURIComponent(id)
  return episodes.find(
    (episode) => episode.id === decodedId || episode.link.endsWith(decodedId)
  )
})
