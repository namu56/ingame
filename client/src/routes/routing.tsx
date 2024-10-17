import { ROUTERS, Routers } from '@/constant/route';
import Layout from '@/layout/Layout';
import Login from '@/pages/Login';
import Main from '@/pages/Main';
import Error from '@/pages/Error';
import { createBrowserRouter } from 'react-router-dom';
import SignUp from '@/pages/SignUp';
import Ranking from '@/pages/Ranking';
import Test from '@/pages/Test';
import CreateMainQuest from '@/pages/CreateMainQuest';
import EditMainQuest from '@/pages/EditMainQuest';
import LoginProvider from '@/provider/loginProvider';

type Route = {
  path: Routers;
  element: React.ReactNode;
  isPrivate: boolean;
};

const routeList: Route[] = [
  {
    path: ROUTERS.MAIN,
    element: <Main />,
    isPrivate: true,
  },
  {
    path: ROUTERS.AUTH.LOGIN,
    element: <Login />,
    isPrivate: false,
  },
  {
    path: ROUTERS.AUTH.SIGNUP,
    element: <SignUp />,
    isPrivate: false,
  },
  {
    path: ROUTERS.CREATEQUEST,
    element: <CreateMainQuest />,
    isPrivate: true,
  },
  {
    path: ROUTERS.EDITQUEST,
    element: <EditMainQuest />,
    isPrivate: true,
  },
  {
    path: ROUTERS.RANK,
    element: <Ranking />,
    isPrivate: false,
  },
];

if (process.env.NODE_ENV === 'development') {
  routeList.push({
    path: ROUTERS.TEST,
    element: <Test />,
    isPrivate: false,
  });
}

export const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element: (
        <LoginProvider isPrivate={item.isPrivate}>
          <Layout>{item.element}</Layout>
        </LoginProvider>
      ),
      errorElement: (
        <Layout>
          <Error />
        </Layout>
      ),
    };
  })
);
