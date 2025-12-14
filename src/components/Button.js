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
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        marginTop: 8,
    },
    primary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    secondary: {
        backgroundColor: colors.surface,
    },
    pressed: {
        transform: [{ scale: 0.99 }],
        opacity: 0.96,
    },
    disabled: {
        opacity: 0.5,
    },
    label: {
        fontWeight: '700',
        letterSpacing: 0.2,
        fontSize: 16,
    },
    primaryLabel: {
        color: '#ffffff',
    },
    secondaryLabel: {
        color: colors.text,
    },
});
