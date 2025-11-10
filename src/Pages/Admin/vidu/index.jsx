


import "react-calendar-timeline/style.css";
import React, { useState } from "react";
import Timeline from "react-calendar-timeline";
import moment from "moment";

const groups = [
  { id: 1, title: "Tầng 2 - P.201" },
  { id: 2, title: "Tầng 2 - P.202" },
  { id: 3, title: "Tầng 2 - P.203" },
  { id: 4, title: "Tầng 2 - P.204" },
  { id: 5, title: "Tầng 3 - P.301" },
  { id: 6, title: "Tầng 3 - P.302" },
  { id: 7, title: "Tầng 4 - P.401" },
];

const items = [
  {
    id: 1,
    group: 4,
    title: "Tài",
    start_time: moment("2025-03-15T14:00:00"),
    end_time: moment("2025-03-16T12:00:00"),
    itemProps: {
      style: {
        background: "#d97706",
        borderRadius: 6,
        color: "white",
        border: "none",
      },
    },
  },
  {
    id: 2,
    group: 4,
    title: "Lâm",
    start_time: moment("2025-03-17T14:00:00"),
    end_time: moment("2025-03-18T12:00:00"),
    itemProps: {
      style: {
        background: "#f59e0b",
        borderRadius: 6,
        color: "white",
        border: "none",
      },
    },
  },
  {
    id: 3,
    group: 6,
    title: "Nhỏ",
    start_time: moment("2025-03-14T10:00:00"),
    end_time: moment("2025-03-15T12:00:00"),
    itemProps: {
      style: {
        background: "#6b7280",
        borderRadius: 6,
        color: "white",
        border: "none",
      },
    },
  },
];

export default function HotelTimeline() {
  const [weekStart] = useState(moment("2025-03-14"));
  const weekEnd = moment(weekStart).add(6, "days");
  const today = moment();

  return (
    <div style={{ padding: 16 }}>
      {/* Thanh tiêu đề tuần */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span style={{ fontWeight: 600 }}>
          Tuần: {weekStart.format("DD/MM/YYYY")} – {weekEnd.format("DD/MM/YYYY")}
        </span>

        <button
          style={{
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Đặt phòng
        </button>
      </div>

      {/* Timeline */}
      <div style={{ height: "600px" }}>
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={weekStart}
          defaultTimeEnd={weekEnd}
          lineHeight={60}
          itemHeightRatio={0.8}

            // dragSnap={0}
            // onTimeChange={() => {}}
          scrollRef={(ref) => {
            if (ref) {
              ref.scrollLeft = 0;
              ref.style.overflowX = "hidden";
            }
          }}
          // 🟥 Highlight hôm nay
          verticalLineClassNamesForTime={(time) => {
            const isToday = moment(time).isSame(today, "day");
            return isToday ? ["highlight-today"] : [];
          }}
        />
      </div>

      {/* CSS thêm để tô màu hôm nay */}
      <style>
        {`
          .highlight-today {
            background-color: rgba(239, 68, 68, 0.15); /* đỏ nhạt */
            border-left: 2px solid #ef4444; /* đường viền đỏ */
            border-right: 2px solid #ef4444;
          }
        `}
      </style>
    </div>
  );
}


