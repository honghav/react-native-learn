import { Text, View } from "react-native";

type MonthlyBudgetCardProps = {
    title?: string;
    spent?: number;
    total?: number;
};

export default function MonthlyBudgetCard({
    title = "Monthly Budget",
    spent = 850,
    total = 1500,
}: MonthlyBudgetCardProps) {
    const percentage = Math.round((spent / total) * 100);
    const remaining = total - spent;

    return (
        <View className="w-full bg-slate-100 rounded-2xl p-5 shadow-lg my-2">
            {/* Header Row */}
            <View className="w-full flex-row justify-between items-center mb-3">
                <Text className="text-slate-900 font-bold text-xl">{title}</Text>
                <Text className="text-slate-600 font-semibold text-base">
                    ${spent.toLocaleString()} / ${total.toLocaleString()}
                </Text>
            </View>

            {/* Progress Bar */}
            <View className="w-full h-3.5 bg-blue-100/80 rounded-full overflow-hidden my-1">
                <View
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </View>

            {/* Footer Row */}
            <View className="w-full flex-row justify-between items-center mt-3">
                <Text className="text-slate-500 font-semibold text-sm">{percentage}% Spent</Text>
                <Text className="text-slate-700 font-bold text-sm">
                    ${remaining.toLocaleString()} Remaining
                </Text>
            </View>
        </View>
    );
}
