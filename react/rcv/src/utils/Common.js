export const setUserSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
}

export const getToken = () => {
    return localStorage.getItem('token') || null;
}

export const getName = () => {
    return localStorage.getItem('name') || null;
}

export const removeToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
}
