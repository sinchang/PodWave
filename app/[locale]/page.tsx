/* eslint-disable @next/next/no-img-element */
'use client'

import { useDebounce } from "@uidotdev/usehooks"
import Link from "next/link"
import React, { ChangeEvent } from "react"

import { Container } from "./Container";

export default function IndexPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  React.useEffect(() => {
    const searchHN = async () => {
      let results = [];
      setIsSearching(true);
      if (debouncedSearchTerm && searchTerm) {
        const data = await fetch(`/api/search?q=${searchTerm}`).then(res => res.json());
        console.log(data)
        results = data?.feeds || [];
      }

      setIsSearching(false);
      setResults(results);
    };

    searchHN();
  }, [debouncedSearchTerm, searchTerm]);
  return <Container className="mt-[20vh]">
    <form>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input type="search" onChange={handleChange} id="default-search" name="search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Podcast..." required />
        <div className="absolute right-2.5 bottom-2.5">
          {isSearching ? "..." : ""}
        </div>
      </div>
    </form>
    {results.length ? <ul className="border-neutral-200 shadow-lg border">
      {results.map((item: any) =>
        item.itunesId ? <li key={item.id} className="m-4">
          <Link href={`/podcast/${item.itunesId}`} className="flex items-center text-sm font-bold leading-6 text-blue-500 hover:text-blue-700 active:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 dark:active:text-blue-100">
            <img src={item.image} width={48} height={48} alt={item.title} />
            <h3 className="ml-4">{item.title}</h3>
          </Link>
        </li> : null
      )}
    </ul>
      : null}
  </Container>

}

