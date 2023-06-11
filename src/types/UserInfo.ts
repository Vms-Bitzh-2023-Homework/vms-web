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

export interface AddUserForm {
    userName: string,
    password: string,
    adPhone: string,
    perms: string,
    confirmPwd: string
}