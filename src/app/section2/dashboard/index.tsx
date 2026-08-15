import MonthlyBudgetCard from "@/components/monthlyBudgetCard";
import NavBarProject1 from "@/components/project1/navbar";
import RecentExpenses from "@/components/project1/RecentExpenses";
import ViewContainer from "@/components/viewContainer";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function DashboardProject1() {
    return (
        <View className="bg-white flex-1 p-4">
            <View className="w-full">
                <NavBarProject1 title="Dashboard" />
            </View>

            <View className="my-4 w-full">
                <Text className="text-xl font-bold">Welcome to Dashboard</Text>
            </View>

            <ViewContainer>
                <View className="w-full flex-row justify-between items-center">
                    <Text className="text-gray-500 font-semibold text-xs">Total Balance</Text>
                    <View className="bg-green-200 rounded-full px-4 py-1">
                        <Text className="font-bold text-green-800 text-xs">July</Text>
                    </View>
                </View>
                <View className="w-full my-4">
                    <Text className="text-3xl font-bold">$12,562.39</Text>
                </View>
                <View className="w-full flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <AntDesign name="arrow-up" size={16} color="green" />
                        <Text className="font-bold text-green-600 text-xs ml-1">$1,200 IN</Text>
                    </View>
                    <View className="flex-row items-center">
                        <AntDesign name="arrow-down" size={16} color="red" />
                        <Text className="font-bold text-red-600 text-xs ml-1">$850 OUT</Text>
                    </View>
                </View>
            </ViewContainer>

            {/* Monthly Report Card */}
            <MonthlyBudgetCard spent={150} total={1500} />

            <View className="w-full my-4">
                <View className="w-full flex-row justify-between items-center">

                    <Text className="text-xl font-bold">Recent Expenses</Text>
                    <Text>History</Text>
                </View>
            </View>
            <RecentExpenses />
        </View>
    )
}

const style = StyleSheet.create({

})