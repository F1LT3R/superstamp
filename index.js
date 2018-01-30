#!/usr/bin/env node
const fs = require('fs')
const path = require("path")
const moment = require('moment')
const exif = require('fast-exif')
const Promise = require('bluebird')

const exifs = []
const stats = []
const renames = []

let count = 0
const maxFiles = 10 // Infinity

const cwd = process.cwd()
const inputDir = process.argv[2]
const dir = path.join(cwd, inputDir)

const formatExifStamp = stamp => {
    const unixtime = moment(stamp, 'YYYY-MM-DD HH:mm:ss.ZZZZ')
    const formatted = unixtime.format('YYYY-MM-DD_HH-mm-ss-SSSS_ZZ')
    return formatted
}

const formatBirthStamp = stamp => {
    const unixtime = moment(stamp)
    const formatted = unixtime.format('YYYY-MM-DD_HH-mm-ss-SSSS_ZZ')
    return formatted
}

const mediaTypes = [
    '.jpg',
    '.jpeg',
    '.cr2',
    '.mov',
    '.mp4'
]

const exifTypes = [
    '.jpg',
    '.jpeg',
    '.cr2'
]


const isType = (fileTypes, ext) => {
    if (fileTypes.indexOf(ext) === -1) {
        return false
    }

    return true
}

const alreadyProcessed = (sourceFile, newStamp)  => {
    if (sourceFile.substr(0, newStamp.length) !== newStamp) {
        return false
    } 

    return true
}

const queueStat = sourceFile => {
    console.log(`queueStat: ${sourceFile}`)

    stats.push(new Promise((resolve, reject) => {
        console.log(`stat: ${sourceFile}`)
        const sourceFileUri = path.join(dir, sourceFile)

        fs.stat(sourceFileUri, (err, stats) => {
            if (err) {
                console.error(err)
                return reject(err)
            }

            const stamp = stats.birthtime
            const formattedStamp = formatBirthStamp(stamp)

            if (alreadyProcessed(sourceFile, formattedStamp)) {
                return resolve()
            }

            const destFilename = formattedStamp + '_' + sourceFile
            const destFileUri = path.join(dir, destFilename)

            const rename = {
                sourceFileUri,
                destFileUri
            }

            queueRename(rename)
            resolve()
        })
    }))
}

const queueRename = file => {
    renames.push(new Promise((resolve, reject) => {
        fs.rename(file.sourceFileUri, file.destFileUri, function (err, res) {
            if (err) {
                return console.error(err)
            }
            const srcPath = path.parse(file.sourceFileUri)
            const destPath = path.parse(file.destFileUri)
            console.log(`Renamed: ${srcPath.base} > ${destPath.base}`)
            resolve(res)
        })
    }))
}

const queueExif = sourceFile => {
    console.log(`queueExif: ${sourceFile}`)

    exifs.push(new Promise((resolve, reject) => {
        console.log(`exif: ${sourceFile}`)

        const sourceFileUri = path.join(dir, sourceFile)

        exif.read(sourceFileUri).then(exifData => {
            const stamp = exifData.exif.DateTimeOriginal
            const formattedStamp = formatExifStamp(stamp)

            if (alreadyProcessed(sourceFile, formattedStamp)) {
                return resolve()
            }
            
            const destFilename = formattedStamp + '_' + sourceFile
            const destFileUri = path.join(dir, destFilename)

            const rename = {
                sourceFileUri,
                destFileUri
            }

            queueRename(rename)
            resolve(rename)
        })
        .catch(err => {
            const errStr = err.toString()
            if (errStr === 'TypeError: Cannot read property \'exif\' of null') {
                // In this case there is no EXIF data available.
                // We drop through to fs.stat to get Birthtime.
                queueStat(sourceFile)
            } else {
                return reject(err)
            }

        })
    }))
}


const consume = promises => new Promise((resolve, reject) => {
    const next = () => {
        Promise.all([
            promises.shift()
        ])
        .then(data => promises.length ? next() : resolve())
        .catch(err => promises.length ? next() : resolve())
    }
    next()
})

const done = () => {
    console.log('Done!')
}

fs.readdirSync(dir).forEach(sourceFile => {
    const ext = path.extname(sourceFile).toLowerCase()

    count += 1
    if (count > maxFiles) {
        return
    }

    if (!isType(mediaTypes, ext)) {
        return
    }

    if (isType(exifTypes, ext)) {
        return queueExif(sourceFile)
    }

    return queueStat(sourceFile)
})

consume(exifs.length ? exifs : [])
.then(() => consume(stats))
.then(() => consume(renames))
.then(done)
.catch(err => {
    console.error(err)
})
