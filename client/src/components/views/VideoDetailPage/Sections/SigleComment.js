import React, {useEffect, useState} from 'react'
import {Comment, Avatar, Button, Input} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import {useSelector} from 'react-redux';
import Axios from 'axios';

function SigleComment(props) {

    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    const onClickOpenReply = () =>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (e) =>{
        setCommentValue(e.currentTarget.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content : CommentValue,
            writer : user.userData._id,
            postId : props.postId,
            responseTo : props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success){
                console.log(response.data.result);
                setCommentValue("")
                setOpenReply(!OpenReply)
                props.refreshFunction(response.data.result)
            } else {
                alert("댓글 등록에 실패했습니다.")
            }
        })

    }

    const actions = [
        <span onClick={onClickOpenReply} key="comment-basic-reply-to"> Reply to </span>
    ]
    return (
        <div>
            <Comment 
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            /> 

            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요."
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
                </form>   
            }
        </div>
    )
}

export default SigleComment
