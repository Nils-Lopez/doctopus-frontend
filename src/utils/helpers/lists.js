// Function to update list on drop
export const handleDrop = (droppedItem, itemList, setItemList) => {
  // Ignore drop outside droppable container
  if (!droppedItem.destination) return;
  var updatedList = [...itemList];
  // Remove dragged item
  const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
  // Add dropped item
  updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
  // Update State
  setItemList(updatedList);
};

