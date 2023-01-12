const express = require('express')
const request = require('request')
const fs = require('fs')
const app = express()

app.get('/download-thumbnail', (req, res) => {
  const youtubeUrl = req.query.url
  if (!youtubeUrl) {
    res.status(400).json({error: 'Please provide a valid YouTube URL as a query parameter'})
    return
  }

  // Extract the video ID from the YouTube URL
  const videoId = youtubeUrl.split('v=')[1]
  if (!videoId) {
    res.status(400).json({error: 'Invalid YouTube URL provided'})
    return
  }

  // Create the thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  
  request.get(thumbnailUrl)
    .on('error', error => {
      res.status(500).json({error: error.message})
    })
    .pipe(fs.createWriteStream(`./thumbnail-${videoId}.jpg`))
    .on('close', () => {
      res.download(`./thumbnail-${videoId}.jpg`, error => {
        if (error) {
          res.status(500).json({error: error.message})
        }
      })
    })
})

app.listen(3000, () => {
  console.log('API server is listening on port 3000')
})
// ?