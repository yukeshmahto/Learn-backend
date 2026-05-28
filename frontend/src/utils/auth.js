import { clearAuth as clearStorageAuth, readAuth, writeAuth } from "../api";

export const getAuth = () => readAuth();
export const saveAuth = (authData) => writeAuth(authData);
export const clearAuth = () => clearStorageAuth();
export const isLoggedIn = () => !!readAuth()?.accessToken;
