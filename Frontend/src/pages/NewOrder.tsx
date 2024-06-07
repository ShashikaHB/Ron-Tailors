import SelectCard from "../components/SelectCard";
import { cardConfig } from "./LandingPage";
import sales from "../assets/card-images/sales-order.svg";
import rentOut from "../assets/card-images/rent-out.svg";

const NewOrder = () => {
  const cardConfig: cardConfig[] = [
    {
      title: "Rent Out",
      subtitle:
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
      image: rentOut,
    },
    {
      title: "Sales Order",
      subtitle:
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
      image: sales,
    },
  ];
  return (
    <div className="d-flex align-item-center justify-content-center gap-3">
      {cardConfig.map((card, index) => {
        return (
          <div
            key={index}
            className="d-flex align-items-center justify-content-center"
          >
            <SelectCard {...card}></SelectCard>
          </div>
        );
      })}
    </div>
  );
};

export default NewOrder;
