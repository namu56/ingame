import { isLoggedIn } from '@/store/authSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginProviderProps {
  children: React.ReactNode;
  isPrivate: boolean;
}

const LoginProvider = ({ children, isPrivate }: LoginProviderProps) => {
  const navigate = useNavigate();
  const isLogin = useSelector(isLoggedIn);
  const location = useLocation();

  useEffect(() => {
    if (
      isPrivate &&
      !isLogin &&
      location.pathname !== '/signup' &&
      location.pathname !== '/login'
    ) {
      navigate('/login');
    }
  }, [isLogin, location.pathname, navigate]);

  return <>{children}</>;
};

export default LoginProvider;
