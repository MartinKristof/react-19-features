import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { NavItem } from './NavItem';

export const Layout: FC = () => (
  <>
    <title>Post App</title>
    <meta name="description" content="A simple app." />
    <link rel="author" href="https://github.com/MartinKristof" />
    <nav className="flex justify-start items-center bg-red-950 px-8 py-3 h-20">
      <ul className="flex">
        <NavItem to="/">Posts with transition</NavItem>
        <NavItem to="/use-optimistic">Posts with use optimistic</NavItem>
        <NavItem to="/use-action-state">Posts with use action state</NavItem>
        <NavItem to="/use-action-state-optimistic">Posts with use action state optimistic</NavItem>
      </ul>
    </nav>
    <section className="py-3 container mx-auto px-4 flex flex-col space-y-4 text-left">
      <Outlet />
    </section>
  </>
);
