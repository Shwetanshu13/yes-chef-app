import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { TagChip } from '../components/TagChip';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { createRecipe } from '../services/recipeService';
import { generateRecipeFromPrompt, structureRecipeFromText } from '../services/aiService';
import { AppTabs } from '../components/AppTabs';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Quick'];

function RecipePreview({ data }) {
    if (!data) return null;
    return (
        <View style={styles.preview}>
            <Text style={styles.previewTitle}>{data.title}</Text>
            <Text style={styles.previewSubtitle}>{data.description}</Text>
            <Text style={styles.previewLabel}>Ingredients</Text>
            {data.ingredients?.map((item, idx) => (
                <Text key={idx} style={styles.previewItem}>• {item}</Text>
            ))}
            <Text style={styles.previewLabel}>Steps</Text>
            {data.steps?.map((item, idx) => (
                <Text key={idx} style={styles.previewItem}>{idx + 1}. {item}</Text>
            ))}
        </View>
    );
}

export default function CreateRecipeScreen() {
    const { token } = useAuth();
    const [mode, setMode] = useState('manual');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('2');
    const [category, setCategory] = useState(categories[0]);
    const [rawText, setRawText] = useState('');
    const [prompt, setPrompt] = useState('');
    const [aiResult, setAiResult] = useState(null);
    const [working, setWorking] = useState(false);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setIngredients('');
        setSteps('');
        setPrepTime('');
        setCookTime('');
        setServings('2');
        setCategory(categories[0]);
        setRawText('');
        setPrompt('');
        setAiResult(null);
    };

    const handleManualSave = async () => {
        try {
            setWorking(true);
            const recipe = {
                title,
                description,
                ingredients: ingredients.split('\n').map((i) => i.trim()).filter(Boolean),
                steps: steps.split('\n').map((s) => s.trim()).filter(Boolean),
                prepTime: Number(prepTime) || 0,
                cookTime: Number(cookTime) || 0,
                servings: Number(servings) || 1,
                category,
            };
            await createRecipe({ token, recipe });
            Alert.alert('Saved', 'Recipe saved successfully');
            resetForm();
        } catch (err) {
            Alert.alert('Could not save', err.message);
        } finally {
            setWorking(false);
        }
    };

    const handleStructure = async () => {
        try {
            setWorking(true);
            const data = await structureRecipeFromText(rawText);
            setAiResult(data);
        } catch (err) {
            Alert.alert('AI failed', err.message);
        } finally {
            setWorking(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setWorking(true);
            const data = await generateRecipeFromPrompt(prompt);
            setAiResult(data);
        } catch (err) {
            Alert.alert('AI failed', err.message);
        } finally {
            setWorking(false);
        }
    };

    const saveAiRecipe = async () => {
        try {
            if (!aiResult) return;
            setWorking(true);
            await createRecipe({ token, recipe: aiResult });
            Alert.alert('Saved', 'Recipe saved successfully');
            resetForm();
        } catch (err) {
            Alert.alert('Could not save', err.message);
        } finally {
            setWorking(false);
        }
    };

    return (
        <View style={styles.page}>
            <ScreenWrapper scrollable ScrollComponent={ScrollView}>
                <Text style={styles.heading}>Create recipe</Text>
                <View style={styles.modeRow}>
                    <TagChip label="Manual" active={mode === 'manual'} onPress={() => setMode('manual')} />
                    <TagChip label="Semi AI" active={mode === 'semi'} onPress={() => setMode('semi')} />
                    <TagChip label="Full AI" active={mode === 'full'} onPress={() => setMode('full')} />
                </View>

                {mode === 'manual' && (
                    <View>
                        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Cozy tomato pasta" />
                        <Input label="Description" value={description} onChangeText={setDescription} placeholder="Quick weekday dinner" multiline />
                        <Input label="Ingredients" value={ingredients} onChangeText={setIngredients} placeholder="One per line" multiline />
                        <Input label="Steps" value={steps} onChangeText={setSteps} placeholder="One step per line" multiline />
                        <View style={styles.row}>
                            <View style={styles.half}><Input label="Prep (min)" value={prepTime} onChangeText={setPrepTime} keyboardType="numeric" /></View>
                            <View style={styles.half}><Input label="Cook (min)" value={cookTime} onChangeText={setCookTime} keyboardType="numeric" /></View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.half}><Input label="Servings" value={servings} onChangeText={setServings} keyboardType="numeric" /></View>
                            <View style={styles.half}>
                                <Text style={styles.label}>Category</Text>
                                <View style={styles.tagsRow}>
                                    {categories.map((c) => (
                                        <TagChip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
                                    ))}
                                </View>
                            </View>
                        </View>
                        <Button label={working ? 'Saving…' : 'Save recipe'} onPress={handleManualSave} disabled={working} />
                    </View>
                )}

                {mode === 'semi' && (
                    <View>
                        <Input
                            label="Paste your unformatted recipe"
                            value={rawText}
                            onChangeText={setRawText}
                            placeholder="Copy any recipe text here"
                            multiline
                        />
                        <Button label={working ? 'Thinking…' : 'Structure with AI'} onPress={handleStructure} disabled={working} />
                        <RecipePreview data={aiResult} />
                        {aiResult ? <Button label={working ? 'Saving…' : 'Save recipe'} onPress={saveAiRecipe} disabled={working} /> : null}
                    </View>
                )}

                {mode === 'full' && (
                    <View>
                        <Input
                            label="Describe the dish"
                            value={prompt}
                            onChangeText={setPrompt}
                            placeholder="A cozy fall soup with pumpkin and sage"
                            multiline
                        />
                        <Button label={working ? 'Creating…' : 'Generate with AI'} onPress={handleGenerate} disabled={working} />
                        <RecipePreview data={aiResult} />
                        {aiResult ? <Button label={working ? 'Saving…' : 'Save recipe'} onPress={saveAiRecipe} disabled={working} /> : null}
                    </View>
                )}
            </ScreenWrapper>
            <AppTabs />
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.background,
    },
    heading: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
    },
    modeRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 6,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    half: {
        flex: 1,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    label: {
        color: colors.subtleText,
        marginBottom: 8,
        fontWeight: '700',
    },
    preview: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
        borderWidth: 1,
        borderColor: colors.border,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
    },
    previewSubtitle: {
        color: colors.subtleText,
        marginTop: 4,
        marginBottom: 8,
    },
    previewLabel: {
        marginTop: 8,
        fontWeight: '700',
        color: colors.text,
    },
    previewItem: {
        color: colors.text,
        marginTop: 4,
    },
});
