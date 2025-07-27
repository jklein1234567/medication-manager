import { useEffect } from "react";
import type { ToastType } from "../../../types";
import type { FC } from "react";

interface Props {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toaster: FC<Props> = ({ message, type, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded shadow-md text-white z-50 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <span>{message}</span>
      <button className="ml-2 text-white font-bold" onClick={onClose}>
        ×
      </button>
    </div>
  );
};
