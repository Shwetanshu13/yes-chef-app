import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

const tabs = [
    { label: 'Recipes', route: 'Recipes' },
    { label: 'Create', route: 'CreateRecipe' },
    { label: 'Friends', route: 'Friends' },
];

export function AppTabs() {
    const navigation = useNavigation();
    const route = useRoute();

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = route.name === tab.route;
                return (
                    <Pressable
                        key={tab.route}
                        onPress={() => navigation.navigate(tab.route)}
                        style={[styles.tab, isActive ? styles.active : null]}
                        accessibilityRole="button"
                    >
                        <Text style={[styles.label, isActive ? styles.activeLabel : null]}>{tab.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderColor: colors.border,
        paddingVertical: 10,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        marginHorizontal: 4,
    },
    active: {
        backgroundColor: colors.primary,
    },
    label: {
        color: colors.text,
        fontWeight: '700',
    },
    activeLabel: {
        color: '#fff',
    },
});
