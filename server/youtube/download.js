const router = require('express').Router();
const fs = require('fs');
const ytdl = require('ytdl-core');
/**
 * @api {get} /download/:id returns requested file
 * @apiName returns requested file
 * @apiGroup anyone
 * @apiPermission anyone
 * @apiSuccess {File}   file                              requested file
 */
router.get("/", async (req, res, next) => {
    var url = req.query.url;
    var title = await getInfo(url);
    await getStream(url, title);
    res.download(`${__dirname}/../${title}.mp4`);
});

const getInfo = async (url) => {
    const response = await ytdl.getInfo(url);
    const info = response.videoDetails.title;
    return info;
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