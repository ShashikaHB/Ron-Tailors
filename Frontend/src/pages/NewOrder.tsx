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
      link: "/secured/addSalesOrder",
    },
  ];
  return (
    <div className="row overflow-y-auto p-3 gap-3 justify-content-center">
      {cardConfig.map((card, index) => {
        return (
          <div
            key={index}
            className="col-5"
          >
            <SelectCard {...card}></SelectCard>
          </div>
        );
      })}
    </div>
  );
};

export default NewOrder;
