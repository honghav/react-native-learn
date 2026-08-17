import { ExpenseItem, RecentExpensesProps } from "@/model/project1/expense/expense.dto";
import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function ExpenseRow({
    title,
    category,
    amount,
    date,
}: ExpenseItem) {
    const formattedAmount =
        typeof amount === "number"
            ? `-$${amount.toFixed(2)}`
            : amount?.toString().startsWith("-")
                ? amount
                : `-$${amount}`;

    const categoryName =
        typeof category === "object" && category?.name
            ? category.name
            : typeof category === "string"
                ? category
                : "General";

    const iconName =
        typeof category === "object" && category?.iconName
            ? (category.iconName as keyof typeof AntDesign.glyphMap)
            : "rest";

    const iconColor =
        typeof category === "object" && category?.color
            ? category.color
            : "#2563eb";

    return (
        <View className="w-full flex-row items-center justify-between bg-white rounded-2xl p-3.5 my-1.5 border border-slate-100 shadow-sm shadow-slate-200/40">
            {/* Icon Badge - Soft light blue rounded square */}
            <View className="w-12 h-12 rounded-2xl items-center justify-center bg-blue-100/70">
                <AntDesign name={iconName} size={22} color={iconColor} />
            </View>

            {/* Title & Description / Category Column */}
            <View className="flex-1 mx-3 justify-center">
                <Text
                    className="text-slate-900 font-bold text-base"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
                <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>
                    {categoryName}
                </Text>
            </View>

            {/* Amount */}
            <Text className="text-slate-900 font-extrabold text-base">{formattedAmount}</Text>
        </View>
    );
}

// Helper to determine header label: TODAY, YESTERDAY, or Month Date
const getDateHeaderLabel = (dateInput?: Date | string): string => {
    if (!dateInput) return "OTHER";
    const dateObj = new Date(dateInput);
    if (isNaN(dateObj.getTime())) return "OTHER";

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear();

    if (isToday) return "TODAY";

    const isYesterday =
        dateObj.getDate() === yesterday.getDate() &&
        dateObj.getMonth() === yesterday.getMonth() &&
        dateObj.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return "YESTERDAY";

    const monthName = dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    if (year === today.getFullYear()) {
        return `${day} ${monthName}`;
    }
    return `${day} ${monthName} ${year}`;
};

interface GroupedExpenses {
    header: string;
    items: ExpenseItem[];
}

const groupExpensesByDate = (items: ExpenseItem[]): GroupedExpenses[] => {
    const groupsMap = new Map<string, ExpenseItem[]>();

    items.forEach((item) => {
        const header = getDateHeaderLabel(item.date);
        if (!groupsMap.has(header)) {
            groupsMap.set(header, []);
        }
        groupsMap.get(header)!.push(item);
    });

    const groups: GroupedExpenses[] = [];
    groupsMap.forEach((groupItems, header) => {
        groups.push({ header, items: groupItems });
    });

    return groups;
};

export default function RecentExpenses({ items }: RecentExpensesProps) {
    if (!items || items.length === 0) {
        return (
            <View className="w-full my-8 items-center justify-center">
                <Text className="text-slate-400 font-medium text-sm">No expenses found</Text>
            </View>
        );
    }

    const grouped = groupExpensesByDate(items);

    return (
        <View className="w-full">
            {grouped.map((group) => (
                <View key={group.header} className="mb-2">
                    <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 mt-3 ml-1">
                        {group.header}
                    </Text>
                    {group.items.map((item, index) => (
                        <ExpenseRow key={item.id || index} {...item} />
                    ))}
                </View>
            ))}
        </View>
    );
}

