import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

export function Input({ label, value, onChangeText, placeholder, multiline, keyboardType, secureTextEntry, autoCapitalize = 'none' }) {
    return (
        <View style={styles.container}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.subtleText}
                multiline={multiline}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                style={[styles.input, multiline ? styles.multiline : null]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    label: {
        color: colors.subtleText,
        marginBottom: 6,
        fontSize: 13,
        letterSpacing: 0.2,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: colors.text,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
    },
    multiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
});
