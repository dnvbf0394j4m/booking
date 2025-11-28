// src/pages/.../BookingSchedule.jsx
import React, { useMemo, useState, useEffect } from "react";
import Timeline, { TimelineHeaders, DateHeader, TodayMarker } from "react-calendar-timeline";
import moment from "moment";
import { Button, Input, Tag, Typography, Spin, message } from "antd";
import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import "react-calendar-timeline/style.css";
import "./BookingSchedule.css";
import RoomBookingModal from "./RoomBookingModal";
import "moment/locale/vi";
import QuickBookingModal from "./QuickBookingModal";
import BookingDetailModal from "./BookingDetailModal";
import EditBookingModal from "./EditBookingModal";
import CheckInModal from "./CheckInModal";
import CheckOutModal from "./CheckOutModal";




moment.locale("vi");

// ✅ dùng api mới
import { fetchRooms, fetchBookingsRange, shapeBookingsToTimelineItems } from "../../../api/bookingApi";

const { Text } = Typography;

export default function ReceptionTimeline({ hotelId: hotelIdProp }) {
    // 🕓 cửa sổ 7 ngày
    const [currentStart, setCurrentStart] = useState(moment().startOf("day"));
    const timeStart = useMemo(() => currentStart.clone().startOf("day"), [currentStart]);
    const timeEnd = useMemo(() => currentStart.clone().add(6, "days").endOf("day"), [currentStart]);

    // Auth + hotel
    const token = localStorage.getItem("authToken");

    const hotelId = hotelIdProp || localStorage.getItem("hotelId"); // hoặc lấy từ profile khi login

    // Dữ liệu
    const [rooms, setRooms] = useState([]);        // [{_id,name,number,...}]
    const [items, setItems] = useState([]);        // items timeline (mỗi phòng 1 item)
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);



    const [checkInOpen, setCheckInOpen] = useState(false);
    const [checkInBooking, setCheckInBooking] = useState(null);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const handleOpenCheckInModal = (booking) => {
        setCheckInBooking(booking);
        setCheckInOpen(true);
        // nếu muốn, bạn có thể đóng modal chi tiết:
        // setIsDetailOpen(false);
    };
    const handleSubmitCheckIn = async ({ payAmount, note }) => {
        if (!checkInBooking) return;

        try {
            setCheckInLoading(true);
            const id =
                checkInBooking._id ||
                checkInBooking.id ||
                checkInBooking.bookingId;

            if (!id) {
                message.error("Không tìm được ID booking để nhận phòng");
                return;
            }

            // 1) Nếu có thanh toán thêm -> gọi API addPayment
            if (payAmount && payAmount > 0) {
                const resPay = await fetch(
                    `http://localhost:4000/api/reception/bookings/${id}/payments`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token ? `Bearer ${token}` : "",
                        },
                        body: JSON.stringify({
                            method: "OFFLINE_CASH",
                            amount: payAmount,
                            note: note || "Thanh toán khi nhận phòng",
                        }),
                    }
                );
                const dataPay = await resPay.json();
                if (!resPay.ok) {
                    throw new Error(dataPay.error || "Thanh toán thất bại");
                }
            }

            // 2) Gọi API check-in
            const resCheck = await fetch(
                `http://localhost:4000/api/reception/bookings/${id}/checkin`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            );
            const dataCheck = await resCheck.json();
            if (!resCheck.ok) {
                throw new Error(dataCheck.error || "Nhận phòng thất bại");
            }

            message.success("Đã nhận phòng thành công");

            // đóng modal
            setCheckInOpen(false);
            setCheckInBooking(null);
            setIsDetailOpen(false);
            setSelectedBooking(null);

            // reload timeline
            const bookingList = await fetchBookingsRange({
                from: timeStart.toDate(),
                to: timeEnd.toDate(),
                hotelId,
                token,
            });
            const shaped = shapeBookingsToTimelineItems(bookingList || []);
            setItems(shaped);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Lỗi khi nhận phòng");
        } finally {
            setCheckInLoading(false);
        }
    };


    const [checkOutOpen, setCheckOutOpen] = useState(false);
    const [checkOutBooking, setCheckOutBooking] = useState(null);
    const [checkOutLoading, setCheckOutLoading] = useState(false);
    const handleSubmitCheckOut = async ({ payAmount, note }) => {
        if (!checkOutBooking) return;

        try {
            setCheckOutLoading(true);

            const id =
                checkOutBooking._id ||
                checkOutBooking.id ||
                checkOutBooking.bookingId;

            if (!id) {
                message.error("Không tìm được ID booking để trả phòng");
                return;
            }

            // 1) Nếu còn phải trả & có nhập tiền => addPayment
            if (payAmount && payAmount > 0) {
                const resPay = await fetch(
                    `http://localhost:4000/api/reception/bookings/${id}/payments`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token ? `Bearer ${token}` : "",
                        },
                        body: JSON.stringify({
                            method: "OFFLINE_CASH", // hoặc OFFLINE_CARD
                            amount: payAmount,
                            note: note || "Thanh toán khi trả phòng",
                        }),
                    }
                );
                const dataPay = await resPay.json();
                if (!resPay.ok) {
                    throw new Error(dataPay.error || "Thanh toán thất bại");
                }
            }

            // 2) Gọi API check-out
            const resCheckout = await fetch(
                `http://localhost:4000/api/reception/bookings/${id}/checkout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            );
            const dataCheckout = await resCheckout.json();
            if (!resCheckout.ok) {
                throw new Error(dataCheckout.error || "Trả phòng thất bại");
            }

            message.success("Đã trả phòng thành công");

            setCheckOutOpen(false);
            setCheckOutBooking(null);
            setIsDetailOpen(false);
            setSelectedBooking(null);

            // reload timeline
            const bookingList = await fetchBookingsRange({
                from: timeStart.toDate(),
                to: timeEnd.toDate(),
                hotelId,
                token,
            });
            const shaped = shapeBookingsToTimelineItems(bookingList || []);
            setItems(shaped);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Lỗi khi trả phòng");
        } finally {
            setCheckOutLoading(false);
        }
    };



    const handleCleanBooking = async (booking) => {
        try {
            const id = booking._id || booking.id || booking.bookingId;
            if (!id) {
                message.error("Không tìm được ID booking để dọn phòng");
                return;
            }

            // Gọi API xóa mềm (soft-delete)
            const res = await fetch(
                `http://localhost:4000/api/reception/bookings/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Xóa booking thất bại");
            }

            message.success("Đã dọn phòng và ẩn booking khỏi timeline");

            // đóng modal chi tiết
            setIsDetailOpen(false);
            setSelectedBooking(null);

            // reload timeline
            const bookingList = await fetchBookingsRange({
                from: timeStart.toDate(),
                to: timeEnd.toDate(),
                hotelId,
                token,
            });
            const shaped = shapeBookingsToTimelineItems(bookingList || []);
            setItems(shaped);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Lỗi khi dọn phòng");
        }
    };





    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // thêm nữa cho sửa booking:
    const [editOpen, setEditOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [updating, setUpdating] = useState(false);


    const handleCheckInBooking = async (booking) => {
        try {
            const id = booking._id || booking.id || booking.bookingId;
            if (!id) {
                message.error("Không tìm được ID booking để nhận phòng");
                return;
            }

            const res = await fetch(
                `http://localhost:4000/api/reception/bookings/${id}/checkin`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Nhận phòng thất bại");

            message.success("Đã nhận phòng");
            setIsDetailOpen(false);
            setSelectedBooking(null);

            // reload bookings
            const bookingList = await fetchBookingsRange({
                from: timeStart.toDate(),
                to: timeEnd.toDate(),
                hotelId,
                token,
            });
            const shaped = shapeBookingsToTimelineItems(bookingList || []);
            setItems(shaped);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Lỗi khi nhận phòng");
        }
    };
    const handleCheckOutBooking = (booking) => {
        console.log("Open checkout modal with booking:", booking);
        setCheckOutBooking(booking);   // lưu booking đang xử lý
        setCheckOutOpen(true);         // mở modal trả phòng

        // nếu muốn đóng luôn modal chi tiết:
        // setIsDetailOpen(false);
    };





    const handleEditBooking = (booking) => {
        setEditingBooking(booking);
        setEditOpen(true);
        // có thể đóng modal chi tiết nếu muốn:
        setIsDetailOpen(false);
    };

    const handleSubmitEditBooking = async (body) => {
        try {
            if (!editingBooking) return;
            setUpdating(true);

            const id = editingBooking._id || editingBooking.id || editingBooking.bookingId;
            if (!id) {
                message.error("Không tìm được ID booking để cập nhật");
                return;
            }

            const res = await fetch(
                `http://localhost:4000/api/reception/bookings/${id}/dates`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Cập nhật đặt phòng thất bại");

            message.success("Đã cập nhật ngày ở");

            setEditOpen(false);
            setEditingBooking(null);

            // reload bookings
            const bookingList = await fetchBookingsRange({
                from: timeStart.toDate(),
                to: timeEnd.toDate(),
                hotelId,
                token,
            });
            const shaped = shapeBookingsToTimelineItems(bookingList || []);
            setItems(shaped);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Lỗi khi cập nhật đặt phòng");
        } finally {
            setUpdating(false);
        }
    };


    const handleSelectItem = async (itemId) => {
        try {
            console.log("Selected itemId:", itemId);

            // tìm item trong timelineItems (KHÔNG dùng items nữa)
            const found = timelineItems.find((x) => x.id === itemId);
            console.log("Found timeline item:", found);

            if (!found) {
                console.warn("Không tìm thấy item trong timelineItems");
                return;
            }

            // bookingId thật trong DB
            const bookingId = found._raw?.bookingId || found.bookingId;
            if (!bookingId) {
                console.warn("Item không có bookingId:", found);
                // fallback: nếu _raw đã có đầy đủ field thì dùng luôn
                if (found._raw) {
                    setSelectedBooking(found._raw);
                    setIsDetailOpen(true);
                }
                return;
            }

            // 🔥 Gọi API chi tiết booking bằng bookingId
            const res = await fetch(
                `http://localhost:4000/api/reception/bookings/${bookingId}`,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Không tải được chi tiết booking");
            }

            console.log("Full booking detail:", data);
            setSelectedBooking(data);   // ➜ BookingDetailModal nhận data đầy đủ
            setIsDetailOpen(true);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Lỗi khi tải chi tiết booking");
        }
    };





    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // modal 2
    const [quickOpen, setQuickOpen] = useState(false);
    const [draftBooking, setDraftBooking] = useState(null);
    const [creating, setCreating] = useState(false);
    const handleBook = () => setIsModalOpen(true);

    // Search (client-side)
    const [keyword, setKeyword] = useState("");

    // 🟢 tuần trước/sau
    const goToPreviousWeek = () => setCurrentStart((p) => p.clone().subtract(7, "days"));
    const goToNextWeek = () => setCurrentStart((p) => p.clone().add(7, "days"));

    const handleRoomSelected = (payload) => {
        console.log("Room selection from modal:", payload);
        setDraftBooking(payload);      // lưu draft để đưa sang modal 2
        setIsModalOpen(false);         // đóng modal chọn phòng
        setQuickOpen(true);            // mở modal đặt nhanh
    };


    const handleSubmitQuickBooking = async (body) => {
        try {
            setCreating(true);

            const res = await fetch("http://localhost:4000/api/reception/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Tạo booking thất bại");
            }

            message.success("Đã tạo booking");
            setQuickOpen(false);
            setDraftBooking(null);

            // reload bookings để timeline cập nhật
            const bookingList = await fetchBookingsRange({
                from: timeStart.toDate(),
                to: timeEnd.toDate(),
                hotelId,
                token,
            });
            const shaped = shapeBookingsToTimelineItems(bookingList || []);
            setItems(shaped);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Lỗi khi tạo booking");
        } finally {
            setCreating(false);
        }
    };


    // 🔄 load rooms + bookings
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                if (!hotelId) {
                    setErr(new Error("Thiếu hotelId"));
                    return;
                }
                setLoading(true);
                setErr(null);

                const [roomList, bookingList] = await Promise.all([
                    fetchRooms(hotelId, token),
                    fetchBookingsRange({ from: timeStart.toDate(), to: timeEnd.toDate(), hotelId, token }),
                ]);

                if (cancelled) return;

                setRooms(roomList || []);
                const shaped = shapeBookingsToTimelineItems(bookingList || []);
                setItems(shaped);
            } catch (e) {
                if (!cancelled) {
                    setErr(e);
                    message.error(e.message || "Lỗi tải dữ liệu");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [hotelId, timeStart, timeEnd, token]);

    // 🟣 màu trạng thái
    const getStatusColor = (status) => {
        const s = String(status || "").toUpperCase();
        switch (s) {
            case "RESERVED":
            case "BOOKED":
                return "#FFE7BA";
            case "CHECKED_IN":
                return "#A7D7C5";
            case "PENDING":
                return "#FFF1B8";
            case "PAID":
                return "#D6F5D6";
            case "PARTIAL":
                return "#E6F7FF";
            case "CANCELLED":
                return "#FFD6E7";
            default:
                return "#FAFAFA";
        }
    };

    // 🧭 tách tầng (đơn giản)
    const getFloorLabel = (roomNameOrNumber) => {
        const s = String(roomNameOrNumber || "");
        const m = /(\d)(\d{2})$/.exec(s); // vd 201 -> Tầng 2
        return m ? `Tầng ${m[1]}` : "Khác";
    };

    // groups: header tầng + từng phòng
    const groups = useMemo(() => {
        if (!rooms.length) return [];

        const byFloor = new Map();
        rooms.forEach((r) => {
            const label = getFloorLabel(r.name || r.number);
            if (!byFloor.has(label)) byFloor.set(label, []);
            byFloor.get(label).push(r);
        });

        const result = [];
        [...byFloor.keys()]
            .sort((a, b) => {
                const na = parseInt((a.match(/\d+/) || [999])[0], 10);
                const nb = parseInt((b.match(/\d+/) || [999])[0], 10);
                return na - nb;
            })
            .forEach((floorLabel) => {
                result.push({ id: `t-${floorLabel}`, title: floorLabel, isFloor: true });
                const list = byFloor.get(floorLabel) || [];
                list
                    .sort((x, y) => (x.name || x.number || "").localeCompare(y.name || y.number || "", "vi"))
                    .forEach((r) =>
                        result.push({
                            id: r._id, // ✅ dùng _id của room
                            title: r.name || r.number || `Room ${r._id.slice(-4)}`,
                            floor: floorLabel,
                            _raw: r,
                        })
                    );
            });

        return result;
    }, [rooms]);

    // filter theo keyword trên items
    const filteredItems = useMemo(() => {
        if (!keyword) return items;
        const kw = keyword.toLowerCase();
        return items.filter((it) => {
            const code = String(it.code || "").toLowerCase();
            const name = String(it.customerName || "").toLowerCase();
            const roomName = String(it.roomName || "").toLowerCase();
            return code.includes(kw) || name.includes(kw) || roomName.includes(kw);
        });
    }, [items, keyword]);

    // items -> timeline format

    const fmt = (date) => moment(date).format("HH:mm DD/MM");

    const timelineItems = useMemo(() => {
        return filteredItems.map((b) => {
            const timeStr = `${fmt(b.startDay)} → ${fmt(b.endDay)}`;
            const nameStr = b.customerName || "(Không tên)";

            return {
                id: b.id,
                group: b.group,
                title: (
                    <div style={{ lineHeight: "1.2" }}>
                        <div style={{ fontWeight: 600 }}>{nameStr}</div>
                        <div style={{ fontSize: 10 }}>{timeStr}</div>
                    </div>
                ),
                start_time: moment(b.startDay),
                end_time: moment(b.endDay),
                itemProps: {
                    style: {
                        background: getStatusColor(b.status),
                        borderRadius: 6,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#d9d9d9",   // bạn có thể gán theo status
                        color: "#333",
                        fontSize: 12,
                        padding: "6px 8px",
                    },
                },

                _raw: b,
            };
        });
    }, [filteredItems]);


    // thống kê nhanh
    const quickStats = useMemo(() => {
        const now = moment();
        let empty = 0, soonCheckin = 0, inUse = 0, soonCheckout = 0, overdue = 0;

        // phòng đang bận
        const busy = new Set(
            timelineItems
                .filter((it) => now.isBetween(it.start_time, it.end_time))
                .map((it) => it.group)
        );

        rooms.forEach((r) => { if (!busy.has(r._id)) empty += 1; });

        timelineItems.forEach((it) => {
            const s = it.start_time, e = it.end_time;
            if (s.diff(now, "hours") <= 24 && s.isAfter(now)) soonCheckin += 1;
            if (now.isBetween(s, e)) inUse += 1;
            if (e.diff(now, "hours") <= 24 && e.isAfter(now)) soonCheckout += 1;
            if (e.isBefore(now)) overdue += 1;
        });

        return { empty, soonCheckin, inUse, soonCheckout, overdue };
    }, [rooms, timelineItems]);

    return (
        <div style={{ padding: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Input
                        placeholder="Tìm khách, mã đặt phòng, tên phòng…"
                        prefix={<SearchOutlined />}
                        style={{ width: 320 }}
                        allowClear
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Tag color="green">Đang trống ({quickStats.empty})</Tag>
                    <Tag color="orange">Sắp nhận ({quickStats.soonCheckin})</Tag>
                    <Tag color="blue">Đang sử dụng ({quickStats.inUse})</Tag>
                    <Tag color="purple">Sắp trả ({quickStats.soonCheckout})</Tag>
                    <Tag color="magenta">Quá giờ trả ({quickStats.overdue})</Tag>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                        <Button icon={<LeftOutlined />} onClick={goToPreviousWeek} size="small" />
                        <Text style={{ margin: "0 12px", fontWeight: 500 }}>
                            {timeStart.format("DD/MM")} - {timeEnd.format("DD/MM/YYYY")}
                        </Text>
                        <Button icon={<RightOutlined />} onClick={goToNextWeek} size="small" />
                    </div>

                    <Button type="primary" icon={<PlusOutlined />} onClick={handleBook}>
                        Đặt phòng
                    </Button>
                </div>
            </div>

            <Spin spinning={loading}>
                <Timeline
                    groups={groups}
                    items={timelineItems}
                    visibleTimeStart={timeStart.valueOf()}
                    visibleTimeEnd={timeEnd.valueOf()}
                    lineHeight={65}
                    itemHeightRatio={0.7}
                    canMove={false}
                    canResize={false}
                    stackItems
                    sidebarWidth={150}
                    itemTouchSendsClick
                    onItemSelect={(itemId) => handleSelectItem(itemId)}
                    traditionalZoom={false}
                    verticalLineClassNamesForTime={() => ["custom-grid-line"]}
                    groupRenderer={({ group }) => (
                        <div
                            style={{
                                fontWeight: group.isFloor ? "600" : "400",
                                background: group.isFloor ? "#f5f5f5" : "transparent",
                                paddingLeft: group.isFloor ? 8 : 20,
                            }}
                        >
                            {group.title}
                        </div>
                    )}
                >
                    <TodayMarker>
                        {({ styles }) => <div style={{ ...styles, backgroundColor: "green", width: 2 }} />}
                    </TodayMarker>

                    <TimelineHeaders className="sticky-header">
                        <DateHeader unit="day" labelFormat="ddd DD/MM" />
                    </TimelineHeaders>
                </Timeline>
            </Spin>

            {/* <RoomBookingModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} /> */}
            <RoomBookingModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                hotelId={hotelId}
                onConfirm={handleRoomSelected}
            />

            <QuickBookingModal
                open={quickOpen}
                onCancel={() => setQuickOpen(false)}
                draft={draftBooking}
                onSubmit={handleSubmitQuickBooking}
                loading={creating}
            />
            <BookingDetailModal
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                booking={selectedBooking}
                onEdit={handleEditBooking}              // nếu đã có
                onCheckIn={handleOpenCheckInModal}      // ⬅ sử dụng handler mới
                onCheckOut={handleCheckOutBooking}
                onClean={handleCleanBooking}
            />


            <EditBookingModal
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                booking={editingBooking}
                onSubmit={handleSubmitEditBooking}
                loading={updating}
            />

            <CheckInModal
                open={checkInOpen}
                onCancel={() => setCheckInOpen(false)}
                booking={checkInBooking}
                onSubmit={handleSubmitCheckIn}
                loading={checkInLoading}
                onEdit={handleEditBooking}   // tái dùng handler sửa đặt phòng
            />
            <CheckOutModal
                open={checkOutOpen}
                onCancel={() => setCheckOutOpen(false)}
                booking={checkOutBooking}
                onSubmit={handleSubmitCheckOut}
                loading={checkOutLoading}
            />




            {err && <div style={{ marginTop: 8, color: "#ff4d4f" }}>Lỗi: {String(err?.message || err)}</div>}
        </div>
    );
}
