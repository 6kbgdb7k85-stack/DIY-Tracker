export const PROJECT_TABLE_COLUMNS = [
  { id: "completed", label: "Completed", type: "edit-checkbox" },
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
];

export const PROJECT_TASKS_COLUMNS = [
  { id: "completed", label: "Completed", type: "edit-checkbox" },
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
];

export const PROJECT_TASKS_SUBTABLE = [
  { id: "completed", label: "Completed", type: "checkbox" },
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
];

export const PROJECT_TOOL_COLUMNS = [
  { id: "name", label: "Name" },
  { id: "owned", label: "Owned?", type: "checkbox" },
  { id: "source", label: "Source" },
  { id: "cost", label: "Cost to Buy" },
];

export const PROJECT_PART_COLUMNS=[
    {id:'name',label:'Name'},
    {id:'amount_required',label:'Units Required'},
    {id:'amount_owned',label:'Units Already Owned'},
    {id:'cost',label:'Cost per Unit'},
    {id:'source',label:'Source'}
]
