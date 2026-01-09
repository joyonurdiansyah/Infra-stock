const VALID_CREDENTIALS = {
    username: "itinfra",
    password: "bianglala01"
};

export const login = (username, password) => {
    if (!username || !password) {
        return false;
    }

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        const userData = {
            username: username,
            role: "Admin",
            loginTime: new Date().toISOString()
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");

        return true;
    }

    return false;
};

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
};

export const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};