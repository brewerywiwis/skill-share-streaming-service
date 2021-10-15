import express from 'express'
import config from './config'
import path from 'path'
import cors from 'cors'
import AWS from 'aws-sdk'
import mime from 'mime'

const app = express()
app.use(cors())

const s3 = new AWS.S3({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret,
  region: config.aws_region,
})

app.get('/hello', (req, res) => {
  res.json({ message: 'ok' })
})

// app.get('/sample.m3u8', (req, res) => {
//   res.sendFile(path.join(__dirname, '../video', 'sample.m3u8'))
// })

// app.get('/video/:filename', (req, res) => {
//   res.sendFile(path.join(__dirname, '../video', req.params.filename + '.m3u8'))
// })

app.get('/video/:directory/:filename', async (req, res, next) => {
  const params = {
    Bucket: 'skillshare-storage',
    Key: `hls/${req.params.directory}/${req.params.filename}`,
  }
  try {
    const head = await s3.headObject(params).promise()
    const stream = s3.getObject(params).createReadStream()

    stream.on('error', function error(err) {
      return next()
    })
    stream.on('end', () => {
      // console.log('Served by Amazon S3: ' + params.Key)
    })

    res.set('Content-Type', mime.lookup(params.Key))
    res.set('Content-Length', head.ContentLength?.toString())
    res.set('Last-Modified', head.LastModified?.toString())
    res.set('ETag', head.ETag?.toString())

    stream.pipe(res)
  } catch (e) {
    res.status(404).json({ message: 'video error' })
  }
})

console.log('Server is running')
app.listen(config.port || 8080)
