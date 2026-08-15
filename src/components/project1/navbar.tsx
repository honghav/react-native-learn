import { Link, router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type props = {
    title: string;
}

export default function NavBarProject1({ title }: props) {
    return (<>

        <ScrollView >
            <View className=" bg-slate-100 h-16 w-full flex-wrap gap-4 px-6 justify-center rounded-xl ">
                <TouchableOpacity activeOpacity={0.7} onPress={() => { router.back() }}  >
                    <Image source={require('@/assets/images/home.png')} style={{ width: 52, height: 52, backgroundColor: "white", borderRadius: 90, padding: 16 }} />
                </TouchableOpacity>
                <View className="w-full">
                    <Text className="text-black font-semibold text-sm">{title}</Text>
                </View>
            </View>
            {/* <TouchableOpacity activeOpacity={0.7} onPress={() => { router.push('/section2/expense_form/expense_form') }} style={style.btnAddExpense} >
                <AntDesign name="plus" size={30} color="white" />
            </TouchableOpacity> */}
        </ScrollView>

    </>)
}