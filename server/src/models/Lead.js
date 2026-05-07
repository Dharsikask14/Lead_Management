import mongoose from "mongoose";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

const leadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    leadName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    serviceInterested: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New"
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ""
    }
  },
  { timestamps: true }
);

leadSchema.index({ userId: 1, createdAt: -1 });
leadSchema.index({ userId: 1, status: 1 });

leadSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    leadName: this.leadName,
    companyName: this.companyName,
    email: this.email,
    phoneNumber: this.phoneNumber,
    serviceInterested: this.serviceInterested,
    status: this.status,
    notes: this.notes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Lead = mongoose.model("Lead", leadSchema);
