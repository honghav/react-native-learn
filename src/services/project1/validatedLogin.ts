import { loginData } from "@/model/project1/auth/login.data";
import { LoginDTO } from "@/model/project1/auth/login.dto";
import { Alert } from "react-native";

export function validatedLoginSerive(data: LoginDTO) {
    // Check User is Empty Fill
    if (!data.username) {

        return Alert.alert('Username is Require!')
    }
    if (!data.password) {
        return Alert.alert('Password is Require!')
    }

    const userName = data.username
    const passWord = data.password

    const getUserData = loginData

    const userNameFilter = getUserData.filter((item) => item.username == userName)
    const passWordFilter = getUserData.filter((item) => item.password == passWord)

    if (userNameFilter.length == 0) {
        return Alert.alert('Username is not valid!')
    }
    if (passWordFilter.length == 0) {
        return Alert.alert('Password is not valid!')
    }

    // Validate Login Success
    return true

}