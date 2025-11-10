import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div>
      {status === "PAID" ? (
        <h2>Thanh toán thành công 🎉</h2>
      ) : (
        <h2>Thanh toán thất bại ❌</h2>
      )}
    </div>
  );
}
