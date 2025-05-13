import { useState, useEffect, FormEvent } from 'react';
import { Sparkles } from 'lucide-react';
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

export const Posts = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [nameValue, setNameValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [{ nameErrors, textErrors }, setErrors] = useState<{ nameErrors: string[]; textErrors: string[] }>({
    nameErrors: [],
    textErrors: [],
  });
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = postsSchema.safeParse({ name: nameValue, text: textValue });

    if (!parsed.success) {
      const validationErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        nameErrors: validationErrors.name || [],
        textErrors: validationErrors.text || [],
      });

      return;
    }

    setErrors({ nameErrors: [], textErrors: [] });

    setIsPending(true);
    try {
      await addPost(nameValue, textValue);
      setPosts(await getPosts());

      setNameValue('');
      setTextValue('');
      setApiError('');
    } catch (error) {
      setApiError(`Failed to add post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsPending(false);
    }
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
    <div className="p-6 max-w-4xl mx-auto w-full">
      <title>{`Posts - ${posts.length ? `See ${posts.length} posts` : 'No Posts'}`}</title>
      <Box>
        <Form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-[#FFC600]" />
            Create a New Post
          </h2>
          {apiError && (
            <div className="mb-4">
              <ErrorMessage>{apiError}</ErrorMessage>
            </div>
          )}
          <div>
            <FormGroup label="Your name" id="name" errors={nameErrors}>
              <Input
                id="name"
                type="text"
                name="name"
                value={nameValue}
                onChange={event => setNameValue(event.target.value)}
                placeholder="Some Name"
                invalid={nameErrors.length > 0}
              />
            </FormGroup>
            <FormGroup label="Your post" id="text" errors={textErrors}>
              <Input
                variant="textarea"
                id="text"
                name="text"
                value={textValue}
                onChange={event => setTextValue(event.target.value)}
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
