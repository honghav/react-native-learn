import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";

export type ExpenseItem = {
    id?: string;
    title: string;
    category: string;
    amount: number | string;
    iconName?: keyof typeof AntDesign.glyphMap;
    iconBgColor?: string;
    iconColor?: string;
};

type RecentExpensesProps = {
    items?: ExpenseItem[];
    // Single item props as fallbacks if no items array is passed
    title?: string;
    category?: string;
    amount?: number | string;
    iconName?: keyof typeof AntDesign.glyphMap;
};

const DEFAULT_EXPENSES: ExpenseItem[] = [
    {
        id: "1",
        title: "Car Maintenance & Fuel",
        category: "Transportation",
        amount: 100,
        iconName: "car",
        iconBgColor: "bg-emerald-100",
        iconColor: "#059669",
    },
    {
        id: "2",
        title: "Dinner & Drinks",
        category: "Food & Dining",
        amount: 45.5,
        iconName: "rest",
        iconBgColor: "bg-orange-100",
        iconColor: "#ea580c",
    },
    {
        id: "3",
        title: "Grocery Shopping",
        category: "Groceries",
        amount: 82.3,
        iconName: "arrow-down",
        iconBgColor: "bg-blue-100",
        iconColor: "#2563eb",
    },
];

export function ExpenseRow({
    title,
    category,
    amount,
    iconName = "car",
    iconBgColor = "bg-emerald-100",
    iconColor = "#059669",
}: ExpenseItem) {
    const formattedAmount =
        typeof amount === "number" ? `-$${amount.toFixed(2)}` : amount;

    return (
        <View className="w-full flex-row items-center justify-between bg-slate-100 rounded-2xl p-3.5 my-1.5 shadow-sm">
            {/* Icon Badge */}
            <View
                className={`w-12 h-12 rounded-full items-center justify-center ${iconBgColor}`}
            >
                <AntDesign name={iconName} size={22} color={iconColor} />
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
                <Text className="text-slate-500 text-xs mt-0.5">{category}</Text>
            </View>

            {/* Amount */}
            <Text className="text-slate-900 font-bold text-sm">{formattedAmount}</Text>
        </View>
    );
}

export default function RecentExpenses({
    items,
    title = "Car Maintenance & Fuel",
    category = "Food & Drinks",
    amount = "$100",
    iconName = "car",
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
        <ExpenseRow
            title={title}
            category={category}
            amount={amount}
            iconName={iconName}
        />
    );
}