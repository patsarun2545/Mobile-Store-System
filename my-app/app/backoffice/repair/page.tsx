"use client";

import { useState, useEffect, } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "@/app/config";
import Modal from "@/app/backoffice/modal";
import dayjs from "dayjs";

export default function Pate() {
    const [isOpenModal, setisOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [remark, setRemark] = useState('');
    const [id, setId] = useState('');
    const [repairs, setRepairs] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/service/list`);
            setRepairs(res.data);
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถดึงข้อมูลงานบริการได้",
                timer: 1500,
            });
        }
    };

    const handleOpenModal = () => {
        setisOpenModal(true);
    };

    const handleCloseModal = () => {
        setisOpenModal(false);
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: name,
                price: price,
                remark: remark,
            };

            if (id !== '') {
                await axios.put(`${config.apiUrl}/service/update/${id}`, payload);
            } else {
                await axios.post(`${config.apiUrl}/service/create`, payload);
            }
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ",
                text: "ข้อมูลรายการซื้อได้ถูกบันทึกเรียบร้อยแล้ว",
                timer: 1500,
            });
            handleCloseModal();
            handleClear();
            fetchData();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถบันทึกข้อมูลรายการซื้อได้",
                timer: 1500,
            });
        }
    };

    const handleClear = () => {
        setName("");
        setPrice(0);
        setRemark("");
    }

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
                await axios.delete(`${config.apiUrl}/service/remove/${id}`);
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

    const handleEdit = (id: number) => {
        const repair = repairs.find((repair: any) => repair.id === id) as any;
        if (repair) {
            setId(repair.id);
            setName(repair.name);
            setPrice(repair.price);
            setRemark(repair.remark);

            handleOpenModal();
        }
    }

    return (
        <div>
            <h1 className="container-header">งานบริการ</h1>
            <div>
                <button className="btn-save" onClick={() => { handleOpenModal(); handleClear(); }}>
                    <i className="fas fa-save"></i>บันทึกงานบริการ
                </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh] mt-4 rounded-md scrollbar-hide">
                <table>
                    <thead>
                        <tr>
                            <th>ชื่องานบริการ</th>
                            <th>ราคา</th>
                            <th>หมายเหตุ</th>
                            <th>วันที่ให้บริการ</th>
                            <th className="w-[100px] text-center">แก้ไข / ลบ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairs.map((repairs: any) => (
                            <tr key={repairs.id}>
                                <td>{repairs.name}</td>
                                <td>{repairs.price.toLocaleString()}</td>
                                <td>{repairs.release}</td>
                                <td>{dayjs(repairs.payDate).format("DD/MM/YYYY")}</td>
                                <td className="text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(repairs.id)}
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(repairs.id)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title="บันทึกงานบริการ"
                isOpen={isOpenModal}
                onClose={handleCloseModal}
            >
                <div>งานบริการ</div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div>ราคา</div>
                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <div>หมายเหตุ</div>
                <input
                    type="text"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />
                <div>
                    <button className="btn-save" onClick={handleSave}>
                        <i className="fas fa-save"></i>
                        บันทึก
                    </button>
                </div>
            </Modal>
        </div>
    );
}