import { NextRequest, NextResponse } from 'next/server'
import PodcastIndexClient from 'podcast-index-client'

const client = new PodcastIndexClient({
  key: process.env.PODCAST_INDEX_API_KEY,
  secret: process.env.PODCAST_INDEX_API_SECRET,
})

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q') ?? ''
  const r = await client.search(q, { max: 10 })
  return NextResponse.json(r)
}
