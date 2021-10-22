const router = require("express").Router();
const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg");
const { v4: uuid } = require("uuid");
/**
 * @api {get} /download/mp3/:id returns requested file
 * @apiName returns requested file
 * @apiGroup anyone
 * @apiPermission anyone
 * @apiSuccess {File}   file                              requested file
 */
router.get("/mp3", async (req, res, next) => {
  var url = req.query.url;
  const info = await getInfo(url);
  // NOTE: Video length restriction is removed for now
  // const { lengthSeconds, isLive } = info;
  // if (lengthSeconds > 601 || isLive) {
  //   res.status(400).send("video-length-error");
  // } else {
  var title = info.title;
  var fileId = uuid();
  await getStream(url, fileId);
  try {
    var process = new ffmpeg(`${__dirname}/../${fileId}.mp4`);
    process.then(
      function (video) {
        video.fnExtractSoundToMP3(
          `${__dirname}/../${fileId}.mp3`,
          function (error) {
            if (!error) {
              res.download(
                `${__dirname}/../${fileId}.mp3`,
                `/${title}.mp3`,
                () => {
                  try {
                    fs.unlink(`${__dirname}/../${fileId}.mp4`, (error) => {
                      if (error) {
                        throw error;
                      }
                    });
                    fs.unlink(`${__dirname}/../${fileId}.mp3`, (error) => {
                      if (error) {
                        throw error;
                      }
                    });
                  } catch (error) {
                    console.error(error);
                    throw Error("File cannot be found 😔");
                  }
                }
              );
            } else {
              console.log("error", error);
              throw Error("Something went wrong 😔");
            }
          }
        );
      },
      function (err) {
        console.log("Error: " + err);
      }
    );
  } catch (error) {
    console.log(error);
  }
  // }
});

const getInfo = async (url) => {
  const response = await ytdl.getInfo(url);
  const { title, lengthSeconds, isLive } = response.videoDetails;
  return { title: nameCorrectionForPath(title), lengthSeconds, isLive };
};

const nameCorrectionForPath = (name) =>
  name &&
  name
    .replace(/[//]/g, "\\")
    .replace(/(\s[^\w]\s)/g, "-")
    .replace(/(\s+)/g, "_")
    .replace(/[^aA-üÜöÖğĞıİşŞzZ\s\d-]/g, "");

const getStream = async (url, fileId) => {
  return new Promise((resolve, reject) => {
    const stream = ytdl(url)
      .pipe(fs.createWriteStream(`${fileId}.mp4`))
      .on("close", () => {
        return resolve(stream);
      });
  });
};

module.exports = { router };
