import { Episodes } from '~/app/[locale]/podcast/[id]/Episodes'
import { getPodcastConfig, getPodcastEpisodes } from '~/podcast.config'

export default async function IndexPage({ params }: { params: { id: number } }) {
  const { id } = params
  const { rssUrl } = await getPodcastConfig(id)
  const episodes = await getPodcastEpisodes(rssUrl)

  return <Episodes episodes={episodes} id={id} />
}

export const revalidate = 10
