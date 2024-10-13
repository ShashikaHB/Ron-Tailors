/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { memo } from 'react';
import { Link, useNavigation } from 'react-router-dom';

interface SelectCardProps {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

const SelectCard = ({ title, subtitle, image, link }: SelectCardProps) => {
  const navigate = useNavigation();
  return (
    <div className="select-card d-flex flex-row" onClick={() => navigate(link)}>
      <div className="select-card-body d-flex flex-column">
        <div className="select-card-header">{title}</div>
        <div className="select-card-body-text">{subtitle}</div>
        {link ? (
          <Link to={link} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
            <button type="button" className="primary-button">
              View
            </button>
          </Link>
        ) : (
          <button type="button" className="primary-button">
            View
          </button>
        )}
      </div>
      <div className="select-card-img">
        <img className="top-bar-icon" src={image} alt="react logo" />
      </div>
    </div>
  );
};

export default memo(SelectCard);
