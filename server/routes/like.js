const express = require('express');
const router = express.Router();
const {Like} = require("../models/Like");
const {DisLike} = require("../models/DisLike");

router.post("/getLikes", (request, response)=>{

    let variable = {}
    if(request.body.videoId){
        variable = {videoId: request.body.videoId}
    } else {
        variable = {commentId: request.body.commentId}
    }

    Like.find(variable)
    .exec((err, likes)=>{
        if(err) return response.status(400).send(err)
        response.status(200).json({ success: true, likes })
    })
});

router.post("/getDisLikes", (request, response)=>{

    let variable = {}
    if(request.body.videoId){
        variable = {videoId: request.body.videoId}
    } else {
        variable = {commentId: request.body.commentId}
    }

    DisLike.find(variable)
    .exec((err, disLikes)=>{
        if(err) return response.status(400).send(err)
        response.status(200).json({ success: true, disLikes })
    })
});

router.post("/upLike", (request, response)=>{
    let variable = {}
    if(request.body.videoId){
        variable = {videoId: request.body.videoId, userId : request.body.userId}
    } else {
        variable = {commentId: request.body.commentId, userId : request.body.userId}
    }

    // Like collection에다가 클릭 정보를 넣기

    const like = new Like(variable)
    like.save((err, likeResult)=>{
        if(err) return response.json({
            success : false, err
        })
        // 만약에 DisLike이 이미 클릭이 되어있다면, DisLike를 1 줄여준다.
        DisLike.findOneAndDelete(variable)
        .exec((err, disLikeResult)=>{
            if(err) return response.status(400).json({
                success:false, err
            })
            response.status(200).json({
                success:true
            })
        })
    });

})

router.post("/unLike", (request, response)=>{
    let variable = {}
    if(request.body.videoId){
        variable = {videoId: request.body.videoId, userId : request.body.userId}
    } else {
        variable = {commentId: request.body.commentId, userId : request.body.userId}
    }

    Like.findOneAndDelete(variable)
    .exec((err, result)=>{
        if(err) return response.status(400).json({ success: false, err })
        return response.status(200).json({ success: true })
    })
})

router.post("/unDisLike", (request, response)=>{
    let variable = {}
    if(request.body.videoId){
        variable = {videoId: request.body.videoId, userId : request.body.userId}
    } else {
        variable = {commentId: request.body.commentId, userId : request.body.userId}
    }

    DisLike.findOneAndDelete(variable)
    .exec((err, result)=>{
        if(err) return response.status(400).json({ success: false, err })
        return response.status(200).json({ success: true })
    })
});

router.post("/upDisLike", (request, response)=>{
    let variable = {}
    if(request.body.videoId){
        variable = {videoId: request.body.videoId, userId : request.body.userId}
    } else {
        variable = {commentId: request.body.commentId, userId : request.body.userId}
    }

    // DisLike collection에다가 클릭 정보를 넣기

    const disLike = new DisLike(variable)
    disLike.save((err, disLikeResult)=>{
        if(err) return response.json({
            success : false, err
        })
        // 만약에 DisLike이 이미 클릭이 되어있다면, DisLike를 1 줄여준다.
        Like.findOneAndDelete(variable)
        .exec((err, disLikeResult)=>{
            if(err) return response.status(400).json({
                success:false, err
            })
            response.status(200).json({
                success:true
            })
        })
    });

})


module.exports = router;
