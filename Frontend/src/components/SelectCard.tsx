import React, {memo} from "react";
import { Link } from "react-router-dom";
interface SelectCardProps {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

function SelectCard({ title, subtitle, image, link }: SelectCardProps) {
  return (
    <div className="select-card d-flex flex-row">
      <div className="select-card-body d-flex flex-column">
        <div className="select-card-header">{title}</div>
        <div className="select-card-body-text">{subtitle}</div>
        {link ? (
          <Link to={link}>
            <button className="primary-button">View</button>
          </Link>
        ) : (
          <button className="primary-button">View</button>
        )}
      </div>
      <div className="select-card-img">
        <img className="top-bar-icon" src={image} alt="react logo" />
      </div>
    </div>
  );
}

export default memo(SelectCard);
