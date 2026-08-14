import { LoginDTO } from "@/model/project1/auth/login.dto";
import { loginServive } from "@/services/project1/login";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Label } from "expo-router/build/react-navigation";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Section2() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const loginPress = async (data: LoginDTO) => {
        const success = await loginServive(data);
        if (success) {
            router.push("../section2/dashboard");
        }
    };
    return (
        <ScrollView className=" p-4 bg-slate-50 flex-1  rounded-xl shadow-sm border border-slate-200">
            <View style={styles.container} className="" >
                {/* Icon Container */}
                <View style={styles.loginIconContainer} className="my-5">
                    {/* <Text className="text-center text-3xl ">HI</Text> */}
                    <Entypo name="home" size={46} color="black" />
                </View>
                {/* Teaxt Header */}
                <Text className="text-center text-xl my-3 font-bold">Welcome Back</Text>
                <Text className="text-center text-sm  font-normal text-gray-500">Log in to manage your financial wellness.</Text>

                {/* Input Container */}
                <View style={styles.formContainer}>
                    <View  >
                        <Label style={styles.labelInput} >Email</Label>
                        <TextInput style={styles.inputFill} placeholder="Email" value={username} onChangeText={setUsername} />
                    </View>
                    <View  >
                        <Label style={styles.labelInput} >Password</Label>
                        <TextInput style={styles.inputFill} placeholder="Password" value={password} onChangeText={setPassword} />
                    </View>
                    <View className="h-10 w-full">
                        <TouchableOpacity style={styles.button} onPress={() => loginPress({ username, password })}>
                            <Text className="text-white">Login </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text className="text-center text-sm font-medium mt-6">Don't have an account? <Text className="font-semibold underline">Sign Up</Text></Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 12,
        width: "100%",
        borderWidth: 1,
        borderColor: "#94a3b8",
        alignItems: "center",
    },

    loginIconContainer: {
        width: 80,
        height: 80,
        backgroundColor: "#e1e9e1ff",
        borderRadius: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    formContainer: {
        width: "100%",
        flex: 1,
        rowGap: 16,
        columnGap: 16,
        paddingVertical: 16,
    },
    inputFill: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: "100%",
        borderWidth: 1,
        borderColor: "#94a3b8",
    },
    labelInput: {
        textAlign: "left",
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 600,
        color: "#1e293b",
    },
    // Pressable
    button: {
        backgroundColor: '#282828ff',
        width: '100%',
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
