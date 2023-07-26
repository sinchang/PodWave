'use client'

import { clsxm } from '@zolplay/utils'
import { RssIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

type DirectoryInfo = {
  icon: React.ComponentType<{ className?: string }>
  label: string
}

export function PodcastDirectoryLink({
  className,
  platform
}: {
  className?: string
  platform: PodcastConfig['platforms'][0]
}) {

  const svg = `https://cdn.jsdelivr.net/gh/nathangathright/podcast-badges/icons/${platform.name.toLowerCase().replace(/\s/g, '')}.svg`
  return (
    <Link
      href={platform.link}
      className={clsxm(
        'group flex transform-gpu items-center transition-transform hover:scale-105',
        className
      )}
      aria-label={platform.name}
      title={platform.name}
      target="_blank"
    >
      {platform.name === 'RSS' ? <RSSIcon /> : <Image aria-hidden alt={platform.name} width={24} height={24} src={svg} />}
    </Link>
  )
}

function RSSIcon(props: { className?: string }) {
  return (
    <span className={clsxm('inline-flex p-1', props.className)}>
      <RssIcon />
    </span>
  )
}
