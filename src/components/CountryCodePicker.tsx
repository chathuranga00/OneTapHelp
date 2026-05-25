import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';

import { colors } from '../constants';
import { countryCodes, getDefaultCountry, type CountryCode } from '../constants/countryCodes';

type CountryCodePickerProps = {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
  disabled?: boolean;
};

export function CountryCodePicker({ value, onChange, disabled }: CountryCodePickerProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            disabled={disabled}
            style={styles.button}
            contentStyle={styles.buttonContent}
            textColor={colors.text}
          >
            {value.dial}
          </Button>
        }
        contentStyle={styles.menu}
      >
        {countryCodes.map((country) => (
          <Menu.Item
            key={country.code}
            onPress={() => {
              onChange(country);
              setVisible(false);
            }}
            title={`${country.label} (${country.dial})`}
            titleStyle={styles.menuItem}
          />
        ))}
      </Menu>
    </View>
  );
}

export { getDefaultCountry };

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 8,
  },
  button: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minWidth: 88,
  },
  buttonContent: {
    height: 56,
  },
  menu: {
    backgroundColor: colors.surface,
  },
  menuItem: {
    color: colors.text,
  },
});
