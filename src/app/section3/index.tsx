import ViewContainer from "@/components/viewContainer";
import { modulePermission } from "@/model/module/module.data";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Section3() {

    return (
        <ScrollView>
            <ViewContainer>
                <Text className="text-2xl font-bold text-center">Advaned Permission Phone</Text>
                <View className="space-y-2">
                    {modulePermission.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} className="flex-row justify-between items-center my-2 px-4 py-2 bg-slate-400 rounded-lg" onPress={() => { router.push(item.path) }} >
                                <View className="  w-10 h-10 p-1 bg-white rounded-lg " >
                                    <Ionicons name={item.icon} size={32} color="black" />
                                </View>
                                <Text className="text-base font-bold">{item.name}</Text>
                                <Ionicons name="arrow-forward" size={20} color="black" />
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ViewContainer>
        </ScrollView>
    );
}