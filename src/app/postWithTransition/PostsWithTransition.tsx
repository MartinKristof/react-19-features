import { useState, useEffect, FormEvent, useTransition, useRef } from 'react';
import { z } from 'zod';
import { FormGroup } from '../components/FormGroup';
import { TPost } from '../types';
import { PostList } from '../components/PostList';
import { getUrl } from '../utils/getUrl';
import { ErrorMessage } from '../components/ErrorMessage';
import { Input } from '../components/Input';
import { Spinner } from '../components/Spinner';
import { Form } from '../components/Form';
import { Box } from '../components/Box';
import { Button } from '../components/Button';
import { PostsListWrapper } from '../components/PostsListWrapper';
import { Title } from '../components/Title';
import { Container } from '../components/Container';

const postsSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters long').nonempty('Name is required'),
  text: z.string().trim().min(3, 'Text must be at least 3 characters long').nonempty('Text is required'),
});

const getPosts = async () => {
  const response = await fetch(getUrl());

  return await response.json();
};

const addPost = async (name: string, text: string) => {
  const response = await fetch(getUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, text, publishedAt: new Date().getTime() }),
  });
  if (!response.ok) {
    throw new Error('Failed to add todo');
  }

  return await response.json();
};

/**
  Show in a browser
  Show states and refs
  Show Input component
  Show the transition - Action
  Show isPending
  Show title
 */
export const PostsWithTransition = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [{ nameErrors, textErrors }, setErrors] = useState<{ nameErrors: string[]; textErrors: string[] }>({
    nameErrors: [],
    textErrors: [],
  });
  const [apiError, setApiError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = nameRef.current?.value || '';
    const text = textRef.current?.value || '';

    const parsed = postsSchema.safeParse({ name, text });

    if (!parsed.success) {
      const validationErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        nameErrors: validationErrors.name || [],
        textErrors: validationErrors.text || [],
      });

      return;
    }

    setErrors({ nameErrors: [], textErrors: [] });

    startTransition(async () => {
      try {
        await addPost(name, text);
        setPosts(await getPosts());

        if (nameRef.current) {
          nameRef.current.value = '';
        }
        if (textRef.current) {
          textRef.current.value = '';
        }

        setApiError('');
      } catch (error) {
        setApiError(`Failed to add post: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPosts();

        setPosts(data);
      } catch (error) {
        setApiError(`Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <title>{`Posts with transition - ${posts.length ? `See ${posts.length} posts` : 'No Posts'}`}</title>
      <Box>
        <Form onSubmit={handleSubmit}>
          <Title />
          {apiError && (
            <div className="mb-4">
              <ErrorMessage>{apiError}</ErrorMessage>
            </div>
          )}
          <div>
            <FormGroup label="Your name" id="name" errors={nameErrors}>
              <Input
                ref={nameRef}
                id="name"
                type="text"
                name="name"
                placeholder="Some Name"
                invalid={nameErrors.length > 0}
              />
            </FormGroup>
            <FormGroup label="Your post" id="text" errors={textErrors}>
              <Input
                ref={textRef}
                variant="textarea"
                id="text"
                name="text"
                placeholder="Some post"
                rows={4}
                invalid={textErrors.length > 0}
              />
            </FormGroup>
          </div>
          <div className="mt-2">
            <Button isPending={isPending} />
          </div>
        </Form>
      </Box>
      <PostsListWrapper>
        {isLoading && <Spinner />}
        <PostList posts={posts} isLoading={isLoading} />
      </PostsListWrapper>
    </Container>
  );
};
