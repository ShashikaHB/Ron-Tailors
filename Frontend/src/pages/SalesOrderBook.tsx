/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { useState } from 'react';

const SalesOrderBook = () => {
  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get("http://localhost:8000/api/v1/order/");
  //         setRowData(response.data.data);

  //         setLoading(false);
  //       } catch (err) {
  //         setLoading(false);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  return (
    <div>
      sales order book
      {/* {rowData && (
          <Table
            rowData={rowData}
            columns={columns}
            sortingColumn="paymentType"
          ></Table>
        )} */}
    </div>
  );
};

export default SalesOrderBook;
