import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSignup = async () => {
        try {
            setSubmitting(true);
            await signup({ name, email, password });
        } catch (err) {
            Alert.alert('Signup failed', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.hero}>
                <Text style={styles.title}>Join Yes Chef</Text>
                <Text style={styles.subtitle}>Save, generate, and share recipes with friends.</Text>
            </View>
            <Input label="Name" value={name} onChangeText={setName} placeholder="Ava" autoCapitalize="words" />
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
            <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
            />
            <Button label={submitting ? 'Creating account…' : 'Create account'} onPress={handleSignup} disabled={submitting} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    hero: {
        marginTop: 30,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text,
    },
    subtitle: {
        color: colors.subtleText,
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
    },
});
