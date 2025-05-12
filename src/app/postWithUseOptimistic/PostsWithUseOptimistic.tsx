import { useState, useEffect, FormEvent, useTransition, useOptimistic, useRef } from 'react';
import { FormGroup } from '../components/FormGroup';
import { TPost } from '../types';
import { PostList } from '../components/PostList';
import { getUrl } from '../utils/getUrl';
import { z } from 'zod';
import classNames from 'classnames';
import { ErrorMessage } from '../components/ErrorMessage';
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

export const PostsWithUseOptimistic = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [{ nameErrors, textErrors }, setErrors] = useState<{ nameErrors: string[]; textErrors: string[] }>({
    nameErrors: [],
    textErrors: [],
  });
  const [apiError, setApiError] = useState('');
  const [optimisticPosts, setOptimisticPosts] = useOptimistic(posts);
  // const [optimisticPosts, setOptimisticPosts] = useOptimistic(posts, prev => [
  //   { id: prev.length + 1, name, text, publishedAt: new Date().getTime() },
  //   ...prev,
  // ]);
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
      const publishedAt = new Date().getTime();
      setOptimisticPosts(currentPosts => [{ id: currentPosts.length + 1, name, text, publishedAt }, ...currentPosts]);

      // setOptimisticPosts({
      //   id: posts.length + 1,
      //   name,
      //   text,
      //   publishedAt,
      // });
      try {
        await addPost(name, text, publishedAt);
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
      <title>{`Posts - ${optimisticPosts.length ? `See ${optimisticPosts.length} posts` : 'No Posts'}`}</title>
      <form onSubmit={handleSubmit}>
        {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
        <div>
          <FormGroup label="Your name" id="name" errors={nameErrors}>
            <Input ref={nameRef} id="name" type="text" name="name" placeholder="Some Name" />
          </FormGroup>
          <FormGroup label="Your post" id="text" errors={textErrors}>
            <Input variant="textarea" ref={textRef} id="text" name="text" placeholder="Some post" rows={4} />
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
        {optimisticPosts.length > 0 && <PostList posts={optimisticPosts} />}
      </section>
    </>
  );
};
