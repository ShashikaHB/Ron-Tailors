/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const MeasurementPrintPage = () => {
  const location = useLocation();
  const data = location.state;
  const [clickedButtons, setClickedButtons] = useState({});

  const handleButtonClick = (index, measurement) => {
    setClickedButtons((prevState) => ({
      ...prevState,
      [index]: true,
    }));
    // Additional functionality for button click can go here

    const { itemType, customer, orderId, measurements, style, remarks, estimatedReleaseDate, isNecessary } = measurement;

    const urlParams = new URLSearchParams({
      orderId,
      itemType,
      customerName: customer.name,
      customerMobile: customer.mobile,
      measurements, // Use filtered measurements
      style,
      remarks,
      estimatedReleaseDate: new Date(estimatedReleaseDate).toISOString(),
      isNecessary: isNecessary ? 'true' : 'false',
    });

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const invoiceUrl = `${baseUrl}/api/v1/invoice/measurements?${urlParams.toString()}`;
    window.open(invoiceUrl, '_blank');
  };

  const styles = {
    measurementContainer: {
      borderBottom: '1px solid #ccc',
      padding: '10px 0',
      marginBottom: '10px',
    },
    measurementHeader: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    measurementDetails: {
      fontSize: '14px',
      marginBottom: '10px',
    },
    printButton: (isClicked) => ({
      marginTop: '10px',
      padding: '5px 10px',
      fontSize: '14px',
      backgroundColor: isClicked ? 'purple' : '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    }),
  };

  return (
    <div>
      {data.map((measurement, index) => {
        const { customer, itemType, measurements, style, remarks, estimatedReleaseDate, isNecessary, orderId } = measurement;
        const filteredMeasurements = measurements.filter((value) => value !== '').join('    ');

        return (
          <div key={index} id={`measurement-${index}`} style={styles.measurementContainer}>
            <div style={styles.measurementHeader}>
              {orderId} | {customer.name} | {customer.mobile} | {itemType}
            </div>
            <div style={styles.measurementDetails}>
              <p>Measurements: {filteredMeasurements}</p>
              <p>Style: {style}</p>
              <p>Remarks: {remarks}</p>
              <p>
                Release Date: {new Date(estimatedReleaseDate).toLocaleDateString()} {isNecessary && <strong>(Necessary)</strong>}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleButtonClick(index, { ...measurement, measurements: filteredMeasurements })}
              style={styles.printButton(clickedButtons[index])}
            >
              Print Measurement
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MeasurementPrintPage;
