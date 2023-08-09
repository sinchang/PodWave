/* eslint-disable @next/next/no-img-element */
'use client'

import * as Dialog from '@radix-ui/react-dialog';
import { useDebounce } from 'ahooks'
import { SearchIcon } from 'lucide-react';
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { ApiResponse } from 'podcast-index-client/dist/src/types'
import React, { ChangeEvent } from 'react'


export function Search() {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('')
  const [results, setResults] = React.useState<ApiResponse.Search['feeds']>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, { wait: 300 })
  const t = useTranslations('HomePage')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) { setResults([]), setSearchTerm('') }
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
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <button
          type="button"
          className="rounded-lg bg-stone-50 p-1.5 shadow-xl dark:bg-neutral-900 mr-2"
          aria-label="theme-switcher"
        >
          <SearchIcon width='1rem' height='1rem' />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[10%] left-[50%] max-h-[85vh] w-[60vw] translate-x-[-50%] rounded-[6px] p-[25px] focus:outline-none bg-white dark:bg-black z-50">
          <div className="relative">
            <input
              type="search"
              onChange={handleChange}
              id="default-search"
              name="search"
              className="block w-full bg-transparent p-4  text-left text-base text-gray-900 outline-none dark:text-white dark:placeholder-gray-400 border-b-slate-200 border-b"
              placeholder={t('search_podcast')}
              required
              autoComplete="off"
            />
          </div>
          {results.length ? (
            <ul className="max-h-[40vh] overflow-auto py-1">
              {results.map((item: any) => (
                <li key={item.id} className="m-4">
                  <Link
                    onClick={() => { setOpen(false); }}
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
