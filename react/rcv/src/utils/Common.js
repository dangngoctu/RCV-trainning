export const setUserSession = (token) => {
    sessionStorage.setItem('token', token);
}

export const getToken = () => {
    return sessionStorage.getItem('token') || null;
}