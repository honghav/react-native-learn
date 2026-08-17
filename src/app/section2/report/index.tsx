import NavBarProject1 from "@/components/project1/navbar";
import RecentExpenses from "@/components/project1/RecentExpenses";
import ViewContainer from "@/components/viewContainer";
import { ExpenseItem } from "@/model/project1/expense/expense.dto";
import { handleGetExpense } from "@/services/project1/expense/expenseService";
import { getExpensesByFilter, useReportExpense } from "@/services/project1/report/reportExpenseService";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function ReportExpense() {
    const {
        selectedDateFilter,
        hanldeFilterDate,
        dateFilter,
    } = useReportExpense();

    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const data = await handleGetExpense();
            setExpenses(data);
        };
        fetchExpenses();
    }, []);

    // Dynamically calculate aggregated chart data from real Firestore expenses
    const filterType = (selectedDateFilter || 'week') as 'week' | 'month' | 'year';
    const chartData = getExpensesByFilter(expenses, filterType);
    const totalPeriodExpense = chartData.reduce((acc, curr) => acc + curr.total, 0);

    // Responsive bar sizing based on active filter mode
    const getChartLayout = () => {
        if (filterType === 'month') {
            return { barWidth: 38, spacing: 32, initialSpacing: 20, fontSize: 11 };
        }
        if (filterType === 'year') {
            return { barWidth: 14, spacing: 10, initialSpacing: 6, fontSize: 9 };
        }
        // week (7 bars: Mon - Sun)
        return { barWidth: 22, spacing: 16, initialSpacing: 10, fontSize: 10 };
    };

    const layout = getChartLayout();

    return (
        <ScrollView>
            <NavBarProject1 title="Report Expense" />

            <ViewContainer>
                <Text style={{ color: 'black', fontWeight: "bold", fontSize: 20 }}>Report Expense: </Text>
                <View className="flex-row bg-slate-200/80 p-1.5 rounded-2xl justify-between my-4 gap-2">
                    {dateFilter.map((item) => {
                        const isSelected = selectedDateFilter === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => hanldeFilterDate(item)}
                                activeOpacity={0.7}
                                className={`flex-1 py-2.5 px-3 rounded-xl justify-center items-center ${isSelected
                                    ? "bg-blue-600 shadow-sm shadow-blue-500/30"
                                    : "bg-transparent"
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-semibold capitalize ${isSelected ? "text-white" : "text-slate-600"
                                        }`}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {/* Modern Chart Card Container */}
                <View className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/60 my-2">
                    {/* Card Header Summary */}
                    <View className="flex-row justify-between items-center mb-6 px-1">
                        <View>
                            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Total Expense
                            </Text>
                            <Text className="text-2xl font-bold text-slate-900 mt-0.5">
                                ${totalPeriodExpense.toFixed(2)}
                            </Text>
                        </View>
                        <View className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                            <Text className="text-xs font-semibold text-blue-600 capitalize">
                                {selectedDateFilter} View
                            </Text>
                        </View>
                    </View>

                    {chartData.length === 0 || totalPeriodExpense === 0 ? (
                        <View className="py-12 items-center justify-center">
                            <Text className="text-slate-400 font-medium text-sm">
                                No expense records found for this period.
                            </Text>
                        </View>
                    ) : (
                        <View className="items-center overflow-hidden pt-2">
                            <BarChart
                                data={chartData.map((item) => ({
                                    value: item.total,
                                    label: item.label,
                                    frontColor: '#2563EB',
                                    gradientColor: '#60A5FA',
                                    topLabelComponent: () => (
                                        item.total > 0 ? (
                                            <Text style={{ fontSize: layout.fontSize }} className="font-bold text-slate-600 mb-1">
                                                ${item.total}
                                            </Text>
                                        ) : null
                                    ),
                                }))}
                                barWidth={layout.barWidth}
                                spacing={layout.spacing}
                                initialSpacing={layout.initialSpacing}
                                barBorderTopLeftRadius={8}
                                barBorderTopRightRadius={8}
                                showGradient
                                isAnimated
                                animationDuration={600}
                                noOfSections={4}
                                rulesType="dashed"
                                rulesColor="#E2E8F0"
                                dashWidth={4}
                                dashGap={4}
                                yAxisThickness={0}
                                xAxisColor="#CBD5E1"
                                xAxisThickness={1}
                                yAxisTextStyle={{ color: '#94A3B8', fontSize: 11 }}
                                xAxisLabelTextStyle={{ color: '#64748B', fontSize: layout.fontSize, fontWeight: '600' }}
                            />
                        </View>
                    )}
                </View>
            </ViewContainer>

            <ViewContainer>
                <View className="flex-row justify-between items-center mb-2">
                    <Text style={{ color: 'black', fontWeight: "bold", fontSize: 20 }}>Top Spending</Text>
                    <Text className="text-slate-500 font-semibold text-xs bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        All Months
                    </Text>
                </View>
                <RecentExpenses
                    items={[...expenses].sort((a, b) => {
                        const timeA = a.date ? new Date(a.date).getTime() : 0;
                        const timeB = b.date ? new Date(b.date).getTime() : 0;
                        return timeB - timeA;
                    })}
                />
            </ViewContainer>
        </ScrollView>
    );
}