/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useNavigate } from 'react-router-dom';
import SelectCard from '../components/SelectCard';
import { CardConfig } from './LandingPage';
import sales from '../assets/card-images/sales-order.svg';
import rentOut from '../assets/card-images/rent-out.svg';
import { useAppDispatch } from '../redux/reduxHooks/reduxHooks';
import { setStore } from '../redux/features/common/commonSlice';

const StoreSelector = () => {
  const cardConfig: CardConfig[] = [
    {
      title: 'Ranwala Branch',
      subtitle: 'Ranwala Branch is initiated from here',
      image: sales,
      link: '/secured/dashboard',
      store: 'RW',
    },
    {
      title: 'Kegalle Branch',
      subtitle: 'Kegalle Branch is initiated from here',
      image: rentOut,
      link: '/secured/dashboard',
      store: 'KE',
    },
  ];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSetStore = (card) => {
    dispatch(setStore(card.store));
    navigate(card.link);
  };

  return (
    <div className="row overflow-y-auto p-3 justify-content-center align-items-center gap-5 mt-5">
      {cardConfig.map((card, index) => {
        return (
          <div key={index} className="col-4 mb-4" onClick={() => handleSetStore(card)}>
            <SelectCard {...card} />
          </div>
        );
      })}
    </div>
  );
};

export default StoreSelector;
