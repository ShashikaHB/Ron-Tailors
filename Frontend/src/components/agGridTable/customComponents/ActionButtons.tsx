import { Button } from "@mui/material";
import { memo } from "react";
type ActionButtonProps = {
  materialId: number;
  handleOpen: (id: number | null) => void;
  lg: () => void;
};

const ActionButtons = ({ materialId, handleOpen }: ActionButtonProps) => {
  console.log(materialId);
  return (
    <>
      <button
        className="primary-button-sm"
        onClick={() => handleOpen(materialId)}
      >
        Edit
      </button>
    </>
  );
};

export default memo(ActionButtons);
