import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        try {
            setSubmitting(true);
            await login({ email, password });
        } catch (err) {
            Alert.alert('Login failed', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.hero}>
                <Text style={styles.title}>Yes Chef</Text>
                <Text style={styles.subtitle}>Your minimal recipe companion with a dash of AI.</Text>
            </View>
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
            <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
            />
            <Button label={submitting ? 'Signing in…' : 'Sign in'} onPress={handleLogin} disabled={submitting} />
            <Pressable style={styles.link} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.linkText}>Create an account</Text>
            </Pressable>
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
    link: {
        marginTop: 18,
        alignItems: 'center',
    },
    linkText: {
        color: colors.primary,
        fontWeight: '700',
    },
});
