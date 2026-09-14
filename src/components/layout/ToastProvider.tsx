"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: "#f5f5f3",
          color: "#0b0b0c",
          fontSize: "13px",
          borderRadius: "2px",
        },
      }}
    />
  );
}
