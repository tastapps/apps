import 'babel-polyfill'
import fs from 'fs'

const fetch = require('node-fetch')
const apiKey = "AIzaSyB0UrMBga1irhR9qS1zr3EqGe-rFTdokZI"

const categories = [
  { name: "silsila", playlists: ['PLWyX610YjKMXgJx_ThL1zv8fkY_9hE3lM'] },
  { name: "siyaka", playlists: ['PLWyX610YjKMUkJJXehHqNzuIv9M7nLDJk'] },
  { name: "kawaid", playlists: ['PLWyX610YjKMXLfVovDUrVvVUsTdu9Zhil'] },
  { name: "malomate", playlists: ['PLWyX610YjKMXc7LgLEtt_EzI2c-QZtMkk'] },
  { name: "tachwir", playlists: ['PLWyX610YjKMXlEzn0F-L6uy28v_yHa8UD'] },
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

  fs.writeFile(`./siyaka/categories/${category}.json`, JSON.stringify({ videos: nvideos }), (error) => { /* handle error */ })
  fs.writeFile(`./siyaka/categories.json`, JSON.stringify({ categories: videoCategories }), (error) => { /* handle error */ })
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
