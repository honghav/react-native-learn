import { listData, sectionListData } from "@/model/section1/section1.data";
import { ListDTO } from "@/model/section1/section1.dto";
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, FlatList, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, VirtualizedList } from "react-native";

export default function SessionI() {
    const router = useRouter()
    const [count, setCount] = useState(0);
    const onPress = () => setCount(prevCount => prevCount + 1);
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <ScrollView className="grid grid-cols-1 gap-4 p-4 bg-slate-50 flex-1  rounded-xl shadow-sm border border-slate-200">
            <View className="h-10 my-4">
                <TouchableOpacity style={styles.button} onPress={() => router.push('/section1/section1-flexbox')} >
                    <Text style={{ color: 'white' }} >View Flexbox</Text>
                </TouchableOpacity>
            </View>
            {/* Text */}
            <Text className="text-lg font-bold my-2 text-slate-800">Example 1: View & Text</Text>
            {/* View */}
            <View className="h-10 bg-sky-200 w-full my-2 rounded-md" />
            {/* Image */}
            <Text className="text-lg font-bold my-2 text-slate-800">Example 2: Image & Icon</Text>
            <View className="flex-row gap-4  justify-center items-center my-2">
                <Image source={require('@/assets/images/home.png')} style={styles.image1} />
                <Ionicons name="battery-charging-outline" size={56} color="#007AFF" />
                <AntDesign name="alipay" size={24} color="black" />            </View>

            {/* List FlatList, SectionList, VirtualizedList */}
            <View className="mb-6">
                <Text className="text-lg font-bold my-2 text-slate-800">Example 4: List (FlatList, SectionList, VirtualizedList)</Text>

                {/* FlatList */}
                <Text className="text-base font-semibold my-2 text-slate-700">FlatList Example</Text>
                <FlatList
                    data={listData ?? []}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View className="p-3 my-1 bg-white rounded-lg border border-slate-200">
                            <Text>FlatList: {item.name}</Text>
                        </View>
                    )}
                />

                {/* SectionList */}
                <Text className="text-base font-semibold mt-4 mb-2 text-slate-700">SectionList Example</Text>
                <SectionList
                    sections={sectionListData ?? []}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.header}>
                            <Text style={styles.headerText}>{title}</Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemText}>{item.name}</Text>
                        </View>
                    )}

                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    stickySectionHeadersEnabled={true}
                />

                {/* VirtualizedList */}
                <Text className="text-base font-semibold mt-4 mb-2 text-slate-700">VirtualizedList Example</Text>
                <VirtualizedList<ListDTO>
                    data={listData ?? []}
                    keyExtractor={(item) => item.id.toString()}
                    getItemCount={(data) => data?.length ?? 0}
                    getItem={(data, index) => data[index]}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View className="p-3 my-1 bg-white rounded-lg border border-slate-200">
                            <Text>VirtualizedList: {item.name}</Text>
                        </View>
                    )}
                />

            </View>
            {/* Input Text, Pressable, Tochopacity */}
            <Text className="text-lg font-bold my-2 text-slate-800">Example 3: TextInput & Pressable</Text>

            {/* TextInput */}
            <TextInput placeholder="Fill Name" style={styles.textInput} />
            {/* Pressable */}
            <View className="h-10 my-4">
                <Pressable style={styles.button} >
                    <Text>Submit</Text>
                </Pressable>
            </View>
            {/* TouchableOpacity */}
            <View className="h-10">
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text>Press Here {count}</Text>
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Text className="text-lg font-bold my-2 text-slate-800">Example 5: Modal</Text>
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    (!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>
                        <View className="h-10 w-full" >
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <View className="h-10 w-full" >
                <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.textStyle}>Show Modal</Text>
                </Pressable>
            </View>

            {/* KeyboardAvoidingView */}
            <Text className="text-lg font-bold my-2 text-slate-800">Example 6: KeyboardAvoidingView</Text>

            <View className=" h-fit w-full" >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inner}>
                            <Text style={styles.header}>Header</Text>
                            <TextInput placeholder="Username" style={styles.textInput} />
                            <View style={styles.btnContainer}>
                                <Button title="Submit" onPress={() => null} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image1: {
        width: 80,
        height: 80,
    },
    // List
    header: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginTop: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    item: {
        backgroundColor: '#ffffff',
        padding: 16,
    },
    itemText: {
        fontSize: 15,
        color: '#333333',
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
    },
    // TextInput
    textInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    // Pressable
    button: {
        backgroundColor: '#007AFF',
        width: '100%',
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Modal
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        width: '80%',
        height: 'auto',
        backgroundColor: 'gray',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: 'white',
    },

    // KeyboardAvoidingView
    container: {
        flex: 1
    },
    inner: {

        flex: 1,
        justifyContent: 'space-around',
    },

    btnContainer: {
        backgroundColor: 'white',
        marginTop: 12,
    },

});

