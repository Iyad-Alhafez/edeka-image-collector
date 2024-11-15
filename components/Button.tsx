import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const Button = ({
  title = "",
  icon = "",
  size = 60,
  color = "#fff",
  disabled = false,
  onPress,
}: {
  title?: string;
  icon: string;
  size?: number;
  color?: string;
  disabled?: boolean;
  onPress: () => any;
}) => {
  return(
      <TouchableOpacity onPress={onPress} style={styles.button} disabled={disabled}>
          <FontAwesome name={icon} size={size} color={color}/>
          <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#f1f1f1',
    marginLeft: 5,
  },
});