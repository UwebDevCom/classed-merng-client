import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';

import { gql, useMutation } from '@apollo/client';

import MyPopup from '../util/MyPopup';

function LikeButton({ user, post: { id, likes, likeCount } }) {

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost, { error }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  })


  const likeButton = user ?
    (liked ? (
     
        <Button color='teal'>
          <Icon name='heart' />
        </Button>
        ) : (<Button color='teal' basic>
          <Icon name='heart' />
        </Button>)) : (
        <Button as={Link} to={'/login'} color='teal' basic>
          <Icon name='heart' />
        </Button>
    )
    
    return (
    <Button as='div' labelPosition='right' onClick={likePost}>
     <MyPopup content={liked ? 'Unlike': 'like!'}>
       {likeButton}
       </MyPopup>
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  )
}


const LIKE_POST_MUTATION = gql`
mutation likePost($postId: ID!){
    likePost(postId :$postId) {
        id
    body
    likes{
      id
      username
      createdAt
    }
    likeCount
  }
}
`;

export default LikeButton;