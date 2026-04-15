import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    const insets = useSafeAreaInsets();
    const padBottom = Math.max(insets.bottom, 12);

    return (
        <View style={[styles.container, { paddingBottom: padBottom }]}>
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
        paddingTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        marginHorizontal: 14,
        marginBottom: 10,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: -6 },
        elevation: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 14,
        marginHorizontal: 6,
    },
    active: {
        backgroundColor: colors.primary,
    },
    label: {
        color: colors.subtleText,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    activeLabel: {
        color: colors.text,
    },
});
