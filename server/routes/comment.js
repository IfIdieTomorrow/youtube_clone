const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");

router.post("/saveComment", (request, response)=>{
    const comment = new Comment(request.body)
    comment.save((err, doc)=>{
        if(err) return response.json({
            success : false, err
        })
        Comment.find({'_id' : doc._id})
        .populate('writer')
        .exec((err, result)=>{
            if(err) return response.json({
                success : false, err
            })
            response.status(200).json({
                success : true, result
            })
        })
    });
})

router.post("/getComments", (request, response)=>{
    Comment.find({"postId":request.body.videoId})
    .populate("writer")
    .exec((err, comments)=>{
        if(err) return response.status(400).send(err)
        console.log(comments)
        response.status(200).json({
            success : true , comments
        })
    })
});

module.exports = router;