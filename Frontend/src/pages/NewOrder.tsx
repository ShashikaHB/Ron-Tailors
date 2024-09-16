/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import SelectCard from '../components/SelectCard';
import { CardConfig } from './LandingPage';
import sales from '../assets/card-images/sales-order.svg';
import rentOut from '../assets/card-images/rent-out.svg';

const NewOrder = () => {
  const cardConfig: CardConfig[] = [
    {
      title: 'Sales Order',
      subtitle: 'Sales orders can be initiated from here',
      image: sales,
      link: '/secured/addSalesOrder',
    },
    {
      title: 'Rent Out',
      subtitle: 'Rent out orders can be initiated from here',
      image: rentOut,
      link: '/secured/addRentOrder',
    },
    {
      title: 'Rent Return',
      subtitle: 'Rent Returns are handled from here',
      image: rentOut,
      link: '/secured/rentReturn',
    },
    {
      title: 'Payment',
      subtitle: 'Make Payments easy',
      image: rentOut,
      link: '/secured/salesOrRentOrderPayment',
    },
  ];
  return (
    <div className="row overflow-y-auto p-3 justify-content-center align-items-center">
      {cardConfig.map((card, index) => {
        return (
          <div key={index} className="col-6 mb-4">
            <SelectCard {...card} />
          </div>
        );
      })}
    </div>
  );
};

export default NewOrder;
