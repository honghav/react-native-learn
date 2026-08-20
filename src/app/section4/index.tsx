import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Section4() {
    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Section 4 - WebSocket</Text>


            <View className="h-16 bg-slate-400 w-full rounded-xl flex-row justify-center items-center text-white">
                <TouchableOpacity className="bg-gray-500 p-2 rounded-xl mx-2" onPress={() => { router.replace('/section4/payment') }} ><Text className="text-black font-bold text-lg">Payment</Text></TouchableOpacity>
                <TouchableOpacity className="bg-gray-500 p-2 rounded-xl mx-2" onPress={() => { router.replace('/section4/chat_message') }} ><Text className="text-black font-bold text-lg">Chat Message</Text></TouchableOpacity>
            </View>


        </View>
    );
}
