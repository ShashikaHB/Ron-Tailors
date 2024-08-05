/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ICellRendererParams } from 'ag-grid-community';

interface SimpleActionButtonProps extends ICellRendererParams {
  handleRemove: (id: number) => void;
  idField: string;
}

const SimpleActionButton = (props: SimpleActionButtonProps) => {
  const { handleRemove, data, idField } = props;
  return (
    <div>
      <button type="button" className="primary-button-sm" onClick={() => handleRemove(data[idField])}>
        X
      </button>
    </div>
  );
};

export default SimpleActionButton;
