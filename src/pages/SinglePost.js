import React, { useContext, useState, useRef } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Card, Grid, Image, Label, Button, Icon, Form } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopus from '../util/MyPopup';

function SinglePost(props) {

    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);
    const [comment, setComment] = useState('');

    const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }

    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATIONN, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })
    function deletePostCallback() {
        props.history.push('/')
    }

    let postMarkup;

    if (!data) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { getPost } = data;
        const { id, body, createdAt, username, likes, likeCount, commentCount, comments } = getPost;
        console.log(createdAt);
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    {username}
                                </Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <MyPopus content="Comments on post">
                                <Button as="div" labelPosition="right" onClick={() => console.log('comment on post')}>
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                </MyPopus>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="add comment.."
                                                name="comment"
                                                value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}
                                            >
                                                Submit
                               </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>
                                        {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    return postMarkup
}

const SUBMIT_COMMENT_MUTATIONN = gql`
mutation($postId: ID!, $body: String!){
    createComment(postId: $postId, body: $body){
        id
        comments{
            id
            body
            createdAt
            username
        }
        commentCount
    }
}
`;

const FETCH_POST_QUERY = gql`
query($postId:ID!){
    getPost(postId: $postId) {
        id body createdAt username likeCount
        likes {
            username
        }
        commentCount
        comments{
            id body createdAt username
        }
    }
}
`;



export default SinglePost;