import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fetchProfile, login as loginRequest, signup as signupRequest } from '../services/authService';

const AuthContext = createContext();
const TOKEN_KEY = 'yeschef_token_v1';

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                if (savedToken) {
                    setToken(savedToken);
                    const profile = await fetchProfile(savedToken);
                    setUser(profile);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        bootstrap();
    }, []);

    const persistToken = async (value) => {
        setToken(value);
        if (value) {
            await SecureStore.setItemAsync(TOKEN_KEY, value);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    };

    const login = async (credentials) => {
        const response = await loginRequest(credentials);
        await persistToken(response.token);
        setUser(response.user);
    };

    const signup = async (payload) => {
        const response = await signupRequest(payload);
        await persistToken(response.token);
        setUser(response.user);
    };

    const logout = async () => {
        await persistToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({ token, user, loading, error, login, signup, logout, setError }),
        [token, user, loading, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
