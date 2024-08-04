/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { memo } from 'react';

type ActionButtonProps = {
  materialId: number;
  handleOpen: (id: number | null) => void;
  handleDelete: (id: number | null) => void;
  action?: string;
};

const ActionButtons = ({ materialId, handleOpen, handleDelete, action }: ActionButtonProps) => {
  return (
    <div className="d-flex gap-2 mt-2">
      <button type="button" className="primary-button-sm" onClick={() => handleOpen(materialId)}>
        {action ? `${action}` : 'Edit'}
      </button>
      <button type="button" className="primary-button-sm" onClick={() => handleDelete(materialId)}>
        Delete
      </button>
    </div>
  );
};

export default memo(ActionButtons);
