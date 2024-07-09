import React from "react";
import SelectCard from "../components/SelectCard";
import cashBook from "../assets/card-images/cash-book.svg";
import priceCal from "../assets/card-images/price-calculator.svg";
import sales from "../assets/card-images/sales-order.svg";
import rentOut from "../assets/card-images/rent-out.svg";
import payments from "../assets/card-images/payments.svg";
import reports from "../assets/card-images/reports.svg";

export interface cardConfig {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

const cardConfig: cardConfig[] = [
  {
    title: "Price Calculator",
    subtitle:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
    image: priceCal,
  },
  {
    title: "Sales Order",
    subtitle:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
    image: sales,
    link: "/secured/sales",
  },
  {
    title: "Rent Out",
    subtitle:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
    image: rentOut,
  },
  {
    title: "Payments",
    subtitle:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
    image: payments,
  },
  {
    title: "Cash Book",
    subtitle:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
    image: cashBook,
  },
  {
    title: "Reports",
    subtitle:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
    image: reports,
  },
];

function LandingPage() {
  return (
    <div className="row p-3 gap-3 justify-content-center">
    {cardConfig.map((card, index) => {
      return (
        <div key={index} className="col-5">
          <SelectCard {...card}></SelectCard>
        </div>
      );
    })}
  </div>
  );
}

export default LandingPage;
