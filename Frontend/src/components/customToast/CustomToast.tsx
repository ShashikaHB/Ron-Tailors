import React, { useEffect, useState } from "react";

type CustomToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

const CustomToast = ({
  message,
  duration = 5000,
  onClose,
}: CustomToastProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 100;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(timer);
          //   onClose();
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: "relative",
        padding: "10px",
        backgroundColor: "#333",
        color: "#fff",
        borderRadius: "5px",
      }}
    >
      <div>{message}</div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "5px",
          width: `${progress}%`,
          backgroundColor: "#4caf50",
        }}
      ></div>
    </div>
  );
};

export default CustomToast;
