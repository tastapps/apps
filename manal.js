import 'babel-polyfill'
import fs from 'fs'

const fetch = require('node-fetch')
const apiKey = "AIzaSyB0UrMBga1irhR9qS1zr3EqGe-rFTdokZI"

const categories = [
  { name: "fotour", playlists: ['PL46uIUAbCJThxWL4HVXT5BE6TCvEl1GFV'] },
  { name: "machroubat", playlists: ['PL46uIUAbCJTiGBnmWqz2XCjQQJBBJ5njd'] },
  { name: "dajaj", playlists: ['PL46uIUAbCJTi8zexbugEwZOQDI2DdSUqe'] },
  { name: "sahla", playlists: ['PL46uIUAbCJTgcnkv9RLVJchVB4X-nR_aL'] },
  { name: "monassabat", playlists: ['PL46uIUAbCJThxPqx9wvUfquzP4iGA6NSs'] },
  { name: "adha", playlists: ['PL46uIUAbCJTjetkOciTbCDvdq8rNZ3F8f'] },
  { name: "raissia", playlists: ['PL46uIUAbCJTgveIQXifBy8jfOgcY8rkDL'] },
  { name: "mokabilat", playlists: ['PL9FC89173945AEBE1'] },
  { name: "janibia", playlists: ['PL7C8DB4875BE61228'] },
  { name: "ramadan", playlists: ['PL46uIUAbCJTgIrNoVL1oRxKbaQjiIx2JP'] },
  { name: "bahria", playlists: ['PL46uIUAbCJThLIcKh_frMV0Vr_RePZYL7'] },
  { name: "lohoum", playlists: ['PL46uIUAbCJThTnbTSpoCqFdXAAmvrRKKU'] },  
]

let videoCategories = {}

let saveVideos = (videos, category) => {
  videoCategories[category] = { videosCount: videos.length }

  let nvideos = videos.map((item, index) => ({
    id: item.snippet.resourceId.videoId,
    thumbnail: `http://img.youtube.com/vi/${item.snippet.resourceId.videoId}/0.jpg`,
    title: "title",
    description: "description",
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

  fs.writeFile(`./manal/categories/${category}.json`, JSON.stringify({ videos: nvideos }), (error) => { /* handle error */ })
  fs.writeFile(`./manal/categories.json`, JSON.stringify({ categories: videoCategories }), (error) => { /* handle error */ })
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
