/* eslint-disable @next/next/no-img-element */
'use client'

import { useDebounce } from 'ahooks'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent } from 'react'

import { Container } from './Container'

export default function IndexPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [results, setResults] = React.useState([])
  const [isSearching, setIsSearching] = React.useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, { wait: 300 })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  React.useEffect(() => {
    const searchPod = async () => {
      let results = []
      setIsSearching(true)
      if (debouncedSearchTerm && searchTerm) {
        const data = await fetch(`/api/search?q=${searchTerm}`).then((res) =>
          res.json()
        )
        results = data?.feeds || []
      }

      setIsSearching(false)
      setResults(results)
    }

    searchPod()
  }, [debouncedSearchTerm, searchTerm])
  return (
    <Container className="mt-[20vh]">
      <h1 className="m-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
        Find Your Podcast
      </h1>
      <div className="relative">
        <input
          type="search"
          onChange={handleChange}
          id="default-search"
          name="search"
          className="block w-full rounded-lg bg-transparent p-4 pl-10  text-center text-sm text-gray-900 outline-none dark:text-white dark:placeholder-gray-400"
          placeholder="Search Podcast..."
          required
          autoComplete="off"
        />
      </div>
      {results.length ? (
        <ul className="py-1 shadow-lg max-h-[30vh] overflow-auto">
          {results.map((item: any) =>
            item.itunesId ? (
              <li key={item.id} className="m-4">
                <Link
                  href={`/podcast/${item.itunesId}`}
                  className="flex items-center text-sm font-bold leading-6 text-blue-500 hover:text-blue-700 active:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 dark:active:text-blue-100"
                >
                  <img
                    src={item.image}
                    width={48}
                    height={48}
                    alt={item.title}
                  />
                  <h3 className="ml-4">{item.title}</h3>
                </Link>
              </li>
            ) : null
          )}
        </ul>
      ) : (
        <>
          {searchTerm ? (
            <div className="p-4 text-center shadow-lg">No results found.</div>
          ) : null}
        </>
      )}
    </Container>
  )
}
