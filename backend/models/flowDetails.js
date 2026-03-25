import mongoose from "mongoose";

const FlowSchema = new mongoose.Schema({
  prompt: String,
  response: String
});

const flow = mongoose.model("Flow", FlowSchema);

export default flow;