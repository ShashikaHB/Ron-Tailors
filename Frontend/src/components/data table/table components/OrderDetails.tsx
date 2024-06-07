import React from "react";

const OrderDetails = ({ getValue, row, column, table }) => {
  const orderDetails = getValue() || [];

  return (
    <div>
      {orderDetails.map((order, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <p>Color: {order.color}</p>
          <p>Style: {order.style}</p>
          <p>Type: {order.type}</p>
          <p>Status: {order.status}</p>
          <p>Price: {order.price}</p>
          {/* Additional fields can be shown as needed */}
          <br />
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
