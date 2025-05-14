import { use } from 'react';
import { TPost } from '../types';
import { PostList } from '../components/PostList';
import { getUrl } from '../utils/getUrl';
import { PostsListWrapper } from '../components/PostsListWrapper';
import { Container } from '../components/Container';

const getPosts = async () => {
  const response = await fetch(getUrl());

  return await response.json();
};

const postPromise = getPosts();

/**
  Show in a browser
  Show use
  Show Routes
 */
export const PostsWithUse = () => {
  const posts = use<TPost[]>(postPromise);

  return (
    <Container>
      <title>{`Posts with use - ${posts.length ? `See ${posts.length} posts` : 'No Posts'}`}</title>
      <PostsListWrapper>
        <PostList posts={posts} isLoading={false} />
      </PostsListWrapper>
    </Container>
  );
};
