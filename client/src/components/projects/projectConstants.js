import { FieldTypes } from "../../common/constants/FieldTypes";
import { calculateRemainingCost, calculateValueFromSubComponents } from "../../common/utils/calculations";

export const PROJECT_TABLE_COLUMNS = [
  { id: "completed", label: "Completed", type: FieldTypes.EDIT_CHECKBOX },
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  {id:'tasks',label:'Remaining Costs',type:FieldTypes.CALCULATED, calculation:(cellData)=>`$${calculateValueFromSubComponents(cellData,'parts',calculateRemainingCost)+calculateValueFromSubComponents(cellData,'tools',calculateRemainingCost)}`}
];

export const PROJECT_TASKS_COLUMNS = [
  { id: "completed", label: "Completed", type: FieldTypes.CHECKBOX },
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "time", label: "Estimated Time to Complete" },
];

export const PROJECT_TASKS_SUBTABLE = [
  { id: "completed", label: "Completed", type: FieldTypes.CHECKBOX },
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
];

export const PROJECT_TOOL_COLUMNS = [
  { id: "name", label: "Name" },
  { id: "owned", label: "Owned?", type: FieldTypes.CHECKBOX },
  { id: "cost", label: "Cost to Buy", type: FieldTypes.NUMBER },
];

export const PROJECT_PART_COLUMNS = [
  { id: "name", label: "Name" },
  { id: "amount_required", label: "Units Required", type: FieldTypes.NUMBER },
  { id: "amount_owned", label: "Units Already Owned", type: FieldTypes.NUMBER },
  { id: "cost", label: "Cost per Unit", type: FieldTypes.NUMBER },
  { id: "source", label: "Source" },
];
