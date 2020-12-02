import { Row, Icon, Card, Avatar, Col, Typography } from 'antd';
import Axios from 'axios';
import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import moment from "moment";


const {Title} = Typography;
const {Meta} = Card;

function LandingPage() {

    const [Video, setVideo] = useState([]);

    useEffect(() => {
        Axios.get("/api/video/getVideos")
        .then(response => {
            if(response.data.success){
                console.log(response.data);
                setVideo(response.data.videos)
            } else {
                alert("영상 정보를 가져오는데 실패했습니다.")
            }
        })
    }, [])

    const renderCards = Video.map((video, index)=>{

        let minuates = Math.floor(video.duration / 60);
        let second = Math.floor((video.duration - minuates * 60));

        return <Col key={index} lg={6} md={8} xs={24}>
            <div style={{ position : 'relative' }}>
                <a href={`/video/${video._id}`}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    <div className="duration">
                        <span>{minuates} : {second}</span>
                    </div>
                </a>
            </div>
        <br />
        <Meta
            avatar = {
                <Avatar src={video.writer.image} />
            }
            title = {video.title}
            description=""
        />
        <span>{video.writer.name}</span>
        <br/>
        <span style={{marginLeft : '3rem'}}>{video.views} views</span> - <span>{moment(video.createAt).format("MMM Do YY")}</span>
        </Col>
    });

    return (
        <div style={{ width : '85%', margin: '3rem auto' }}>
            <Title level={2}>Recommended</Title>
            <hr />
            <Row gutter={[32, 16]}>

                {renderCards}
                
            </Row>
        </div>
    )
}

export default LandingPage
