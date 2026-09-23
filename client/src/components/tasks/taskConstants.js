import { FieldTypes } from "../../common/constants/FieldTypes";
import { PART_TABLE_COLS } from "../parts/partsConstants";

export const TASK_PARTS_COLS = [
    ...PART_TABLE_COLS,
    {id:'source',label:'Source'}
]

export const TASK_TOOLS_COLS = [
  { id: "name", label: "Name", type: FieldTypes.AUTOCOMPLETE, lookupName: 'tools' },
  { id: "owned", label: "Owned", type: FieldTypes.CHECKBOX },
  { id: "cost", label: "Cost to Buy", type: FieldTypes.NUMBER },
];