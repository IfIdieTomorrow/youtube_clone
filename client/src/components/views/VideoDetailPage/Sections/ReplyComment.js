import React, { useEffect, useState } from 'react'
import SigleComment from './SigleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComment, setOpenReplyComment] = useState(false);

    useEffect(() => {
       let commentNumber = 0;
       props.commentList.map((comment, index)=>{
           if(comment.responsTo === props.parentCommentId){
               commentNumber ++
           }
       })
       setChildCommentNumber(commentNumber);
    }, [props.commentList, props.parentCommentId])

    const rederReplyComment = (parentCommentId) =>
        props.commentList.map((comment, index)=> (
            <React.Fragment>
            {comment.responseTo === parentCommentId &&
                <div style={{ width: '80%', marginLeft: '40px' }}>
                    <SigleComment refreshFunction={props.refreshFunction} comment={comment} postid={props.videoId}/>
                    <ReplyComment refreshFunction={props.refreshFunction} commentList={props.commentList} postid={props.videoId} parentCommentId={comment._id}/>
                </div>
            }
            </React.Fragment>
        ))
    

    const onHandleChange = () => {
        setOpenReplyComment(!OpenReplyComment);
    }
    
    return (
        <div>

        {ChildCommentNumber > 0 &&
            <p style={{ fontSize: '14px', margin: 0, color: 'gray' }}onClick={onHandleChange}>
                View {ChildCommentNumber} more comment(s)
            </p>
        }
        {OpenReplyComment &&
            rederReplyComment(props.parentCommentId)
        }
        </div>
    )
}

export default ReplyComment
