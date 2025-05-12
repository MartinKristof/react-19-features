import { useState, useEffect, useActionState, useOptimistic } from 'react';
import { FormGroup } from '../components/FormGroup';
import { TPost } from '../types';
import { PostList } from '../components/PostList';
import { getUrl } from '../utils/getUrl';
import { z } from 'zod';
import { ErrorMessage } from '../components/ErrorMessage';
import { SubmitButton } from '../components/SubmitButton';
import { Input } from '../components/Input';

const postsSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters long').nonempty('Name is required'),
  text: z.string().trim().min(3, 'Text must be at least 3 characters long').nonempty('Text is required'),
});

const getPosts = async () => {
  const response = await fetch(getUrl());

  return await response.json();
};

const addPost = async (name: string, text: string, publishedAt: number) => {
  const response = await fetch(getUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, text, publishedAt }),
  });
  if (!response.ok) {
    throw new Error('Failed to add todo');
  }

  return await response.json();
};

export const PostsWithUseActionStateOptimistic = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [apiError, setApiError] = useState('');
  const [optimisticPosts, setOptimisticPosts] = useOptimistic(posts);
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

      const publishedAt = new Date().getTime();
      setOptimisticPosts(currentPosts => [
        { id: currentPosts.length + 1, name, text: text, publishedAt },
        ...currentPosts,
      ]);

      try {
        await addPost(name, text, publishedAt);

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
    setIsLoading(true);
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
    <>
      <title>{`Posts - ${optimisticPosts.length ? `See ${optimisticPosts.length} posts` : 'No Posts'}`}</title>
      <form action={submitForm}>
        {(apiError || globalError) && <ErrorMessage>{apiError || globalError}</ErrorMessage>}
        <div>
          <FormGroup label="Your name" id="name" errors={nameErrors}>
            <Input id="name" type="text" name="name" defaultValue={nameValue} placeholder="Some Name" />
          </FormGroup>
          <FormGroup label="Your post" id="text" errors={textErrors}>
            <Input variant="textarea" id="text" name="text" defaultValue={textValue} placeholder="Some post" rows={4} />
          </FormGroup>
        </div>
        <div className="mt-2">
          <SubmitButton>Add Post</SubmitButton>
        </div>
      </form>
      <section className="space-y-4">
        {(isPending || isLoading) && <div>Loading...</div>}
        {optimisticPosts.length > 0 && <PostList posts={optimisticPosts} />}
      </section>
    </>
  );
};
