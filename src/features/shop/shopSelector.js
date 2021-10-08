import { createSelector } from "reselect";

const shopItemsSelector = (state) => state.shop.items;
const taxPercentSelector = (state) => state.shop.taxPercent;

// subtotal 값을 메모이제이션 합니다.
const subtotalSelector = createSelector(shopItemsSelector, (items) =>
  items.reduce((subtotal, item) => subtotal + item.value, 0)
);

// 메모이제이션된 subtotal 값과 taxPercentSelector를 합성하여
// 새로운 값을 메모이제이션 한다.
const taxSelector = createSelector(
  subtotalSelector,
  taxPercentSelector,
  (subtotal, taxPercent) => subtotal * (taxPercent / 100)
);

const totalSelector = createSelector(
  subtotalSelector,
  taxSelector,
  (subtotal, tax) => ({ total: subtotal + tax })
);

const exampleState = {
  shop: {
    taxPercent: 8,
    items: [
      { name: "apple", value: 1.2 },
      { name: "orange", value: 0.95 },
    ],
  },
};
