import 'babel-polyfill'
import fs from 'fs'

const fetch = require('node-fetch')
const apiKey = "AIzaSyB0UrMBga1irhR9qS1zr3EqGe-rFTdokZI"

const categories = [
  { name: "nature", playlists: ['PLivjPDlt6ApTjurXykShuUqp7LQcj9s8s'] },  
  { name: "exploration", playlists: ['PLivjPDlt6ApTqKN6DbR-GOM5omen0Xm2a'] },  
  { name: "science", playlists: ['PLivjPDlt6ApS90YoAu-T8VIj6awyflIym'] },  
  { name: "adventure", playlists: ['PLivjPDlt6ApT5VT7oiz7riKmPzkl2sAe0'] },  
  { name: "history", playlists: ['PLivjPDlt6ApSV6IhEzPW2w60mwFVtXgNR'] },  
  { name: "space", playlists: ['PLivjPDlt6ApToUAWUO3gu-xHYwM-rCbgF'] },
  { name: "archaeology", playlists: ['PLQlnTldJs0ZROjwi6yezrMaSt2wCiBQdL'] }, 
  { name: "weirdest", playlists: ['PLNxd9fYeqXeYQpcE7LfadSFjUU4E6inZC'] },
  { name: "wild", playlists: ['PLDVZNJR18KqBSlH2ErnwjWhTiYHxQliVQ'] },  
  { name: "vet", playlists: ['PLNxd9fYeqXeac-VmQvgka1KI8miJcbFCY'] },  
  { name: "mission", playlists: ['PLNxd9fYeqXeaEH44VaOWQdiVPsICArQC2'] },  
  { name: "brain", playlists: ['PLivjPDlt6ApQhuYe9r7EVeWMGXJWAZsNw'] },  
  { name: "robot", playlists: ['PLQlnTldJs0ZRJ51jNh0H_tqQpgEw1lBlg'] },  
  { name: "deadliest", playlists: ['PLNxd9fYeqXeba2Nz4ocWac4hyhJnEACFw'] }   
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

  fs.writeFile(`./natgeo/categories/${category}.json`, JSON.stringify({ videos: nvideos }), (error) => { /* handle error */ })
  fs.writeFile(`./natgeo/categories.json`, JSON.stringify({ categories: videoCategories }), (error) => { /* handle error */ })
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
