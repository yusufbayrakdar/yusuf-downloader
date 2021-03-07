const router = require("express").Router();
const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg");
var title = "";
/**
 * @api {get} /download/mp3/:id returns requested file
 * @apiName returns requested file
 * @apiGroup anyone
 * @apiPermission anyone
 * @apiSuccess {File}   file                              requested file
 */
router.get("/mp3", async (req, res, next) => {
  var url = req.query.url;
  console.log("url", url);
  if (title.length > 0) {
    try {
      fs.unlink(`${__dirname}/../${title}.mp4`, error => {
        if (error) {
          throw error;
        }
      });
      fs.unlink(`${__dirname}/../${title}.mp3`, error => {
        if (error) {
          throw error;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  const info = await getInfo(url);
  const { lengthSeconds, isLive } = info;
  console.log("isLive", isLive, "lengthSeconds", lengthSeconds);
  if (lengthSeconds > 601 || isLive) {
    title = "";
    res.status(400).send("video-length-error");
  } else {
    title = info.title;
    await getStream(url, title);
    try {
      var process = new ffmpeg(`${__dirname}/../${title}.mp4`);
      process.then(
        function(video) {
          video.fnExtractSoundToMP3(`${__dirname}/../${title}.mp3`, function(
            error
          ) {
            if (!error) {
              res.download(`${__dirname}/../${title}.mp3`);
            } else {
              console.log("error", error);
            }
          });
        },
        function(err) {
          console.log("Error: " + err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
});

const getInfo = async url => {
  const response = await ytdl.getInfo(url);
  const { title, lengthSeconds, isLive } = response.videoDetails;
  return { title: nameCorrectionForPath(title), lengthSeconds, isLive };
};

const nameCorrectionForPath = name =>
  name &&
  name
    .replace(/[//]/g, "\\")
    .replace(/(\s[^\w]\s)/g, "-")
    .replace(/(\s+)/g, "_")
    .replace(/[^aA-üÜöÖğĞıİşŞzZ\s\d-]/g, "");

const getStream = async (url, title) => {
  return new Promise((resolve, reject) => {
    const stream = ytdl(url)
      .pipe(fs.createWriteStream(`${title}.mp4`))
      .on("close", () => {
        return resolve(stream);
      });
  });
};

module.exports = { router };