import { Episodes } from '~/app/[locale]/podcast/[id]/Episodes'
import { getPodcastEpisodes } from '~/podcast.config'

export default async function IndexPage({
  params,
}: {
  params: { id: number }
}) {
  const { id } = params
  const episodes = await getPodcastEpisodes(id)

  return <Episodes episodes={episodes} id={id} />
}

export const revalidate = 10
