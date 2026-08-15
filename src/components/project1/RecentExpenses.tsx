import { expenseItemData } from "@/model/project1/expense/expense.data";
import { ExpenseItem, RecentExpensesProps } from "@/model/project1/expense/expense.dto";
import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function ExpenseRow({
    title,
    category,
    amount,

}: ExpenseItem) {
    const formattedAmount =
        typeof amount === "number" ? `-$${amount.toFixed(2)}` : amount;

    return (
        <View className="w-full flex-row items-center justify-between bg-slate-100 rounded-2xl p-3.5 my-1.5 shadow-sm">
            {/* Icon Badge */}
            <View
                className={`w-12 h-12 rounded-full items-center justify-center bg-${category.color}-200`}
            >
                <AntDesign name={category.iconName} size={22} color={`${category.color}`} />
            </View>

            {/* Title & Category Column */}
            <View className="flex-1 mx-3 justify-center">
                <Text
                    className="text-slate-900 font-semibold text-sm"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
                <Text className="text-slate-500 text-xs mt-0.5">{category.name}</Text>
            </View>

            {/* Amount */}
            <Text className="text-slate-900 font-bold text-sm">{formattedAmount}</Text>
        </View>
    );
}

export default function RecentExpenses({
    items = expenseItemData,
}: RecentExpensesProps) {
    // If an array of items is provided, render the list
    if (items && items.length > 0) {
        return (
            <View className="w-full">
                {items.map((item, index) => (
                    <ExpenseRow key={item.id || index} {...item} />
                ))}
            </View>
        );
    }

    // Default single item render
    return (
        <View className="w-full" ><Text className="text-center text-gray-500 font-semibold my-8 text-xl">No expenses found</Text></View>
    );
}