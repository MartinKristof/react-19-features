import { FC } from 'react';
import { TPost } from '../types';

const truncate = (text: string, length = 20) => (text.length > length ? `${text.substring(0, length)}...` : text);

const formatDate = (time: number, hasExactDate: boolean) => {
  const date = new Date(time);

  return hasExactDate ? `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}` : date.toLocaleDateString();
};

type TPostItemProps = Pick<TPost, 'name' | 'publishedAt' | 'text'> & {
  hasExactDate?: boolean;
};

export const PostItem: FC<TPostItemProps> = ({ name, publishedAt, text, hasExactDate = true }) => (
  <li className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md mb-4">
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-start">
        <div className="w-full sm:w-auto mb-1 sm:mb-0 sm:mr-4">
          <div className="font-medium text-[#0071E1]">{truncate(name)}</div>
          <div className="text-xs text-gray-500 mt-0.5 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FFC600] mr-2"></span>
            {formatDate(publishedAt, hasExactDate)}
          </div>
        </div>
        <div className="w-full text-gray-700">
          <p className="text-ellipsis overflow-hidden">{truncate(text, 200)}</p>
        </div>
      </div>
    </div>
  </li>
);
