import { useState, useEffect, FormEvent, useTransition } from 'react';
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

export const PostsWithTransition = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [nameValue, setNameValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [{ nameErrors, textErrors }, setErrors] = useState<{ nameErrors: string[]; textErrors: string[] }>({
    nameErrors: [],
    textErrors: [],
  });
  const [apiError, setApiError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    startTransition(async () => {
      try {
        await addPost(nameValue, textValue);
        setPosts(await getPosts());

        setNameValue('');
        setTextValue('');
      } catch (error) {
        setApiError(`Failed to add post: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  useEffect(() => {
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
    fetchData();
  }, []);

  return (
    <>
      <title>{`Posts - ${posts.length ? `See ${posts.length} posts` : 'No Posts'}`}</title>
      <form onSubmit={handleSubmit}>
        {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
        <div>
          <FormGroup label="Your name" id="name" errors={nameErrors}>
            <input
              className={FIELD_CLASS_NAME}
              id="name"
              type="text"
              name="name"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              placeholder="Some Name"
            />
          </FormGroup>
          <FormGroup label="Your post" id="text" errors={textErrors}>
            <textarea
              className={FIELD_CLASS_NAME}
              id="text"
              name="text"
              value={textValue}
              onChange={e => setTextValue(e.target.value)}
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
