import { FC } from 'react';
import { PostItem } from './PostItem';
import { TPost } from '../types';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface IPostListProps {
  posts: TPost[];
  isLoading?: boolean;
}

export const PostList: FC<IPostListProps> = ({ posts, isLoading }) => {
  if (posts.length > 0 && !isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <ul>
          {posts.map(({ id, name, publishedAt, text }) => (
            <PostItem key={id} name={name} publishedAt={publishedAt} text={text} hasExactDate />
          ))}
        </ul>
      </motion.div>
    );
  }

  if (posts.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4"
          >
            <MessageSquare className="w-8 h-8 text-slate-300" />
          </motion.div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">No posts found</h4>
          <p className="text-gray-500 max-w-sm">Be the first to create a post by filling out the form above.</p>
        </div>
      </motion.div>
    );
  }
};
