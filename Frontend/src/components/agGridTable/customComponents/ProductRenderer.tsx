import React, { memo } from "react";
import { Button } from "@mui/material";

const ProductRenderer = (props) => {
  const { data, handleOpenMeasurement } = props;

  const { description, products } = data;

  return (
    <div>
      <div>
        <strong>{description}</strong>
      </div>
      <div>
        {products.map((product, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <span style={{ marginRight: "10px" }}>{product.type}</span>
              <Button
                variant="outlined"
                size="small"
                style={{ marginRight: "10px" }}
                onClick={() => handleOpenMeasurement(product.productId)}
              >
                M
              </Button>
              <span>${product.price}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ProductRenderer);
