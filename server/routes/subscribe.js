const express = require('express');
const router = express.Router();
const {Subscriber} = require("../models/Subscriber");

router.post("/subscribeNumber",(request, response)=>{
    Subscriber.find({'userTo' : request.body.userTo})
    .exec((err, subscribe)=>{
        if(err) return response.status(400).send(err)
        return response.status(200).json({
            success : true,
            subscribeNumber : subscribe.length
        })
    })
})

router.post("/subscribed", (request, response)=>{
    Subscriber.find({'userTo':request.body.userTo, 'userFrom' : request.body.userFrom})
    .exec((err, subscribe)=>{
        if(err) return response.status(400).send(err);
        let result = false;
        if(subscribe.length !== 0){
            result = true;
        }
        console.log(result, subscribe, request.body);
        response.status(200).json({
            success : true,
            subscribed : result
        })
    })
})

router.post("/unSubscribe", (request, response)=>{
    Subscriber.findOneAndDelete({ userTo: request.body.userTo , userFrom : request.body.userFrom })
    .exec((err, doc)=>{
        if(err) return response.status(400).json({
            success : false, err
        })
        response.status(200).json({
            success : true, doc
        })
    })
});

router.post("/subscribe", (request, response)=>{
    const subscribe = new Subscriber(request.body)
    subscribe.save((err, doc)=>{
        if(err) return response.status(400).json({
            success : false, err
        })
        response.status(200).json({
            success : true, doc
        })
    })
});

module.exports = router;
