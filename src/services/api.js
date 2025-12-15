import Axios from "axios";
import environment from "../environments/environment.json";

const baseUrl = environment.BASE_ADMIN_API_URL + "/api";
let notificationToken = undefined;

const instance = Axios.create({
  baseURL: baseUrl,
  responseType: "json",
});

instance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const init = () => {
  instance.defaults.headers["Cache-Control"] = "no-cache";
  // Access-Control-Allow-Origin: *
  // instance.defaults.headers["Access-Control-Allow-Origin"] = "*";
  // instance.defaults.withCredentials = true;
};

const get = async (url) => {
  try {
    const { data, status } = await instance.get(url);
    if (status === 200 || status === 201) {
      return data;
    } else {
      throw Error("GET-Request:: Bad Response", status, data);
    }
  } catch (err) {
    throw err;
  }
};

const post = async (url, object) => {
  try {
    const { data } = await instance.post(url, object);
    return data;
  } catch (err) {
    throw err;
  }
};

const put = async (url, object) => {
  try {
    const { data, status } = await instance.put(url, object);
    if (status === 200 || status === 201) {
      return data;
    } else {
      throw Error("PUT-Request:: Bad Response", status, data);
    }
  } catch (err) {
    throw err;
  }
};

const patch = async (url, object) => {
  try {
    const { data, status } = await instance.patch(url, object);
    if (status === 200 || status === 201) {
      return data;
    } else {
      throw Error("PATCH-Request:: Bad Response", status, data);
    }
  } catch (err) {
    throw err;
  }
};

const del = async (url, object) => {
  try {
    const { data, status } = await instance.delete(url, object);
    if (status === 200 || status === 201) {
      return data;
    } else {
      throw Error("DELETE-Request:: Bad Response", status, data);
    }
  } catch (err) {
    throw err;
  }
};

const upload = async (url, formData, onUploadProgress) => {
  try {
    const { data, status } = await instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    if (status === 200 || status === 201) {
      return data;
    } else {
      throw Error("UPLOAD_FILE-Request:: Bad Response", status, data);
    }
  } catch (err) {
    throw err;
  }
};

const setNotificationToken = (token) => {
  notificationToken = token;
};

const getNotificationToken = () => {
  return notificationToken;
};

const Api = {
  baseUrl,
  instance,
  init,
  get,
  post,
  put,
  del,
  upload,
  patch,
  setNotificationToken,
  getNotificationToken,
};

export default Api;
