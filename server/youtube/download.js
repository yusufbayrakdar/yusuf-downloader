const router = require('express').Router();
const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
var title = '';
/**
 * @api {get} /download/:id returns requested file
 * @apiName returns requested file
 * @apiGroup anyone
 * @apiPermission anyone
 * @apiSuccess {File}   file                              requested file
 */
router.get("/", async (req, res, next) => {
    var url = req.query.url;
    if (title.length > 0) {
        fs.unlink(`${__dirname}/../${title}.mp4`, (error) => {
            if (error) {
                throw error;
            }
        });
    }
    title = await getInfo(url);
    await getStream(url, title);
    res.download(`${__dirname}/../${title}.mp4`);
});
/**
 * @api {get} /download/mp3/:id returns requested file
 * @apiName returns requested file
 * @apiGroup anyone
 * @apiPermission anyone
 * @apiSuccess {File}   file                              requested file
 */
router.get("/mp3", async (req, res, next) => {
    var url = req.query.url;
    if (title.length > 0) {
        fs.unlink(`${__dirname}/../${title}.mp4`, (error) => {
            if (error) {
                throw error;
            }
        });
        fs.unlink(`${__dirname}/../${title}.mp3`, (error) => {
            if (error) {
                throw error;
            }
        });
    }
    title = await getInfo(url);
    await getStream(url, title);
    try {
        var process = new ffmpeg(`${__dirname}/../${title}.mp4`);
        process.then(function (video) {
            video.fnExtractSoundToMP3(`${__dirname}/../${title}.mp3`, function (error, file) {
                if (!error){
                    console.log('Audio file: ' + file);
                    res.download(`${__dirname}/../${title}.mp3`);
                }
                else{
                    console.log("error", error)
                }
            });
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (error) {
        console.log(error);
    }
});

const getInfo = async (url) => {
    const response = await ytdl.getInfo(url);
    const info = response.videoDetails.title;
    return info.replace(/(\s+-\s+)/g, '-').replace(/(\s+)/g, '_');
};

const getStream = async (url, title) => {
    return new Promise((resolve, reject) => {
        const stream = ytdl(url)
            .pipe(fs.createWriteStream(`${title}.mp4`)).on("close", () => {
                return resolve(stream);
            })
    });
};

module.exports = { router };