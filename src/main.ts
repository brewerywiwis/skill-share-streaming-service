import express from 'express'
import config from './config'
import cors from 'cors'
import AWS from 'aws-sdk'
import mime from 'mime'
import morgan from 'morgan'
const app = express()
app.use(cors())
app.use(morgan('dev'))
const s3 = new AWS.S3({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret,
  region: config.aws_region,
})

app.get('/hello', (req, res) => {
  res.json({ message: 'ok' })
})

// app.get('/hello/:filename', (req, res) => {
//   res.sendFile(path.join(__dirname, '../video', 'sample', req.params.filename))
// })

// app.get('/video/:filename', (req, res) => {
//   res.sendFile(path.join(__dirname, '../video', req.params.filename + '.m3u8'))
// })

app.get('/video/:videoId/:filename', async (req, res, next) => {
  const params = {
    Bucket: 'skillshare-storage',
    Key: `hls_video/${req.params.videoId}/${req.params.filename}`,
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

console.log('Server is running ' + config.port)
app.listen(config.port || 8080)
