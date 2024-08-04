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
      title: 'Rent Out',
      subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      image: rentOut,
      link: '/secured/addRentOutOrder',
    },
    {
      title: 'Rent Return',
      subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      image: rentOut,
      link: '/secured/rentReturn',
    },
    {
      title: 'Sales Order',
      subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      image: sales,
      link: '/secured/addSalesOrder',
    },
  ];
  return (
    <div className="row overflow-y-auto p-3 gap-3 justify-content-center">
      {cardConfig.map((card, index) => {
        return (
          <div key={index} className="col-5">
            <SelectCard {...card} />
          </div>
        );
      })}
    </div>
  );
};

export default NewOrder;
