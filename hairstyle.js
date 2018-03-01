import 'babel-polyfill'
import fs from 'fs'

const fetch = require('node-fetch')
const apiKey = "AIzaSyB0UrMBga1irhR9qS1zr3EqGe-rFTdokZI"

const categories = [
  { name: "easystyles", playlists: ['PL_SCossQygjsoOc2rxaxzQfLoNxAqomTC'] },
  { name: "mediumstyles", playlists: ['PL_SCossQygjtI_ve7IhdAG255oLYYB7L_'] },
  { name: "hardstyles", playlists: ['PL_SCossQygjsPNsIbDvkrfphSYoDXyJN9'] },
  { name: "curlyhair", playlists: ['PL_SCossQygjsZ66U0qxm-YdvE64SYXDfd'] },
  { name: "longhair", playlists: ['PLcIo4FrJoTMeSg_E5PSE_DBVyrcuJ_n3f'] },
  { name: "fiveminutes", playlists: ['PL_SCossQygjvaqKGgHuIlOEtFUrWOoaVn'] },
  { name: "school", playlists: ['PL_SCossQygjvP7-rewyz9mZ_fGyDODyT-'] },
  { name: "sidebraids", playlists: ['PL_SCossQygjt809pWMmDI4f8Yylqqw7FD'] },
  { name: "ropebraids", playlists: ['PL_SCossQygjtZA7hl-khA3N7coh0njwcN'] },
  { name: "loonybraids", playlists: ['PL_SCossQygjtZMkULyriM6sTSg9dNhrw2'] },
  { name: "knothair", playlists: ['PL_SCossQygjtswlkNBEsdf-V4ZSqpmHOJ'] },
  { name: "pancakebraids", playlists: ['PL_SCossQygjtE7MMdxFHDkEf3HbGUH2PU'] },
  { name: "ponytails", playlists: ['PL71DFACD723F50CC3'] },  
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

  fs.writeFile(`./hairstyle/categories/${category}.json`, JSON.stringify({ videos: nvideos }))
  fs.writeFile(`./hairstyle/categories.json`, JSON.stringify({ categories: videoCategories }))
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
