import { request } from "./request";

//登录  --本地校验
export const UserLogin = <T>(params: any) =>
    request.post<T>("/auth", params, { timeout: 15000 });

export const LegitimacyCheck = <T>(params: any) =>
    request.post<T>("/legitimacyCheck", params, { timeout: 15000 });

//发送验证因子
export const SendValidationFactor = <T>(params: any) =>
  request.post<T>("/factorCheck", params);


//-----------------------------
//发送消息
export const SendMessageApi = <T>(params: any) =>
  request.post<T>("/sendMessage", params);

//获取认证详情
export const GetAuthDetail = <T>(params: any) =>
  request.get<T>("/getCurrentUserAuth", params);

//获取认证记录
export const GetAuthRecordList = <T>(params: any) =>
  request.get<T>("/getAuthRecordList", params);

//获取用户历史记录
export const GetHistoricalRoute = <T>(params: any) =>
  request.get<T>("/getHistoricalRoute", params);


//----------------以下接口暂时取消-----------------

//获取因子信息 -- 取消  本地获取
export const GetFactorInfo = <T>(params: any) =>
  request.get<T>("/getFactorInfo", params);

//获取证书类型列表 --- 取消  使用本地数据
export const GetCredentialTypeList = <T>() =>
  request.get<T>("/getCredentialTypeList");

//获取证书详情  --- 取消  获取本地数据
export const GetCredentialDetail = <T>(params: any) =>
  request.get<T>("/getCredentialDetail", params);
