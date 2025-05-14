"use client";

import { useState, useEffect,} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "@/app/config";
import Modal from "@/app/backoffice/modal";

export default function Page() {
    const [serial, setSerial] = useState('');
    const [price, setPrice] = useState(0);
    const [sells, setSells] = useState([]);
    const [id, setId] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);


    const handleSave = async () => {
        try {
            const payload = {
                serial: serial,
                price: price,
            };
            await axios.post(`${config.apiUrl}/sell/create`, payload);
            fetchData();
        } catch (error: any) {
            if (error.response.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่พบรายการสินค้าในสต๊อก",
                    timer: 1500,
                });
            } else {
                Swal.fire
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถบันทึกข้อมูลรายการขายได้",
                    timer: 1500,
                });
            }
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/sell/list`);
            setSells(res.data);

            let total = 0;
            for (let i = 0; i < res.data.length; i++) {
                total += res.data[i].price;
            }
            setTotalAmount(total);

        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถดึงข้อมูลรายการขายได้",
                timer: 1500,
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const button = await Swal.fire({
                title: "คุณแน่ใจหรือไม่?",
                text: "คุณต้องการลบรายการนี้",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "ใช่",
                cancelButtonText: "ยกเลิก",
            })
            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/sell/remove/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "ลบข้อมูลสำเร็จ",
                    text: "ข้อมูลรายการซื้อได้ถูกลบเรียบร้อยแล้ว",
                    timer: 1500,
                });
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถลบข้อมูลรายการขายได้",
                timer: 1500,
            });
        }
    }

    const handleConfirm = async () => {
        try {
            const button = await Swal.fire({
                title: "คุณแน่ใจหรือไม่?",
                text: "คุณต้องการยืนยันการขายสินค้า",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "ใช่",
                cancelButtonText: "ยกเลิก",
            })
            if (button.isConfirmed) {
                await axios.get(`${config.apiUrl}/sell/confirm`);
                Swal.fire({
                    icon: "success",
                    title: "ยืนยันการขายสำเร็จ",
                    text: "รายการขายได้ถูกยืนยันเรียบร้อยแล้ว",
                    timer: 1500,
                });
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถยืนยันการขายสินค้าได้",
                timer: 1500,
            });
        }
    }

    return (
        <div>
            <h1 className="container-header">ขายสินค้า</h1>
            <div className="flex gap-2 items-center">
                <div className="flex-1">
                    <div>serial</div>
                    <input
                        type="text"
                        className="w-full"
                        placeholder="กรอกหมายเลขเครื่อง"
                        onChange={(e) => setSerial(e.target.value)}
                    />
                </div>
                <div className="w-44">
                    <div>ราคา</div>
                    <input
                        type="number"
                        className="w-full text-left"
                        placeholder="กรอกราคาขาย"
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                </div>
                <div className="w-44 flex items-end mt-2">
                    <button className="btn-save w-full" onClick={handleSave}>
                        <i className="fas fa-save"></i>
                        บันทึกรายการขาย
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>serial</th>
                        <th>รายการสินค้า</th>
                        <th>ราคา</th>
                        <th className="w-[50px] text-center">ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    {sells.map((sells: any) => (
                        <tr key={sells.id}>
                            <td>{sells.product.serial}</td>
                            <td>{sells.product.name}</td>
                            <td>{sells.price.toLocaleString()}</td>
                            <td className="text-center">
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(sells.id)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {sells.length > 0 && (
                <>
                    <div className="mt-4 p-3 border rounded-md flex justify-between items-center bg-gray-50">
                        <div className="text-base font-medium">ยอดรวมทั้งหมด</div>
                        <div className="text-lg font-semibold text-green-700">
                            {totalAmount.toLocaleString()} บาท
                        </div>
                    </div>
                    <div className="mt-3 text-right">
                        <button
                            className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-700"
                            onClick={handleConfirm}
                        >
                            <i className="fas fa-check mr-2"></i>
                            ยืนยันการขาย
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}