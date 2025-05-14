import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { NavItem } from './NavItem';
import { motion } from 'framer-motion';

export const Layout: FC = () => (
  <>
    <title>Post App</title>
    <meta name="description" content="A simple app." />
    <link rel="author" href="https://github.com/MartinKristof" />
    <div className="min-h-screen flex flex-col bg-white">
      <motion.nav
        className="bg-[#0071E1] text-white p-3 shadow-lg"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <nav className="flex space-x-4 text-sm max-w-5xl mx-auto">
          <ul className="flex">
            <NavItem to="/">Posts</NavItem>
            <NavItem to="/transition">Posts with transition</NavItem>
            <NavItem to="/use-optimistic">Posts with use optimistic</NavItem>
            <NavItem to="/use-action-state">Posts with use action state</NavItem>
            <NavItem to="/use-action-state-optimistic">Posts with use action state optimistic</NavItem>
            <NavItem to="/use-use">Posts with use</NavItem>
          </ul>
        </nav>
      </motion.nav>
      <section className="py-3 container mx-auto px-4 flex flex-col space-y-4 text-left">
        <Outlet />
      </section>
    </div>
  </>
);
