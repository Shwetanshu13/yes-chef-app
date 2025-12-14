import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function RecipeCard({ recipe, onPress }) {
    const imageUrl = recipe.image;
    const rawType = (recipe.type || '').toLowerCase();
    const typeLabel = rawType === 'veg' ? 'Veg' : rawType === 'non_veg' ? 'Non-Veg' : rawType === 'vegan' ? 'Vegan' : 'Type';
    const cuisine = recipe.cuisine ? capitalize(recipe.cuisine) : 'Cuisine';
    const course = recipe.course ? capitalize(recipe.course) : 'Course';
    const typeStyle =
        rawType === 'veg'
            ? styles.typeVeg
            : rawType === 'non_veg'
                ? styles.typeNonVeg
                : rawType === 'vegan'
                    ? styles.typeVegan
                    : null;

    return (
        <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>No image</Text>
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {recipe.title || 'Untitled recipe'}
                </Text>

                <View style={styles.metaRow}>
                    <Text style={[styles.meta, typeStyle]}>{typeLabel}</Text>
                    <Text style={styles.meta}>{cuisine}</Text>
                    <Text style={styles.meta}>{course}</Text>
                </View>
            </View>
        </Pressable>
    );
}

function capitalize(value) {
    if (typeof value !== 'string') return value;
    if (!value.length) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    image: {
        width: '100%',
        height: 160,
    },
    imagePlaceholder: {
        width: '100%',
        height: 160,
        backgroundColor: '#eef2ef',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: colors.subtleText,
        fontWeight: '700',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    meta: {
        color: colors.text,
        fontSize: 13,
        fontWeight: '700',
        backgroundColor: '#eef2ef',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    typeVeg: {
        color: '#1b5e20',
        backgroundColor: '#e8f5e9',
    },
    typeNonVeg: {
        color: '#b71c1c',
        backgroundColor: '#ffebee',
    },
    typeVegan: {
        color: '#2e7d32',
        backgroundColor: '#e8f5e9',
    },
});
