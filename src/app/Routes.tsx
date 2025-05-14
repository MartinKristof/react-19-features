import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { NotFound } from './components/NotFound';
import { PostsWithTransition } from './postWithTransition/PostsWithTransition';
import { PostWithUseActionState } from './postsWithUseActionState/PostsWithUseActionState';
import { PostsWithUseOptimistic } from './postWithUseOptimistic/PostsWithUseOptimistic';
import { PostsWithUseActionStateOptimistic } from './postsWithUseActionStateOptimistic/PostsWithUseActionStateOptimistic';
import { Posts } from './posts/Posts';
import { Suspense } from 'react';
import { PostsWithUse } from './postsWithUse/PostsWithUse';
import { Loader } from 'lucide-react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Posts />,
      },
      { path: 'transition', element: <PostsWithTransition /> },
      { path: 'use-optimistic', element: <PostsWithUseOptimistic /> },
      { path: 'use-action-state', element: <PostWithUseActionState /> },
      { path: 'use-action-state-optimistic', element: <PostsWithUseActionStateOptimistic /> },
      {
        path: 'use-use',
        element: (
          <Suspense
            fallback={
              <div className="mx-auto">
                <Loader />
              </div>
            }
          >
            <PostsWithUse />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const Routes = () => <RouterProvider router={router} />;
