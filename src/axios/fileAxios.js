import axios from "axios";

const fileAxios = axios.create({
    baseURL:  "http://120.76.205.116/:9001",
    withCredentials: true
})

fileAxios.interceptors.response.use(function (resp) {
    const newToken = resp.headers["x-jwt-token"]
    const newRefreshToken = resp.headers["x-refresh-token"]
    if (newToken) {
        localStorage.setItem("token", newToken)
    }
    if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken)
    }
    return resp
}, async function (error) {
    const originalRequest = error.config
    if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            // Modify this request as per your backend API's expectations (e.g., header or body)
            const response = await axios.post("http://120.76.205.116:9000/users/refresh_token", {}, {
                headers: {
                    // Example of sending refresh token in headers; adjust if your API expects differently
                    "Authorization": `Bearer ${refreshToken}`
                }
            });
            if (response.status === 200) {
                const newToken = response.headers["x-jwt-token"]
                const newRefreshToken = response.headers["x-refresh-token"]
                if (newToken) {
                    localStorage.setItem("token", newToken)
                }
                if (newRefreshToken) {
                    localStorage.setItem("refresh_token", newRefreshToken)
                }
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                return fileAxios(originalRequest);
            }
        } catch (refreshError) {
            console.error("Unable to refresh token", refreshError);
            return Promise.reject(refreshError);
        }
    }
    // Redirect to login if not a token refresh issue
    if (error.response.status === 401) {
    }
    return Promise.reject(error);
})

fileAxios.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")
    req.headers.setAuthorization("Bearer " + token, true)
    return req
}, (err) => {
    console.log(err)
})

export default fileAxios