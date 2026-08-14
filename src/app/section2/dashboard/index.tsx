import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

export default function DashboardProject1() {
    return (
        <View className="flex-1 justify-center items-center ">
            <View className="bg-black h-24 w-full flex-wrap gap-4 px-6 justify-center rounded-xl ">
                <Link href="../section2">
                    <Image source={require('@/assets/images/home.png')} style={{ width: 48, height: 48, backgroundColor: "white", borderRadius: 8, padding: 8 }} />
                </Link>
            </View>
            <Text className="text-2xl font-bold">Welcome to Dashboard</Text>
        </View>
    )
}