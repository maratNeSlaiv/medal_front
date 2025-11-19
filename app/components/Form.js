import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import * as Colors from '@bacons/apple-colors';

export function FormItem({ children, onPress }) {
  return (
    <TouchableHighlight
      style={{ padding: 12, paddingLeft: 16 }}
      underlayColor={Colors.systemGray4}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {children}
      </View>
    </TouchableHighlight>
  );
}

export function FormList({ children, style, ...props }) {
  const childrenWithSeparator = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const isLastChild = index === React.Children.count(children) - 1;
      return (
        <>
          {child}
          {!isLastChild && <Separator />}
        </>
      );
    }
    return child;
  });

  return (
    <View
      {...props}
      style={[
        {
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: Colors.secondarySystemGroupedBackground,
        },
        style,
      ]}
    >
      {childrenWithSeparator}
    </View>
  );
}

function Separator() {
  return (
    <View
      style={{
        marginStart: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.separator,
      }}
    />
  );
}
