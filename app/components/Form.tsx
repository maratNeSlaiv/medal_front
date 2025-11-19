import { StyleSheet, TouchableHighlight, View, ViewProps, TouchableHighlightProps } from 'react-native';
import * as Colors from '@bacons/apple-colors';
import React from 'react';

export function FormItem({ children, onPress }: Pick<ViewProps, 'children'> & Pick<TouchableHighlightProps, 'onPress'>) {
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

export function FormList({ children, ...props }: ViewProps) {
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
        props.style,
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
