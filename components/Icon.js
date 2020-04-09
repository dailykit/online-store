import React from "react";

import { Feather } from "@expo/vector-icons";

class IconExtra extends React.Component {
  state = {
    fontLoaded: false,
  };

  render() {
    const { name, color, size, ...rest } = this.props;

    return <Feather name={name} color={color} size={size} {...rest} />;
  }
}

export default IconExtra;
