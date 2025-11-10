import React from "react";

export default function CheckoutPage() {
  const handlePayment = async () => {
    try {
      // Lấy token từ localStorage (hoặc từ context/state)
      const token = localStorage.getItem("authToken");
      console.log(token)

      const res = await fetch("http://localhost:8082/identity/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 gửi kèm token
        },
        body: JSON.stringify({ amount: 500000 }),
      });

      if (!res.ok) {
        throw new Error("Lỗi khi gọi API");
      }

      const data = await res.json();

      window.location.href = data.paymentUrl; // Redirect sang VNPay
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo thanh toán!");
    }
  };

  return (
    <div>
      <h2>Thanh toán đơn hàng</h2>
      <button onClick={handlePayment}>Thanh toán với VNPay</button>
    </div>
  );
}
