"use client";

import { useState, useEffect,} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "@/app/config";
import Modal from "@/app/backoffice/modal";

export default function Page() {
    const [isOpenModal, setisOpenModal] = useState(false);
    const [serial, setSerial] = useState("");
    const [name, setName] = useState("");
    const [release, setRelease] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState(0);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [remark, setRemark] = useState("");
    const [products, setProducts] = useState([]);
    const [id, setId] = useState(0);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/buy/list`);
            setProducts(res.data);
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถดึงข้อมูลรายการซื้อได้",
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
                serial: serial,
                name: name,
                release: release,
                color: color,
                price: price,
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                remark: remark,
                qty: qty,
            }
            if (id === 0) {
                await axios.post(`${config.apiUrl}/buy/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/buy/update/${id}`, payload);
                setId(0);
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

    const handleEdit = (id: number) => {
        const product = products.find((product: any) => product.id === id) as any;
        setSerial(product.serial ?? '');
        setName(product.name);
        setRelease(product.release);
        setColor(product.color);
        setPrice(product.price);
        setCustomerName(product.customerName);
        setCustomerPhone(product.customerPhone);
        setCustomerAddress(product.customerAddress ?? '');
        setRemark(product.remark);
        setId(product.id ?? '');

        handleOpenModal();
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
                await axios.delete(`${config.apiUrl}/buy/remove/${id}`);
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
                text: "ไม่สามารถลบข้อมูลรายการซื้อได้",
                timer: 1500,
            });
        }
    }

    const handleClear = () => {
        setSerial("");
        setName("");
        setRelease("");
        setColor("");
        setPrice(0);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setRemark("");
        setQty(1);
    }


    return (
        <div>
            <h1 className="container-header">รายการซื้อ</h1>
            <div>
                <button className="btn-plus" onClick={() => { handleOpenModal(); handleClear(); }}>
                    <i className="fa-solid fa-plus"></i> เพิ่มรายการซื้อ
                </button>

                {/* เพิ่ม container สำหรับ scroll */}
                <div className="overflow-y-auto max-h-[70vh] mt-4 rounded-md scrollbar-hide">
                    <table>
                        <thead>
                            <tr>
                                <th>Serial</th>
                                <th>ชื่อสินค้า</th>
                                <th>รุ่นสินค้า</th>
                                <th>สีสินค้า</th>
                                <th>ราคาสินค้า</th>
                                <th>ชื่อลูกค้า</th>
                                <th>เบอร์โทรลูกค้า</th>
                                <th>ที่อยู่ลูกค้า</th>
                                <th>หมายเหตุ</th>
                                <th className="w-[100px] text-center">แก้ไข / ลบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((products: any) => (
                                <tr key={products.id}>
                                    <td>{products.serial}</td>
                                    <td>{products.name}</td>
                                    <td>{products.release}</td>
                                    <td>{products.color}</td>
                                    <td>{products.price.toLocaleString()}</td>
                                    <td>{products.customerName}</td>
                                    <td>{products.customerPhone}</td>
                                    <td>{products.customerAddress}</td>
                                    <td>{products.remark}</td>
                                    <td className="text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button className="btn-edit" onClick={() => handleEdit(products.id)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button className="btn-delete" onClick={() => handleDelete(products.id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            <Modal title="เพิ่มรายการ" isOpen={isOpenModal} onClose={handleCloseModal}>
                <div>serial สินค้า</div>
                <input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} />
                <div>ชื่อสินค้า</div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <div>รุ่นสินค้า</div>
                <input type="text" value={release} onChange={(e) => setRelease(e.target.value)} />
                <div>สีสินค้า</div>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
                <div>ราคาสินค้า</div>
                <input type="text" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                <div>ชื่อลูกค้า</div>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <div>เบอร์โทรลูกค้า</div>
                <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                <div>ที่อยู่ลูกค้า</div>
                <input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                <div>หมายเหตุ</div>
                <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} />
                <div>จำนวนสินค้า</div>
                <input type="text" value={qty} onChange={(e) => setQty(Number(e.target.value ?? ''))} />
                <div>
                    <button className="btn-save" onClick={handleSave}>
                        <i className="fas fa-save" ></i>
                        บันทึก
                    </button>
                </div>
            </Modal>
        </div>
    );
}