export interface UserInfo {
    userName: string;
    userRole: string;
    userID: number;
}

export interface ChangePwdForm {
    oldPassword: string,
    newPassword: string,
    checkPassword: string
}

export interface AddUserForm {
    userName: string,
    password: string,
    adPhone: string,
    perms: string,
    confirmPwd: string
}