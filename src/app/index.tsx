import { moduleData } from "@/model/module/module.data";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";


export default function HomeScreen() {
  return (
    <View className="flex flex-col w-full gap-4 items-center justify-center bg-slate-100 p-5 rounded-2xl shadow-sm">
      {moduleData.map((module) => (
        <Link key={module.id} href={module.path} asChild>
          <Pressable className="w-full items-center justify-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 active:bg-slate-50">
            <Text className="text-xl font-bold text-sky-600">
              {module.name}
            </Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}


