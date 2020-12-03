import React,{useEffect,useState} from 'react'
import {Button, } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import { useSelector } from 'react-redux'
import SigleComment from './SigleComment'
import ReplyComment from './ReplyComment';

function Comment(props) {
    // redux store에 저장한 사용자 정보를 가져오는 방법
    const user = useSelector(state => state.user);
    const videoId = props.postId;
    const [commentValue, setcommentValue] = useState("");

    const handleClick = (event) =>{
        setcommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content : commentValue,
            writer : user.userData._id,
            postId : videoId,
        }

        Axios.post('/api/comment/saveComment',variables)
        .then(response => {
            if(response.data.success){
                console.log(response.data.result);
                setcommentValue("")
                props.refreshFunction(response.data.result)
            } else {
                alert("댓글 등록에 실패했습니다.")
            }
        })
    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

            {/* Comment List */}

            {props.commentList && props.commentList.map((comment, index) => (
                (!comment.responseTo && 
                    <React.Fragment>
                        <SigleComment refreshFunction={props.refreshFunction} comment={comment} postid={videoId}/>
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={videoId} commentList={props.commentList}/>
                    </React.Fragment>
                )
            ))}


            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요."
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default Comment
