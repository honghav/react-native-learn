import { Link } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

type props = {
    title: string;
}

export default function NavBarProject1({ title }: props) {
    return (<>

        <ScrollView >
            <View className="bg-black h-16 w-full flex-wrap gap-4 px-6 justify-center rounded-xl ">
                <Link href="../section2">
                    <Image source={require('@/assets/images/home.png')} style={{ width: 52, height: 52, backgroundColor: "white", borderRadius: 90, padding: 16 }} />
                </Link>
                <View className="w-full">
                    <Text className="text-white font-semibold text-sm">{title}</Text>
                </View>
            </View>
        </ScrollView>

    </>)
}