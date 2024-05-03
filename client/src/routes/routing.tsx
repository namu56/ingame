import { ROUTERS } from '@/constant/route';
import Layout from '@/layout/Layout';
import Login from '@/pages/Login';
import Main from '@/pages/Main';
import Error from '@/pages/Error';
import { createBrowserRouter } from 'react-router-dom';
import SignUp from '@/pages/SignUp';
import Ranking from '@/pages/Ranking';
import Test from '@/pages/Test';

const routeList = [
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
    path: ROUTERS.TEST,
    element: <Test />,
  },
];

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
