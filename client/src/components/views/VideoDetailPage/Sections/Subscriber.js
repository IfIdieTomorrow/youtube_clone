import Axios from 'axios'
import React,{useEffect, useState} from 'react'

function Subscriber(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {

        let variable = { userTo: props.userTo}

        Axios.post("/api/subscribe/subscribeNumber", variable)
        .then(response => {
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber)
            } else {
                alert("구독자 수를 가져오는데 실패했습니다.")
            }
        })

        let subscribedvariable = { userTo: props.userTo, userFrom : localStorage.getItem("userId")}

        console.log(subscribedvariable);

        Axios.post("/api/subscribe/subscribed", subscribedvariable)
        .then(response => {
            if(response.data.success){
                setSubscribed(response.data.subscribed)
            } else {
                alert("정보를 받아오지 못했습니다.")
            }
        })
    }, [])

    const onSubscribe = () =>{
        
        let subscribeVariable = {
            userTo : props.userTo,
            userFrom : props.userFrom 
        }

        // 이미 구독중이라면
        if(Subscribed){
            Axios.post("/api/subscribe/unSubscribe", subscribeVariable)
            .then(response =>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber - 1)
                    setSubscribed(!Subscribed);
                } else {
                    alert("구독 갱신에 실패했습니다!");
                }
            })       
        // 구독중이 아니라면    
        } else {
            Axios.post("/api/subscribe/subscribe", subscribeVariable)
            .then(response =>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed);
                } else {
                    alert("구독 갱신에 실패했습니다!");
                }
            })       

        }
    }

    return (
        <div>
            <button
                style={{ backgroundColor: `${Subscribed ? '#AAAA' : '#CC0000'}`, borderRadius: "4px",
                color: "white", padding: "10px 16px", fontWeight: '500',
                fontSize: "1rem", textTransform: "uppercase", outline: "none"
                }}
                onClick={onSubscribe}
            >
               {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
            </button>
        </div>
    )
}

export default Subscriber
