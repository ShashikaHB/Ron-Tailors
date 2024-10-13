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
  rowIndex?: number;
}

const SimpleActionButton = (props: SimpleActionButtonProps) => {
  const { handleRemove, data, idField, rowIndex } = props;

  const onRemoveClick = () => {
    if (rowIndex && rowIndex > -1) {
      handleRemove(rowIndex);
    } else {
      handleRemove(data[idField]);
    }
  };

  return (
    <div>
      <button type="button" className="primary-button-sm" onClick={onRemoveClick}>
        X
      </button>
    </div>
  );
};

export default SimpleActionButton;
