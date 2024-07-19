import { Button } from "@mui/material";
import { memo } from "react";
type ActionButtonProps = {
  materialId: number;
  handleOpen: (id: number | null) => void;
  lg: () => void;
  action?: string;
};

const ActionButtons = ({
  materialId,
  handleOpen,
  action,
}: ActionButtonProps) => {
  console.log(materialId);
  return (
    <>
      <button
        className="primary-button-sm"
        onClick={() => handleOpen(materialId)}
      >
        {action ? `${action}` : "Edit"}
      </button>
    </>
  );
};

export default memo(ActionButtons);
