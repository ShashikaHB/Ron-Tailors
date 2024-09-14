import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const salarySchema = new mongoose.Schema({
  salesPerson: {
    gradeA: {
      type: Number, // Assuming salary is a numeric value
      required: [true, "Grade A salary is required."],
    },
    gradeB: {
      type: Number,
      required: [true, "Grade B salary is required."],
    },
    gradeC: {
      type: Number,
      required: [true, "Grade C salary is required."],
    },
    ironingSalesMen: {
      type: Number,
      required: [true, "Ironing salesmen salary is required."],
    },
    alteringSalesMen: {
      type: Number,
      required: [true, "Altering salesmen salary is required."],
    },
    bonus: {
        type: Number,
        required: [true, "Salesmen Bonus salary is required."],
    }
  },
  cleaningStaff: {
    gradeA: {
      type: Number, // Assuming salary is a numeric value
      required: [true, "Grade A salary is required."],
    },
    gradeB: {
      type: Number,
      required: [true, "Grade B salary is required."],
    },
    gradeC: {
      type: Number,
      required: [true, "Grade C salary is required."],
    },
    bonus: {
        type: Number,
        required: [true, "Salesmen Bonus salary is required."],
    }
  },
});

// Export the model
export const SalaryModel = mongoose.model("Salary", salarySchema);
