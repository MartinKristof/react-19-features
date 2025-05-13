import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface IPostsListWrapper {
  children: ReactNode;
}

export const PostsListWrapper: FC<IPostsListWrapper> = ({ children }) => (
  <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
    <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
      <MessageSquare className="w-5 h-5 mr-2 text-[#0071E1]" />
      Recent Posts
    </h3>
    {children}
  </motion.div>
);
