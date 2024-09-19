import { createBrowserRouter } from 'react-router-dom';
import BlankPage from './pages/BlankPage';
import Home from './pages/Home';
import Tags from './pages/Tags';
import Events from './pages/Events';
import ContactPageFull from './pages/ContactPageFull';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BlankPage />
  },
  {
    path: "/app/",
    element: <Home />
  },
  {
    path: "/app/events",
    element: <Events />
  },
  {
    path: "/app/tags",
    element: <Tags />
  },
  {
    path: "/app/contact/:id",
    element: <ContactPageFull />
  }
])