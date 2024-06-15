import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import firebase_app from '../lib/config';

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null);
    const [userInfo, setUserInfo] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getUser = async (email) => {
        try {
          const fetchWebsites = await fetch(`/api/hello?correoElectronico=${email}`, {
            method: 'GET'
          });
    
          if (!fetchWebsites.ok) {
            throw new Error('Network response was not ok');
          }
          const res = await fetchWebsites.json();
          setUserInfo(res)
        } catch (error) {
          console.error('There was a problem fetching the website data:', error.message);
        }
      }

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                getUser(user.email)
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userInfo }}>
            {loading ? <div></div> : children}
        </AuthContext.Provider>
    );
};