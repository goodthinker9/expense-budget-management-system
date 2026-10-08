import api from "./app.js";
export const login = async (userData) => {
    try {
        const response = await api.post("/api/auth/login", userData);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.error('Login error:', error.response.data);
        console.error('Login error:', error.response.data);
        throw error
    }
}
