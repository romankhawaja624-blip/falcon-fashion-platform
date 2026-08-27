import React from 'react';
import { useLocation } from 'react-router-dom';
import { isPageVisible } from '../data/pageRegistry';
import { NotFoundPage } from '../pages/errors/NotFoundPage';

type ProtectedRouteProps = {
  path: string;
  element: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const location = useLocation();
  // Check if current location pathname is marked as visible in the page registry
  const visible = isPageVisible(location.pathname);
  // If the page is hidden or not published, render NotFoundPage.
  return visible ? element : <NotFoundPage />;
};
