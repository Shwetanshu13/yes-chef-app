import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

export function Button({ label, onPress, variant = 'primary', disabled }) {
    const isPrimary = variant === 'primary';
    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.base,
                isPrimary ? styles.primary : styles.secondary,
                pressed && !disabled ? styles.pressed : null,
                disabled ? styles.disabled : null,
            ]}
        >
            <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        minWidth: 120,
        elevation: 2,
    },
    primary: {
        backgroundColor: colors.primary,
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        borderWidth: 1,
        borderColor: '#d59605',
    },
    secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    pressed: {
        transform: [{ scale: 0.995 }],
        opacity: 0.98,
    },
    disabled: {
        opacity: 0.5,
    },
    label: {
        fontWeight: '700',
        letterSpacing: 0.2,
        fontSize: 15,
    },
    primaryLabel: {
        color: colors.text,
    },
    secondaryLabel: {
        color: colors.text,
    },
});
