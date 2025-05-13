import { useState, useEffect, useActionState } from 'react';
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
  Show useActionState
  Show default state
  Show form action
  Show isPending
  Show destructuring of form state
  Show globalError
  Show title
 */
export const PostWithUseActionState = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [state, submitForm, isPending] = useActionState<
    {
      nameErrors: string[];
      textErrors: string[];
      globalError: string;
      name: string;
      text: string;
    },
    FormData
  >(
    async (_, formData) => {
      const name = formData.get('name') as string;
      const text = formData.get('text') as string;
      const parsed = postsSchema.safeParse({ name, text });

      if (!parsed.success) {
        const validationErrors = parsed.error.flatten().fieldErrors;

        return {
          nameErrors: validationErrors.name || [],
          textErrors: validationErrors.text || [],
          globalError: '',
          name,
          text,
        };
      }

      try {
        await addPost(name, text);

        await fetchData();

        return {
          nameErrors: [],
          textErrors: [],
          globalError: '',
          name: '',
          text: '',
        };
      } catch (error) {
        return {
          nameErrors: [],
          textErrors: [],
          globalError: `Failed to add post: ${error instanceof Error ? error.message : 'Unknown error'}`,
          name,
          text,
        };
      }
    },
    { nameErrors: [], textErrors: [], globalError: '', name: '', text: '' },
  );

  const { nameErrors, textErrors, globalError, name: nameValue, text: textValue } = state;

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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <title>{`Posts with use action state - ${posts.length ? `See ${posts.length} posts` : 'No Posts'}`}</title>
      <Box>
        <Form action={submitForm}>
          <Title />
          {(apiError || globalError) && (
            <div className="mb-4">
              <ErrorMessage>{apiError || globalError}</ErrorMessage>
            </div>
          )}
          <div>
            <FormGroup label="Your name" id="name" errors={nameErrors}>
              <Input
                id="name"
                type="text"
                name="name"
                defaultValue={nameValue}
                placeholder="Some Name"
                invalid={nameErrors.length > 0}
              />
            </FormGroup>
            <FormGroup label="Your post" id="text" errors={textErrors}>
              <Input
                variant="textarea"
                id="text"
                name="text"
                defaultValue={textValue}
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
    </div>
  );
};
