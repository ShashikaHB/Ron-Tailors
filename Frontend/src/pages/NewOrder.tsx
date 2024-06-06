import SelectCard from "../components/SelectCard";

const NewOrder = () => {
  return (
    <div className="d-flex align-item-center justify-content-space-even">
      <div>
        <SelectCard></SelectCard>
      </div>
      <div>
        <SelectCard></SelectCard>
      </div>
    </div>
  );
};

export default NewOrder;
