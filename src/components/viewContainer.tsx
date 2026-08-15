import { View } from "react-native";

type props = {
    children: React.ReactNode;
}

export default function ViewContainer({ children }: props) {
    return (
        <View className="w-full p-4 bg-slate-100 rounded-xl my-2 shadow-sm">
            {children}
        </View>
    )
}