import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { API_BASEURL } from "../assets/config";
// 基础 Url
const URL: string = API_BASEURL;

// axios配置
const config = {
    baseURL: URL as string,
};

// 网络请求 类
class RequestHttp {
    // 定义成员变量并指定类型
    service: AxiosInstance;
    public constructor(config: AxiosRequestConfig) {
        this.service = axios.create(config);
        this.service.interceptors.request.use(
            (config: any) => {
              const token = localStorage.getItem('token') || '';
              return {
                ...config,
                headers: {
                  Authorization: token,
                },
              };
            },
            (error: AxiosError) => {
              Promise.reject(error);
            },
          );
        this.service.interceptors.response.use(
            async (response: AxiosResponse) => {
                return response.data;
            },
            async (error: AxiosError) => {
                const { response } = error;
                if (response) {
                }
                if (!window.navigator.onLine) {
                    ElMessage.error("网络连接失败");
                }
            }
        );
    }

    // 常用方法封装
    get<T>(url: string, params?: object): Promise<T> {
        return this.service.get(url, { params });
    }
    post<T>(url: string, params?: object): Promise<T> {
        return this.service.post(url, params);
    }
    patch<T>(url: string, params?: object): Promise<T> {
        return this.service.patch(url, params);
    }
    put<T>(url: string, params?: object): Promise<T> {
        return this.service.put(url, params);
      }
    delete<T>(url: string, params?: object): Promise<T> {
        return this.service.delete(url, { params });
    }
}

// 导出一个实例对象
export default new RequestHttp(config);
