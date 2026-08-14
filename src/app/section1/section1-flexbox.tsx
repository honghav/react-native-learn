import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

function BoxItem({ title, color }: { title: string, color: string }) {
    return (
        <View className={`${color} h-full w-full w-[24%] h-20 flex items-center justify-center  `}>
            <Text>{title}</Text>
        </View>
    )
}

export default function Flexbox() {
    const router = useRouter()
    return (
        <View className="flex-1  bg-slate-100 p-5 rounded-2xl shadow-sm">
            <Text>Flexbox</Text>
            <View className="h-10 my-4 flex items-center justify-center">
                <TouchableOpacity className='w-full h-full bg-blue-500 rounded-xl shadow-sm flex items-center justify-center' onPress={() => router.back()} >
                    <Text style={{ color: 'white' }} >Back To Section 1</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row gap-2  w-full">
                {/* If using gap-2 (8px), width is roughly calc((100% - gap) / 5) or w-[18%] */}
                <BoxItem title="Box 1" color="bg-red-200" />
                <BoxItem title="Box 2" color="bg-blue-200" />
                <BoxItem title="Box 3" color="bg-green-200" />
                <BoxItem title="Box 4" color="bg-yellow-200" />

            </View>
        </View>
    )
} 