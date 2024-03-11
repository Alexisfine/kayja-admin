import axios from "axios";

const instance = axios.create({
    baseURL:  "http://120.76.205.116/:8080",
    withCredentials: true
})

instance.interceptors.response.use(function (resp) {
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
                return instance(originalRequest);
            } 
        } catch (refreshError) {
            console.error("Unable to refresh token", refreshError);
            localStorage.clear("token")
            localStorage.clear("refresh_token")
            window.location.href = '/users/login';
            return Promise.reject(refreshError);
        }
    }
    // Redirect to login if not a token refresh issue
    if (error.response.status === 401) {
        localStorage.clear("token")
        localStorage.clear("refresh_token")
        window.location.href = '/users/login'
    }
    return Promise.reject(error);
})

instance.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")
    req.headers.setAuthorization("Bearer " + token, true)
    return req
}, (err) => {
    console.log(err)
})


export const uploadImage = async (biz_id, img) => {
    const res = await instance.post("http://120.76.205.116:9000/files/oss/get_token", {
        "biz_id" : String(biz_id),
      })
      if (res.data.code === 2) {
        const data = res.data.data 
        const formData = {
          key: data.key,
          OSSAccessKeyId: data.accessid,
          Policy: data.policy,
          Signature: data.signature,
          File: img, 
        }
        const resFile = await axios.post("http://kayja-img.oss-cn-shenzhen.aliyuncs.com", 
        formData, {
          headers: {
            'Content-Type':  'multipart/form-data' 
          }
        })
        return data.key
       
      } else {
        console.log("failed to upload data")
        return 0;
      }
}

export const blobToFile = (blob, fileName) => {
    // Create a new File object
    const file = new File([blob], fileName, { type: blob.type });
    return file;
};


export default instance