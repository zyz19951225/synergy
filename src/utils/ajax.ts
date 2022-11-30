import axios, { AxiosError, AxiosRequestConfig } from 'axios'
// import { message } from 'antd'

type Method = 'post' | 'get' | 'put' | 'delete' | 'patch'
type IAjax = {
    [value in Method]: (url: string, data?: any, options?: AxiosRequestConfig) => Promise<any>
}

const request = (method: Method) => {
    return (url: string, data?: any, options?: AxiosRequestConfig) => {
        data = data || {}
        options = options || {}

        const timeout = options.timeout

        const promise = new Promise((resolve, reject) => {
            return axios({
                baseURL:'https://mock.mengxuegu.com/mock/618c70f84c5d9932f7e75d90/example/',
                url,
                method,
                ...data,
                withCredentials: true,
                timeout: timeout || 9500,
                ...options,
            })
                .then((response) => {
                    return response.data
                })
                .then((response) => {
                    if (response instanceof Blob) {
                        resolve(response)
                    }
                    if (response.code === 0 || response.code === 200) {
                        resolve(response)
                    } else {
                        if (response.code === 401) {
                            // return openGlobalDialog({
                            //   msg: '登录过期，请重新登录',
                            //   confirmCallback: () => window.location.reload(),
                            // })
                        }
                        reject(response)
                    }
                })
                .catch((error: AxiosError) => {
                    if (axios.isCancel(error)) {
                        // return isFunction(options.cancelCallback) ? options.cancelCallback(error) : undefined
                    }
                    reject(error)
                })
        })

        return promise
    }
}

const ajax: IAjax = {
    post: request('post'),
    get: request('get'),
    put: request('put'),
    delete: request('delete'),
    patch: request('patch'),
}

export default ajax
