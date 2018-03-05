import 'babel-polyfill'
import fs from 'fs'

const fetch = require('node-fetch')
const apiKey = "AIzaSyB0UrMBga1irhR9qS1zr3EqGe-rFTdokZI"

const categories = [
  { name: "halawiate", playlists: ['PLV0BtKJkUgvoJ3yRLa3iiHYo-rBJJtmxM'] },
  { name: "sandwitchate", playlists: ['PLV0BtKJkUgvrlb5QNxOs3-vMwO_CZzPtI'] },
  { name: "salatate", playlists: ['PLV0BtKJkUgvoG5lGHsoRAkhKNOL2BMIKN'] },
  { name: "alamia", playlists: ['PLV0BtKJkUgvo7oCpq3mx0lwqqKTlNFPws'] },
  { name: "sahla", playlists: ['PLV0BtKJkUgvpS39rOc0ZrFtPizhOeG_YM'] },
  { name: "makarona", playlists: ['PLV0BtKJkUgvoGekgyYvTpYrER7xt_-xac'] },
  { name: "shourba", playlists: ['PLV0BtKJkUgvo0zDzr1rcv5BjYfdSDtJm-'] },
  { name: "mokabilat", playlists: ['PLV0BtKJkUgvry1zVZk4O7VQu1QRL-55FD'] },
  { name: "moajanate", playlists: ['PLV0BtKJkUgvpiGKdBIQLX0He2ACYLNQMl'] },
  { name: "ramadan", playlists: ['PLV0BtKJkUgvp4lyjcKahIHXfsovlmqDuE'] },
  { name: "atfal", playlists: ['PLV0BtKJkUgvpkj9pDy88sGrl852kKUO5I'] }  
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

  fs.writeFile(`./saidati/categories/${category}.json`, JSON.stringify({ videos: nvideos }), (error) => { /* handle error */ })
  fs.writeFile(`./saidati/categories.json`, JSON.stringify({ categories: videoCategories }), (error) => { /* handle error */ })
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
