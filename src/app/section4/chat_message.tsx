import { ChatMessageDTO, sendChatMessage, subscribeToRealtimeChat } from "@/services/firebase";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ChatMessage() {
    const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
    const [text, setText] = useState("");
    const [sender, setSender] = useState("User 1");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    const flatListRef = useRef<FlatList>(null);

    // Subscribe to Firebase Firestore real-time updates
    useEffect(() => {
        const unsubscribe = subscribeToRealtimeChat((newMessages) => {
            setMessages(newMessages);
            setLoading(false);
        });

        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, []);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim() || sending) return;

        const currentText = text.trim();
        setText("");
        setSending(true);

        try {
            await sendChatMessage(currentText, sender);
        } catch (error) {
            console.error("Failed to send message:", error);
            setText(currentText); // restore text on error
        } finally {
            setSending(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* Header */}
                <View className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.replace("/section4")}
                        className="bg-slate-700 px-3 py-1.5 rounded-lg"
                    >
                        <Text className="text-white font-semibold">← Back</Text>
                    </TouchableOpacity>

                    <Text className="text-white font-bold text-lg">Firebase Live Chat</Text>

                    {/* Sender Toggle Pill */}
                    <TouchableOpacity
                        onPress={() => setSender((prev) => (prev === "User 1" ? "User 2" : "User 1"))}
                        className="bg-indigo-600 px-3 py-1.5 rounded-full"
                    >
                        <Text className="text-white text-xs font-bold">Role: {sender}</Text>
                    </TouchableOpacity>
                </View>

                {/* Chat Messages List */}
                <View className="flex-1 px-4 py-2">
                    {loading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color="#6366f1" />
                            <Text className="text-slate-400 mt-2 text-sm">Connecting to Firebase...</Text>
                        </View>
                    ) : messages.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-slate-500 text-base">No messages yet. Say hello! 👋</Text>
                        </View>
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item, index) => item.id || index.toString()}
                            renderItem={({ item }) => {
                                const isMe = item.sender === sender;

                                return (
                                    <View
                                        className={`my-1.5 max-w-[80%] ${
                                            isMe ? "self-end" : "self-start"
                                        }`}
                                    >
                                        {!isMe && (
                                            <Text className="text-slate-400 text-xs mb-1 ml-1 font-medium">
                                                {item.sender}
                                            </Text>
                                        )}
                                        <View
                                            className={`px-4 py-2.5 rounded-2xl ${
                                                isMe
                                                    ? "bg-indigo-600 rounded-br-none"
                                                    : "bg-slate-700 rounded-bl-none"
                                            }`}
                                        >
                                            <Text className="text-white text-base leading-5">
                                                {item.text}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    )}
                </View>

                {/* Input Bar */}
                <View className="p-3 bg-slate-800 border-t border-slate-700 flex-row items-center gap-2">
                    <TextInput
                        className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-full border border-slate-700 text-base"
                        placeholder="Type a message..."
                        placeholderTextColor="#94a3b8"
                        value={text}
                        onChangeText={setText}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                    />

                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={sending || !text.trim()}
                        className={`px-5 py-2.5 rounded-full flex-row items-center justify-center ${
                            !text.trim() || sending ? "bg-slate-700" : "bg-indigo-600"
                        }`}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text className="text-white font-bold">Send</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
