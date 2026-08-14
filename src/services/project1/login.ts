import { LoginDTO } from "@/model/project1/auth/login.dto";
import { validatedLoginSerive } from "./validatedLogin";


export async function loginServive(data: LoginDTO) {
    try {
        const validatedLogin = validatedLoginSerive(data)
        if (!validatedLogin) {
            return false
        }
        return true
    } catch (error) {
        return false
    }
}