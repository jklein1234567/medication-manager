import { ToastType } from "../../../types";

export const Toaster = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) => {
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
