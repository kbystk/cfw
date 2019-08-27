import parse from '@progfay/scrapbox-parser'
import { LineType } from '@progfay/scrapbox-parser/lib/block/Line'
import * as Plotly from 'plotly.js/lib/core'
import * as Sunburst from 'plotly.js/lib/sunburst'

Plotly.register([Sunburst])
const ENDPOINT =
  process.env.NODE_ENV === 'productions' ? '' : 'http://localhost:3000'

const main = async () => {
  const res = await fetch(
    `${ENDPOINT}/%E3%83%95%E3%83%AC%E3%83%BC%E3%83%90%E3%83%BC%E3%83%8E%E3%83%BC%E3%83%88`
  )
  const json = await res.json()
  const text = json.lines.map(line => line.text).join('\n')
  const rawFlavors = parse(text)
    .blocks.filter(({ type }) => type === 'line')
    .filter(block => block.indent > 0) as LineType[]
  const flavors = []
  for (let i = 0; i < rawFlavors.length; i += 1) {
    const target = rawFlavors[i]
    if (target.indent === 1) {
      const node = target.nodes[0]
      switch (node.type) {
        case 'link': {
          flavors.push({
            indent: target.indent,
            parent: null,
            flavor: node.href,
            songs: []
          })
          break
        }
        default: {
          console.log(node)
        }
      }
    } else {
      const node = target.nodes[0]
      switch (node.type) {
        case 'link': {
          let j = i - 1
          while (true) {
            if (rawFlavors[j].indent < target.indent) {
              const parentNode = rawFlavors[j].nodes[0]
              switch (parentNode.type) {
                case 'link': {
                  flavors.push({
                    indent: target.indent,
                    parent: parentNode.href,
                    flavor: node.href,
                    songs: []
                  })
                  break
                }
                default: {
                  console.log(parentNode)
                }
              }
              break
            } else {
              j -= 1
            }
          }
        }
      }
    }
  }
  for (const page of json.relatedPages.links2hop.filter(page =>
    /\s\|\s/.test(page.title)
  )) {
    for (const link of page.linksLc) {
      for (const flavor of flavors) {
        if (flavor.flavor === link) {
          flavor.songs.push(page)
        }
      }
    }
  }
  console.log(flavors)
  const data = [
    {
      type: 'sunburst',
      labels: flavors.map(({ flavor }) => flavor),
      parents: flavors.map(({ parent }) => parent),
      values: flavors.map(({ songs }) => songs.length),
      outsidetextfont: { size: 20, color: '#377eb8' },
      leaf: { opacity: 0.4 },
      marker: { line: { width: 2 } }
    }
  ]
  const layout = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    width: 1000,
    height: 1000
  }
  Plotly.newPlot('chart', data, layout)
}

main()
