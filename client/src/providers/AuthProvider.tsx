import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import api from '../api/axios';

type AuthContext = {
  token: string | null;
  user: any;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data);
        console.log(userResponse.data);
      } catch (err) {
        setToken(null);
        setUser(null);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser(null);
        setToken(null);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      console.log(1);
      if (tokenRef.current && !config._retry) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, []);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (err) => {
        console.log(2);
        const originalRequest = err.config;

        if (originalRequest.url === '/auth/refresh') {
          setToken(null);
          setUser(null);
          return Promise.reject(err);
        }

        if (
          err.response.status === 401 &&
          err.response.data.message === 'Unauthorized' &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const response = await api.get('/auth/refresh');

            setToken(response.data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

            return api(originalRequest);
          } catch (error) {
            setToken(null);
            setUser(null);
            return Promise.reject(error);
          }
        }

        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
