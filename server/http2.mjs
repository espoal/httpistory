import http2 from 'http2'
import fs from 'fs'

import {config} from './config.mjs'

const {
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_CONTENT_TYPE
} = http2.constants

/*
 HTTP Server
 */

const {httpConfig} = config

const server = http2.createSecureServer({
    key: fs.readFileSync(httpConfig.sslKey),
    cert: fs.readFileSync(httpConfig.sslCrt)
})

// const index = fs.readFileSync(`${httpConfig.html}/index.html`)

server.on('stream', async (stream, headers) => {
    // const method = headers[':method']
    const path = headers[':path']

    if (path.match(/.*\.(ico|gif|jpe?g|bmp|png)$/igm)) {
        const image = fs.readFileSync(`${httpConfig.assets}${path}`)
        stream.end(image)
        return
    }

    if (path === '/') {
        const index = fs.readFileSync(`${httpConfig.html}/index.html`)
        stream.end(index)
        return
    }

    if (path.match(/.*\.(js|mjs)$/igm)) {
        console.log({path})
        stream.respond({
            [HTTP2_HEADER_STATUS]: 200,
            [HTTP2_HEADER_CONTENT_TYPE]: 'text/javascript'
        })
        const js = fs.readFileSync(`${httpConfig.js}${path}`)
        stream.end(js)
        return
    }

    if (path.match(/.*\.(html)$/igm)) {
        console.log({path})
        stream.respond({
            [HTTP2_HEADER_STATUS]: 200,
            [HTTP2_HEADER_CONTENT_TYPE]: 'text/html'
        })
        const html = fs.readFileSync(`${httpConfig.html}${path}`)
        stream.end(html)
        return
    }

    if (path.match(/.*\.(css)$/igm)) {
        console.log({path})
        stream.respond({
            [HTTP2_HEADER_STATUS]: 200,
            [HTTP2_HEADER_CONTENT_TYPE]: 'text/css'
        })
        const html = fs.readFileSync(`${httpConfig.html}${path}`)
        stream.end(html)
        return
    }

    stream.end('error')
})

server.on('error', (err) => console.error(err))

server.listen(httpConfig.port)

console.log(`HTTP/2 server started at https://localhost:${httpConfig.port}`)

