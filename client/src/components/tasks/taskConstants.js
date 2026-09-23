import { FieldTypes } from "../../common/constants/FieldTypes";

export const PART_TABLE_COLS = [
  { id: "name", label: "Name" },
  { id: "amount_required", label: "Units Required", type: FieldTypes.NUMBER},
  { id: "amount_owned", label: "Units Owned", type: FieldTypes.NUMBER },
  { id: "cost", label: "Cost per Unit", type: FieldTypes.NUMBER },
  { id: "source", label: "Source" },
];

export const TASK_PARTS_COLS = [
    ...PART_TABLE_COLS,
    {id:'source',label:'Source'}
]

export const TASK_TOOLS_COLS = [
  { id: "name", label: "Name", type: FieldTypes.AUTOCOMPLETE, lookupName: 'tools' },
  { id: "owned", label: "Owned", type: FieldTypes.CHECKBOX },
  { id: "cost", label: "Cost to Buy", type: FieldTypes.NUMBER },
];