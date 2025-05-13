import classNames from 'classnames';
import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface INavItemProps {
  children: ReactNode;
  to: string;
}

export const NavItem: FC<INavItemProps> = ({ children, to }) => (
  <li className="mr-6">
    <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <NavLink
        className={({ isActive }) =>
          classNames('whitespace-nowrap px-3 py-2 rounded-md transition-colors hover:bg-[#0071E1]/80', {
            'font-semibold underline': isActive,
          })
        }
        to={to}
      >
        {children}
      </NavLink>
    </motion.div>
  </li>
);
