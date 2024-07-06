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
      <button onClick={() => handleOpen(materialId)}>Edit</button>
    </>
  );
};

export default memo(ActionButtons);
