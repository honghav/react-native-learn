import MonthlyBudgetCard from "@/components/project1/monthlyBudgetCard";
import NavBarProject1 from "@/components/project1/navbar";
import RecentExpenses from "@/components/project1/RecentExpenses";
import ViewContainer from "@/components/viewContainer";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DashboardProject1() {
    return (
        <View style={style.screenContainer}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
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
            </ScrollView>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { router.push('/section2/expense_form/expense_form') }}
                style={[
                    style.btnAddExpense,
                    { position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any }
                ]}
            >
                <AntDesign name="plus" size={26} color="white" />
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
        position: 'relative',
        height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
        maxHeight: Platform.OS === 'web' ? ('100vh' as any) : '100%',
        overflow: 'hidden',
    },
    btnAddExpense: {
        bottom: 8,
        right: 8,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        // Elevation for Android
        elevation: 6,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
    }
})