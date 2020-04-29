import React, { useState } from 'react';
import { View, Text } from 'react-native';

import InventoryProductItemCollapsed from './InventoryProductItemCollapsed';
import InventoryProductItemExpanded from './InventoryProductItemExpanded';

const CustomizableProductItem = ({
  isSelected,
  _id,
  setSelected,
  isLast,
  openModal,
  navigation,
  data,
}) => {
  const [expanded, setExpanded] = useState(false);

  const [isSelectedInside, setisSelectedInside] = useState(0);
  if (expanded && isSelected) {
    return (
      <InventoryProductItemExpanded
        isSelected={isSelected}
        _id={_id}
        data={data}
        setSelected={setSelected}
        isLast={isLast}
        openModal={openModal}
        navigation={navigation}
        setExpanded={setExpanded}
      />
    );
  }
  return (
    <InventoryProductItemCollapsed
      isSelected={isSelected}
      _id={_id}
      data={data}
      setSelected={setSelected}
      isLast={isLast}
      openModal={openModal}
      navigation={navigation}
      setExpanded={setExpanded}
    />
  );
};

export default CustomizableProductItem;
