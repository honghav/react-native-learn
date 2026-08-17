import NavBarProject1 from "@/components/project1/navbar";
import RecentExpenses from "@/components/project1/RecentExpenses";
import ViewContainer from "@/components/viewContainer";
import { expenseItemData } from "@/model/project1/expense/expense.data";
import { useReportExpense } from "@/services/project1/report/reportExpenseService";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function ReportExpense() {
    const {
        selectedDateFilter,
        filteredData,
        hanldeFilterDate,
        dateFormated,
        dateFilter,
    } = useReportExpense();

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
                                ${filteredData.reduce((acc, curr) => acc + curr.amount, 0)}
                            </Text>
                        </View>
                        <View className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                            <Text className="text-xs font-semibold text-blue-600 capitalize">
                                {selectedDateFilter} View
                            </Text>
                        </View>
                    </View>

                    {filteredData.length === 0 ? (
                        <View className="py-12 items-center justify-center">
                            <Text className="text-slate-400 font-medium text-sm">
                                No expense records found for this period.
                            </Text>
                        </View>
                    ) : (
                        <View className="items-center overflow-hidden pt-2">
                            <BarChart
                                // LinearGradient={LinearGradient}
                                data={filteredData.map((item) => ({
                                    value: item.amount,
                                    label: dateFormated(item.date),
                                    frontColor: '#2563EB',
                                    gradientColor: '#60A5FA',
                                    topLabelComponent: () => (
                                        <Text className="text-[10px] font-bold text-slate-600 mb-1">
                                            ${item.amount}
                                        </Text>
                                    ),
                                }))}
                                barWidth={28}
                                spacing={24}
                                initialSpacing={16}
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
                                xAxisLabelTextStyle={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}
                            />
                        </View>
                    )}
                </View>
            </ViewContainer>

            <ViewContainer>
                <Text>Top Spending </Text>
                <RecentExpenses items={expenseItemData} />
            </ViewContainer>
        </ScrollView >
    )
}