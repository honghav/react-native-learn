import { Link, router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type props = {
    title: string;
}

export default function NavBarProject1({ title }: props) {
    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/section2/dashboard');
        }
    };

    return (<>

        <ScrollView >
            <View className=" bg-slate-100 h-16 w-full flex-wrap gap-4 px-6 justify-center rounded-xl ">
                <TouchableOpacity activeOpacity={0.7} onPress={handleBack}  >
                    <Image source={require('@/assets/images/home.png')} style={{ width: 32, height: 32, backgroundColor: "white", borderRadius: 90, padding: 16 }} />
                </TouchableOpacity>
                <View className="w-full">
                    <Text className="text-black font-semibold text-sm">{title}</Text>
                </View>
            </View>
        </ScrollView>

    </>)
}