import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function RecipeDetailScreen({ route }) {
    const recipe = route.params?.recipe || {};
    const rawType = (recipe.type || '').toLowerCase();
    const typeLabel = rawType === 'veg' ? 'Veg' : rawType === 'non_veg' ? 'Non-Veg' : rawType === 'vegan' ? 'Vegan' : recipe.type;
    const typeStyle =
        rawType === 'veg'
            ? styles.typeVeg
            : rawType === 'non_veg'
                ? styles.typeNonVeg
                : rawType === 'vegan'
                    ? styles.typeVegan
                    : null;
    const nutritionEntries =
        recipe.nutrition && typeof recipe.nutrition === 'object'
            ? Object.entries(recipe.nutrition)
            : [];
    const cuisine = recipe.cuisine ? capitalize(recipe.cuisine) : recipe.cuisine;
    const course = recipe.course ? capitalize(recipe.course) : recipe.course;

    return (
        <ScreenWrapper scrollable ScrollComponent={ScrollView}>
            {recipe.image ? (
                <Image source={{ uri: recipe.image }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>No image</Text>
                </View>
            )}

            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.subtitle}>{recipe.description}</Text>
            <View style={styles.metaRow}>
                {recipe.type ? <Text style={[styles.meta, typeStyle]}>{typeLabel}</Text> : null}
                {cuisine ? <Text style={styles.meta}>{cuisine}</Text> : null}
                {course ? <Text style={styles.meta}>{course}</Text> : null}
            </View>

            <Text style={styles.heading}>Ingredients</Text>
            {recipe.ingredients?.map((item, idx) => (
                <Text key={idx} style={styles.item}>• {item}</Text>
            ))}

            <Text style={styles.heading}>Steps</Text>
            {recipe.steps?.map((item, idx) => (
                <Text key={idx} style={styles.item}>{idx + 1}. {item}</Text>
            ))}

            {recipe.tips?.length ? (
                <View>
                    <Text style={styles.heading}>Tips</Text>
                    {recipe.tips.map((tip, idx) => (
                        <Text key={idx} style={styles.item}>• {tip}</Text>
                    ))}
                </View>
            ) : null}

            {nutritionEntries.length ? (
                <View>
                    <Text style={styles.heading}>Nutrition</Text>
                    {nutritionEntries.map(([key, value]) => (
                        <Text key={key} style={styles.item}>• {key}: {value}</Text>
                    ))}
                </View>
            ) : null}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        marginBottom: 14,
    },
    imagePlaceholder: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        backgroundColor: '#eef2ef',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    placeholderText: {
        color: colors.subtleText,
        fontWeight: '700',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 6,
    },
    subtitle: {
        color: colors.subtleText,
        marginBottom: 12,
        lineHeight: 20,
    },
    heading: {
        marginTop: 16,
        fontWeight: '800',
        fontSize: 18,
        color: colors.text,
    },
    item: {
        color: colors.text,
        marginTop: 6,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    meta: {
        backgroundColor: '#eef2ef',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        fontWeight: '700',
        color: colors.text,
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

function capitalize(value) {
    if (typeof value !== 'string') return value;
    if (!value.length) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}
