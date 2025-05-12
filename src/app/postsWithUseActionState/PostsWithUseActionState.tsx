import { useState, useEffect, useActionState } from 'react';
import { FormGroup } from '../components/FormGroup';
import { TPost } from '../types';
import { PostList } from '../components/PostList';
import { getUrl } from '../utils/getUrl';
import { z } from 'zod';
import classNames from 'classnames';
import { ErrorMessage } from '../components/ErrorMessage';

const FIELD_CLASS_NAME =
  'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';

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
      <title>{`Posts - ${posts.length ? `See ${posts.length} posts` : 'No Posts'}`}</title>
      <form action={submitForm}>
        {(apiError || globalError) && <ErrorMessage>{apiError || globalError}</ErrorMessage>}
        <div>
          <FormGroup label="Your name" id="name" errors={nameErrors}>
            <input
              className={FIELD_CLASS_NAME}
              id="name"
              type="text"
              name="name"
              defaultValue={nameValue}
              placeholder="Some Name"
            />
          </FormGroup>
          <FormGroup label="Your post" id="text" errors={textErrors}>
            <textarea
              className={FIELD_CLASS_NAME}
              id="text"
              name="text"
              defaultValue={textValue}
              placeholder="Some post"
              rows={4}
            />
          </FormGroup>
        </div>
        <div className="mt-2">
          <button
            type="submit"
            className={classNames(
              'font-bold text-white py-3 px-6 w-fit',
              { 'bg-green-600': !isPending },
              { 'bg-gray-400': isPending },
            )}
          >
            Add Post
          </button>
        </div>
      </form>
      <section className="space-y-4">
        {(isPending || isLoading) && <div>Loading...</div>}
        {posts.length > 0 && <PostList posts={posts} />}
      </section>
    </>
  );
};
