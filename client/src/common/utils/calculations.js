export function calculateRemainingCost(items) {
  let cost = 0;
  items.forEach((item) => {
    if (Object.hasOwn(item, "owned")) {
      cost += item.owned ? 0 : item.cost;
    } else {
      cost += (item.amount_required - item.amount_owned) * item.cost;
    }
  });
  return cost;
}

// take an array of items and calculate the total value of a field in all the sub-components (example calculate remaining cost for the parts of all tasks)
export function calculateValueFromSubComponents(
  items,
  subComponentField,
  formula,
) {
  let cost = 0;
  items.forEach((item) => {
    cost += formula(item[subComponentField]);
  });
  return cost;
}
