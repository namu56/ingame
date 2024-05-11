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

type Route = {
  path: Routers;
  element: React.ReactNode;
};

const routeList: Route[] = [
  {
    path: ROUTERS.MAIN,
    element: <Main />,
  },
  {
    path: ROUTERS.AUTH.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTERS.AUTH.SIGNUP,
    element: <SignUp />,
  },
  {
    path: ROUTERS.RANK,
    element: <Ranking />,
  },
  {
    path: ROUTERS.CREATEQUEST,
    element: <CreateMainQuest />,
  },
  {
    path: ROUTERS.EDITQUEST,
    element: <EditMainQuest />,
  }
];

if (process.env.NODE_ENV === 'development') {
  routeList.push({
    path: ROUTERS.TEST,
    element: <Test />,
  });
}

export const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element: <Layout>{item.element}</Layout>,
      errorElement: (
        <Layout>
          <Error />
        </Layout>
      ),
    };
  })
);
