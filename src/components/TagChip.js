import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

export function TagChip({ label, active, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.chip, active ? styles.chipActive : null]}
            accessibilityRole="button"
        >
            <Text style={[styles.text, active ? styles.textActive : null]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#eef2ef',
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    text: {
        color: colors.text,
        fontWeight: '600',
    },
    textActive: {
        color: '#fff',
    },
});
