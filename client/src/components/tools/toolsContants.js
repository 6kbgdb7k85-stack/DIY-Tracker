import { FieldTypes } from "../../common/constants/FieldTypes";

export const TOOL_TABLE_COLS = [
  { id: "name", label: "Name" },
  { id: "owned", label: "Owned", type: FieldTypes.CHECKBOX },
  { id: "cost", label: "Cost to Buy", type: FieldTypes.NUMBER },
];

export const TOOL_TASK_COLS = [
  { id: "completed", label: "Completed", type: FieldTypes.CHECKBOX },
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
];
