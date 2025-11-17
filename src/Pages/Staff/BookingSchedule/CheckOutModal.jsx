// src/pages/reception/CheckOutModal.jsx
import React, { useMemo, useState } from "react";
import {
    Modal,
    Row,
    Col,
    Typography,
    Divider,
    InputNumber,
    Button,
    Space,
    Input,
    message,
} from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;

const formatMoney = (v) =>
    (v || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export default function CheckOutModal({
    open,
    onCancel,
    booking,
    onSubmit, // (payload) => Promise<void>
    loading = false,
}) {
    const [payAmount, setPayAmount] = useState(0);
    const [note, setNote] = useState("");

    const computed = useMemo(() => {
        if (!booking) {
            return {
                code: "",
                customerName: "",
                roomName: "",
                start: null,
                end: null,
                nights: 0,
                amount: 0,
                paid: 0,
                remain: 0,
            };
        }

        const start = dayjs(booking.startDay || booking.start_day);
        const end = dayjs(booking.endDay || booking.end_day);
        const nights = Math.max(
            1,
            end.startOf("day").diff(start.startOf("day"), "day")
        );

        const amount = booking.amount || 0;
        const paid = booking.paid || 0;
        const remain = Math.max(0, amount - paid);

        const customerName =
            booking.customerName || booking.customer?.name || "Khách lẻ";

        const roomName =
            booking.roomName ||
            booking.rooms?.[0]?.room?.name ||
            booking.rooms?.[0]?.roomName ||
            "";

        const code = booking.code || booking.orderCode || booking._id;

        return { code, customerName, roomName, start, end, nights, amount, paid, remain };
    }, [booking]);

    const handleOk = async () => {
        if (!booking || !onSubmit) return;

        const remain = computed.remain;
        const pay = payAmount || 0;

        // ❌ Nếu còn phải trả mà không nhập số tiền
        if (remain > 0 && pay <= 0) {
            return message.error("Vui lòng nhập số tiền khách cần thanh toán!");
        }

        // ❌ Không được nhập âm
        if (pay < 0) {
            return message.error("Số tiền không hợp lệ");
        }

        // ❌ Không được nhập vượt số tiền phải trả
        if (pay > remain) {
            return message.error(`Số tiền nhập (${formatMoney(pay)} đ) vượt số tiền cần trả (${formatMoney(remain)} đ).`);
        }

        // hợp lệ
        await onSubmit({
            payAmount: pay,
            note,
        });
    };


    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            title={null}
            destroyOnClose
        >
            {booking ? (
                <>
                    {/* Tiêu đề */}
                    <div style={{ marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Trả phòng - {computed.code}
                        </Title>
                    </div>

                    {/* Khung nội dung */}
                    <div
                        style={{
                            borderRadius: 12,
                            border: "1px solid #f0f0f0",
                            padding: 16,
                            background: "#fff",
                        }}
                    >
                        {/* Thông tin cơ bản */}
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Text type="secondary">Khách hàng</Text>
                                <div style={{ fontWeight: 500 }}>{computed.customerName}</div>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Phòng</Text>
                                <div style={{ fontWeight: 500 }}>{computed.roomName}</div>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={8}>
                                <Text type="secondary">Nhận phòng</Text>
                                <div style={{ fontWeight: 500 }}>
                                    {computed.start &&
                                        computed.start.format("DD Thg MM, HH:mm")}
                                </div>
                            </Col>
                            <Col span={8}>
                                <Text type="secondary">Trả phòng</Text>
                                <div style={{ fontWeight: 500 }}>
                                    {computed.end &&
                                        computed.end.format("DD Thg MM, HH:mm")}
                                </div>
                            </Col>
                            <Col span={8}>
                                <Text type="secondary">Thời gian lưu trú</Text>
                                <div style={{ fontWeight: 500 }}>
                                    {computed.nights} {computed.nights > 1 ? "ngày" : "ngày"}
                                </div>
                            </Col>
                        </Row>

                        <Divider style={{ margin: "12px 0" }} />

                        {/* Tiền thanh toán + ghi chú */}
                        <Row gutter={16}>
                            <Col span={14}>
                                <Text type="secondary">Ghi chú</Text>
                                <TextArea
                                    placeholder="Ghi chú khi trả phòng"
                                    autoSize={{ minRows: 3, maxRows: 4 }}
                                    style={{ marginTop: 8 }}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </Col>

                            <Col span={10}>
                                <div
                                    style={{
                                        borderRadius: 12,
                                        background: "#fafafa",
                                        padding: 12,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 4,
                                        }}
                                    >
                                        <Text type="secondary">Tổng tiền</Text>
                                        <Text strong>{formatMoney(computed.amount)} đ</Text>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 4,
                                        }}
                                    >
                                        <Text type="secondary">Khách đã trả</Text>
                                        <Text>{formatMoney(computed.paid)} đ</Text>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text type="secondary">Còn phải trả</Text>
                                        <Text strong>{formatMoney(computed.remain)} đ</Text>
                                    </div>

                                    <Divider style={{ margin: "8px 0" }} />

                                    <div style={{ marginBottom: 4 }}>
                                        <Text type="secondary">Khách thanh toán thêm</Text>
                                    </div>
                                    <InputNumber
                                        style={{
                                            width: "100%",
                                            borderColor: payAmount > computed.remain ? "red" : undefined
                                        }}
                                        min={0}
                                        max={computed.remain}
                                        value={payAmount}
                                        formatter={(v) =>
                                            `${(v || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                                        }
                                        parser={(v) => Number((v || "0").replace(/\./g, ""))}
                                        onChange={(v) => setPayAmount(v || 0)}
                                    />

                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Footer nút */}
                    <div
                        style={{
                            marginTop: 16,
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Space>
                            <Button onClick={onCancel}>Huỷ</Button>
                            <Button
                                type="primary"
                                danger
                                loading={loading}
                                onClick={handleOk}
                            >
                                Xác nhận trả phòng
                            </Button>
                        </Space>
                    </div>
                </>
            ) : (
                <div>Không có dữ liệu booking.</div>
            )}
        </Modal>
    );
}
