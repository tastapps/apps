import 'babel-polyfill'
import fs from 'fs'

const fetch = require('node-fetch')
const apiKey = "AIzaSyB0UrMBga1irhR9qS1zr3EqGe-rFTdokZI"

const categories = [
  { name: "jahili", playlists: ['PL3frTZ3THCgREiu0T_ehLSu_fyGozZq2K'] },
  { name: "islami", playlists: ['PLxJvVK8LrCVJwHu3WCsMHyObDTssInfpS'] },
  { name: "abassi", playlists: ['PL8Z7XGSEbTeXaxqybjwkJXGqGaOa6ZfY2'] },
  { name: "hassanbntabit", playlists: ['PLLSlTlHcouKuuxa5Si3A1DtawwlNFFEZ1'] },  
  { name: "motanabi", playlists: ['PLtJNAL1C9C4Oefu8YcsdumgoZvjr10VyI'] },
  { name: "antara", playlists: ['PLNRh7coKdcc4EjnsR6ulOrS1_vI42DXz3'] },
  { name: "kayss", playlists: ['PLm7ozSNJypPKtfeOsmlLO60lzqnA_laJ1'] },
  { name: "aboufirass", playlists: ['PLGoYtvNHhnylcxcs3OTiWosQjSAwPs62v'] },
  { name: "aboutamam", playlists: ['PL3HyvDvWz1LHyhcdUlmAu6AN8LjrPuLc1'] } 
]

let videoCategories = {}

let saveVideos = (videos, category) => {
  videoCategories[category] = { videosCount: videos.length }

  let nvideos = videos.map((item, index) => ({
    id: item.snippet.resourceId.videoId,
    thumbnail: `http://img.youtube.com/vi/${item.snippet.resourceId.videoId}/0.jpg`,
    title: item.snippet.title,
    description: item.snippet.description,
    date: item.contentDetails.videoPublishedAt
  }))

  nvideos = nvideos.filter((v) => v.title !== 'Private video' && v.title !== 'Deleted video')

  nvideos = nvideos.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date))
      return -1

    if (new Date(a.date) < new Date(b.date))
      return 1

    return 0
  })

  fs.writeFile(`./chiar/categories/${category}.json`, JSON.stringify({ videos: nvideos }), (error) => { /* handle error */ })
  fs.writeFile(`./chiar/categories.json`, JSON.stringify({ categories: videoCategories }), (error) => { /* handle error */ })
}

categories.forEach((c) => {
  let videos = []

  c.playlists.forEach(async (p) => {
    let nextPageToken = ''
    while (nextPageToken !== false) {
      let response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${p}&part=snippet,contentDetails&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`)
      let results = await response.json()
      videos = [...videos, ...results.items]
      nextPageToken = results.nextPageToken || false
    }

    saveVideos(videos, c.name)
  })
})
