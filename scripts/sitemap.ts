import CsvReadableStream from 'csv-reader'
import fs from 'fs'
  ; (() => {
    // 1690088508
    let sitemaps: { loc: string, lastmod: string }[] = []
    let index = 0
    let inputStream = fs.createReadStream('podcast.csv', 'utf8')

    inputStream
      .pipe(
        new CsvReadableStream({
          parseNumbers: true,
          parseBooleans: true,
          trim: true,
        })
      )
      .on('data', function(row: number[]) {
        if (row[1] === 0) return
        sitemaps.push({
          loc: `https://podvoic.com/podcast/${row[0]}`,
          lastmod: new Date(1622748034 * 1000).toISOString(),
        })

        if (sitemaps.length === 49990) {
          let xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        `
          const items = sitemaps.map((sitemap) => {
            return `<url>
          <loc>${sitemap.loc}</loc>
          <lastmod>${sitemap.lastmod}</lastmod>
          </url>`
          })

          xml += `${items.join('')}</urlset>`

          fs.writeFileSync(`./podcast-${index}.xml`, xml)
          index++
          sitemaps = []
        }
      })
      .on('end', function() {
        console.log('No more rows!')
      })
  })()
