const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const path = require("path");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

// MULTER미들웨어 저장소 관리
let storage = multer.diskStorage({
    destination: (request, file, cb)=>{
        cb(null, "uploads/");
    },
    filename: (request, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter : (request, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(response.status(400).end('only mp4 is allowed'), false)
        }
        cb(null, true);
    }
})

const upload = multer({ storage : storage}).single("file");


//=================================
//             Video
//=================================

router.post("/uploadfiles", (request, response)=>{
    //비디오를 서버에 저장.
    upload(request, response, err =>{
        if(err){
            return response.json({
                success : false, err
            })
        }
        return response.json({
            success : true,
            url : response.req.file.path,
            fileName : response.req.file.filename
        })
    });
});

router.post("/thumbnail", (request, response)=>{
    // 썸네일 생성 하고 비디오 러닝타임도 가져오기

    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(request.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });

    // 썸네일 생성
    ffmpeg(request.body.url)
    .on('filenames', function(filenames){
        console.log("will generate" + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function(){
        console.log("ScreenShots taken");
        return response.json({
            success : true,
            url : filePath,
            fileName : filenames,
            fileDuration : fileDuration
        })
    })
    .on('error', function (err) {
        console.log(err);
        return response.json({
            success : false,
            err
        })
    })
    .screenshots({
        count : 3,
        folder : 'uploads/thumbnails',
        size: '320x240',
        filename: 'thumbnail-%b.png'
    })


});
module.exports = router;
