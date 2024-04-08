import React from "react";

interface LoadingModalProps {
  text: string;
  textColor?: string;
  loadingVisibility: string;
  closeVisibility: string;
  onClose: () => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  text,
  textColor = "text-black",
  loadingVisibility,
  onClose,
  closeVisibility,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
      <div className="bg-white p-6 w-1/3 rounded-lg shadow-xl flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute top-0 left-0 p-4 text-black font-bold text-2xl hover:cursor-pointer"
          style={{ display: closeVisibility }}
        >
          X
        </button>
        <div
          className="loader animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"
          style={{ display: loadingVisibility }}
        ></div>
        <p className={`text-lg mt-4 w-3/5 text-center font-bold ${textColor}`}>
          {text}
        </p>
      </div>
    </div>
  );
};

export default LoadingModal;
