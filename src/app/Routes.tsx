import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { NotFound } from './components/NotFound';
import { PostsWithTransition } from './postWithTransition/PostsWithTransition';
import { PostWithUseActionState } from './postsWithUseActionState/PostsWithUseActionState';
import { PostsWithUseOptimistic } from './postWithUseOptimistic/PostsWithUseOptimistic';
import { PostsWithUseActionStateOptimistic } from './postsWithUseActionStateOptimistic/PostsWithUseActionStateOptimistic';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PostsWithTransition />,
      },
      { path: 'use-optimistic', element: <PostsWithUseOptimistic /> },
      { path: 'use-action-state', element: <PostWithUseActionState /> },
      { path: 'use-action-state-optimistic', element: <PostsWithUseActionStateOptimistic /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const Routes = () => <RouterProvider router={router} />;
