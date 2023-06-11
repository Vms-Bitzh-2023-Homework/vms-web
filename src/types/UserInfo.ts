export interface UserInfo {
    userName: string;
    userRole: string;
    userID: number;
}

export interface ChangePwdForm {
    oldPwd: string,
    newPwd: string,
    confirmPwd: string
}