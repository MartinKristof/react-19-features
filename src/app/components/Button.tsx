import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { FC } from 'react';

interface IButton {
  isPending: boolean;
}

export const Button: FC<IButton> = ({ isPending }) => (
  <motion.button
    type="submit"
    disabled={isPending}
    className="bg-[#0071E1] hover:bg-[#0071E1]/90 text-white px-5 py-2 rounded-lg font-medium flex items-center justify-center disabled:opacity-70"
    whileHover={{ scale: isPending ? 1 : 1.03 }}
    whileTap={{ scale: isPending ? 1 : 0.97 }}
  >
    {isPending ? (
      <div className="flex items-center">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        <span>Submitting...</span>
      </div>
    ) : (
      <>
        <Send className="w-4 h-4 mr-2" />
        Add Post
      </>
    )}
  </motion.button>
);
