import getApi from "@/constants/restful_api/check_status_get";
import postApi from "@/constants/restful_api/post_api";
import { CheckStatusResDTO, CutLuyReqDTO } from "@/model/section4/cutluy.dto";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Socket } from "socket.io-client";

// Replace with your Socket.IO server URL
const SOCKET_SERVER_URL = "http://localhost:3000";

export default function Payment() {
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [checkingData, setCheckingData] = useState<CheckStatusResDTO | null>(null);

    const socketRef = useRef<Socket | null>(null);

    const handlePostApi = async () => {
        setLoading(true);
        setCheckingData(null);
        handleCloseChecking(); // Stop any active check

        const payload: CutLuyReqDTO = {
            amount: 0.1,
            reference_id: `order_${Date.now()}` // Dynamic reference ID
        };

        try {
            const req = await postApi(payload);
            console.log("Payment Created:", req);
            setPaymentData(req);
        } catch (error) {
            console.log("Error creating payment:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckStatusApi = async (id: string) => {
        setLoading(true);
        try {
            const res = await getApi(id);
            console.log("Payment Check Status:", res);
            setCheckingData(res);
            return res;
        } catch (error) {
            console.log("Error Check Status:", error);
        } finally {
            setLoading(false);
        }
    };

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Start Real-Time Auto Checking (Polls CutLuy REST API every 3 seconds)
    const handleStartAutoCheck = (paymentId: string) => {
        if (!paymentId) return;

        handleCloseChecking(); // Stop existing check timer
        setIsChecking(true);
        console.log("Started Auto Status Check for:", paymentId);

        // Immediately check once
        handleCheckStatusApi(paymentId);

        // Poll every 3 seconds
        timerRef.current = setInterval(async () => {
            try {
                const res = await getApi(paymentId);
                console.log("Auto Check Status Received:", res);
                setCheckingData(res);

                // Auto stop checking when payment completes
                if (res?.status === "approved" || res?.status === "completed" || res?.status === "paid") {
                    handleCloseChecking();
                }
            } catch (err) {
                console.log("Auto check error:", err);
            }
        }, 3000);
    };

    // Close / Stop Checking
    const handleCloseChecking = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsChecking(false);
        console.log("Status checking closed");
    };

    // Auto connect check when payment is created
    useEffect(() => {
        if (paymentData?.id) {
            handleStartAutoCheck(paymentData.id);
        }

        return () => {
            handleCloseChecking();
        };
    }, [paymentData?.id]);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Section 4 - CutLuy Payment</Text>

            <TouchableOpacity
                onPress={handlePostApi}
                disabled={loading}
                style={{
                    backgroundColor: "red",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center"
                }}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>Create Payment</Text>
                )}
            </TouchableOpacity>

            {paymentData && (
                <View style={{ marginTop: 20, padding: 15, backgroundColor: "#f0f0f0", borderRadius: 8 }}>
                    <Text style={{ fontWeight: "bold" }}>Status: {paymentData.status}</Text>
                    <Text>Order Id: {paymentData.id}</Text>
                    <Text>Amount: ${paymentData.amount}</Text>
                    <Text style={{ marginTop: 4 }}>Reference ID: {paymentData.reference_id}</Text>

                    {paymentData.qr_string ? (
                        <View style={{ alignItems: "center", marginVertical: 15, padding: 10, backgroundColor: "white", borderRadius: 8 }}>
                            <QRCode
                                value={paymentData.qr_string}
                                size={180}
                            />
                        </View>
                    ) : null}

                    {/* Manual REST API check button */}
                    <TouchableOpacity
                        onPress={() => { handleCheckStatusApi(paymentData.id) }}
                        style={{ marginTop: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 6 }}
                    >
                        <Text style={{ color: "white", textAlign: "center" }}>
                            {loading ? "Checking REST API..." : "Check Status (REST API)"}
                        </Text>
                    </TouchableOpacity>

                    {/* Close / Stop Checking Button */}
                    {isChecking ? (
                        <TouchableOpacity
                            onPress={handleCloseChecking}
                            style={{ marginTop: 10, backgroundColor: "#dc3545", padding: 10, borderRadius: 6 }}
                        >
                            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                                🔴 Stop Auto Checking
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => handleStartAutoCheck(paymentData.id)}
                            style={{ marginTop: 10, backgroundColor: "#28a745", padding: 10, borderRadius: 6 }}
                        >
                            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                                🟢 Start Auto Checking
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <View style={{ marginTop: 15 }}>
                <Text style={{ color: "black", fontWeight: "bold" }}>
                    Auto Check Status: {isChecking ? "🟢 Active (Auto Checking...)" : "🔴 Stopped"}
                </Text>
                <Text style={{ color: "black" }}>ID: {checkingData ? checkingData.id : ""}</Text>
                <Text style={{ color: "black" }}>Status: {checkingData ? checkingData.status : ""}</Text>
                <Text style={{ color: "black" }}>Amount: {checkingData ? checkingData.amount : ""}</Text>
                <Text style={{ color: "black" }}>Create At: {checkingData ? checkingData.created_at : ""}</Text>
                <Text style={{ color: "black" }}>Approve At: {checkingData ? checkingData.approved_at : ""}</Text>
            </View>
        </View>
    );
}
