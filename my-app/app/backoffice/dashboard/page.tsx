"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { config } from "@/app/config";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function Page() {
    const [data, setData] = useState<any[]>([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalRepair, setTotalRepair] = useState(0);
    const [totalSale, setTotalSale] = useState(0);


    useEffect(() => {
        fetchData();
        renderChart();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/sell/dashboard`);
            setTotalIncome(res.data.totalIncome);
            setTotalRepair(res.data.totalRepair);
            setTotalSale(res.data.totalSale);
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาดในการรับข้อมูล",
                text: error.message,
            });
        }
    }

    const renderChart = () => {
        const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const monthsData = months.map((month) => ({
            month: month,
            income: Math.floor(Math.random() * 100000),
        }));
        setData(monthsData);
    };

    const StatBox = ({ color, label, value }: { color: string; label: string; value: string }) => (
        <div className={`flex flex-col items-start justify-center ${color} rounded-2xl p-6 w-full shadow-md`}>
            <div className="text-white text-lg">{label}</div>
            <div className="text-white text-3xl font-bold">{value}</div>
        </div>
    );

    return (
        <div>
            <h1 className="container-header">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatBox color="bg-purple-500" label="ยอดขายทั้งหมด" value={totalIncome.toLocaleString() + " บาท"} />
                <StatBox color="bg-blue-500" label="รายการขาย" value={totalSale.toLocaleString() + " รายการ"} />
                <StatBox color="bg-green-500" label="งานรับซ่อม" value={totalRepair.toLocaleString() + " งาน"} />
            </div>

            <div className="text-center mb-4 text-xl font-bold">รายได้แต่ละเดือน</div>
            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `รายได้ ${value.toLocaleString()} บาท`} />
                        <Legend />
                        <Bar dataKey="income" fill="#14b8a6" opacity={0.8} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
