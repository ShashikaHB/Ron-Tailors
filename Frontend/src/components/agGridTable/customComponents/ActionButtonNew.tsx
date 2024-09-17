/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ICellRendererParams } from 'ag-grid-community';

interface ActionButtonPropTypes extends ICellRendererParams {
  handleEdit?: (id: number) => void;
  handleDelete?: (id: number) => void;
  idType: string;
  isOrderBook?: boolean;
  isAccount?: boolean;
}

const ActionButtonNew = (props: ActionButtonPropTypes) => {
  const { handleEdit, handleDelete, idType, data, isOrderBook, isAccount } = props;

  const hideDeleteForCategories = ['Sales Order', 'Rent Order', 'Ready Made Order', 'Salary'];

  const id = data?.[idType];
  const handlePrint = () => {
    const newWindow = window.open('', '_blank');
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const invoiceUrl = `${baseUrl}/api/v1/invoice/${idType === 'rentOrderId' ? 'rentOrder' : 'salesOrder'}/${id}`;
    if (newWindow) {
      newWindow.location.href = invoiceUrl;
    }
  };

  const showDeleteButton = !isAccount && !hideDeleteForCategories.includes(data?.transactionCategory);

  return (
    <div className="d-flex gap-2 mt-2">
      {handleEdit && (
        <button type="button" className="primary-button-sm" onClick={() => handleEdit(id)}>
          Edit
        </button>
      )}
      {showDeleteButton && !isOrderBook && (
        <button type="button" className="primary-button-sm" onClick={() => handleDelete(id)}>
          Delete
        </button>
      )}
      {isOrderBook && (
        <button type="button" className="primary-button-sm" onClick={() => handlePrint()}>
          Print
        </button>
      )}
    </div>
  );
};

export default ActionButtonNew;
