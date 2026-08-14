import "../global.css";
import { Link, Slot } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow items-center justify-start p-5"
      >
        <View className="w-full max-w-[428px] justify-center mb-6">
          <Link href={'/'} asChild>
            <Pressable className="w-full items-center justify-center bg-red-200 p-4 rounded-2xl shadow-sm border border-slate-300">
              <Text className="text-xl font-bold text-red-800">
                Back To Home
              </Text>
            </Pressable>
          </Link>
        </View>

        <View className="w-full max-w-[428px]">
          <Slot />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}