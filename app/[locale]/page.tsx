/* eslint-disable @next/next/no-img-element */
'use client'

import { useDebounce } from 'ahooks'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { ApiResponse } from 'podcastdx-client/dist/src/types'
import React, { ChangeEvent } from 'react'

import { Container } from './Container'

export default function IndexPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [results, setResults] = React.useState<ApiResponse.Search['feeds']>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, { wait: 300 })
  const t = useTranslations('HomePage')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  React.useEffect(() => {
    const searchPod = async () => {
      let results: ApiResponse.Search['feeds'] = []
      setIsSearching(true)
      if (debouncedSearchTerm) {
        const data: ApiResponse.Search = await fetch(
          `/api/search?q=${debouncedSearchTerm}`
        ).then((res) => res.json())
        results = data?.feeds.filter((feed) => feed.itunesId) || []
      }

      setIsSearching(false)
      setResults(results)
    }

    searchPod()
  }, [debouncedSearchTerm])
  return (
    <Container className="mt-[30vh]">
      <div className="relative">
        <input
          type="search"
          onChange={handleChange}
          id="default-search"
          name="search"
          className="block w-full rounded-lg bg-transparent p-4 pl-10  text-center text-base text-gray-900 outline-none dark:text-white dark:placeholder-gray-400"
          placeholder={t('search_podcast')}
          required
          autoComplete="off"
        />
      </div>
      {results.length ? (
        <ul className="max-h-[40vh] overflow-auto py-1 shadow-lg">
          {results.map((item: any) => (
            <li key={item.id} className="m-4">
              <Link
                href={`/podcast/${item.itunesId}`}
                className="flex items-center text-sm font-bold leading-6 text-blue-500 hover:text-blue-700 active:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 dark:active:text-blue-100"
              >
                <img src={item.image} width={48} height={48} alt={item.title} />
                <h3 className="ml-4">{item.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {searchTerm && !isSearching ? (
            <div className="p-4 text-center shadow-lg">
              {t('no_results_found')}
            </div>
          ) : null}
        </>
      )}
    </Container>
  )
}
