import 'babel-polyfill'
import fs from 'fs'

const fetch = require('node-fetch')
const apiKey = "AIzaSyB0UrMBga1irhR9qS1zr3EqGe-rFTdokZI"

const categories = [
  { name: "breakfast", playlists: ['PL8zglt-LDl-i0xOKNOyfp3MHejOv1Kyov', 'PLcNW74P7qM7LE-grl5sVjo2FO7NRyD0WB', 'PLI9-Km2qj4rTldE2byegukDnpjZoK45Gq'] },
  { name: "junior", playlists: ['PL8zglt-LDl-jvLv4h0ZCo6yO6lMf6tNnH'] },
  { name: "appetizers", playlists: ['PL8zglt-LDl-jp8PpdleYo6o2-ogLAxjzD', 'PLcNW74P7qM7KNNV96rQ9i21CxNceKujWF'] },
  { name: "dinner", playlists: ['PL8zglt-LDl-iwBHEl3Pw1IhWGp9cfgMrc'] },
  { name: "vegetarian", playlists: ['PL8zglt-LDl-hbTt_pVnyaqj-05nYR89hB', 'PLI9-Km2qj4rRaVuMgq7fs_kqkJJLta54a'] },
  { name: "onepot", playlists: ['PL8zglt-LDl-jzz8fBSAPifYbxcHqxPjr2'] },
  { name: "desserts", playlists: ['PL8zglt-LDl-gZa9icq9eqs_vtRew5gy2-', 'PLcNW74P7qM7LrzChCM73dwQXO2cZ7vDkG'] },
  { name: "pasta", playlists: ['PL8zglt-LDl-g1jloR9OJ9weMk8CX2nSkE', 'PL1BC11D365B10133A', 'PLI9-Km2qj4rQXx4Njb_S4JxkYkYOkN8Ul'] },
  { name: "fourways", playlists: ['PL8zglt-LDl-jpoXiUqVBsKz0xNBi55JyJ'] },
  { name: "happyhour", playlists: ['PL8zglt-LDl-jhHJfmb3V6NX504lVmZ2RC'] },
  { name: "fiveingredients", playlists: ['PL8zglt-LDl-gpmBNeiGH4OqV7S7l_MNPp'] },
  { name: "slowcooker", playlists: ['PL8zglt-LDl-is5pLL3FqA5zSbt4es20sa'] },
  { name: "howto", playlists: ['PL8zglt-LDl-ipsMMpShR4t4PBCw6J3HWf', 'PLI9-Km2qj4rQxMNcLu69DD2iv9d6L7K-6'] }
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

  fs.writeFile(`./tasty/categories/${category}.json`, JSON.stringify({ videos: nvideos }))
  fs.writeFile(`./tasty/categories.json`, JSON.stringify({ categories: videoCategories }))
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
