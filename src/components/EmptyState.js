import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function EmptyState({ title, subtitle }) {
    return (
        <View style={styles.container}>
            <View style={styles.circle} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primaryMuted,
        opacity: 0.4,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        textAlign: 'center',
        color: colors.subtleText,
        marginTop: 8,
        paddingHorizontal: 24,
        lineHeight: 20,
    },
});
