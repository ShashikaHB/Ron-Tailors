import SelectCard from "../components/SelectCard";

const NewOrder = () => {
  return (
    <div className="d-flex align-item-center justify-content-center gap-3">
      <div className="d-flex align-items-center justify-content-center">
        <SelectCard></SelectCard>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <SelectCard></SelectCard>
      </div>
    </div>
  );
};

export default NewOrder;
