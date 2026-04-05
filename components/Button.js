import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';

const Button = ({ title, onPress, type = 'primary', style, textStyle, isLargeText }) => {
    const { theme } = useContext(AppContext);

    const getBgColor = () => {
        if (type === 'primary') return theme.colors.primary;
        if (type === 'success') return theme.colors.secondary;
        if (type === 'outline') return 'transparent';
        return theme.colors.primary;
    };

    const getTextColor = () => {
        if (type === 'outline') return theme.colors.primary;
        return '#FFF'; // white text for primary/success
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBgColor() },
                type === 'outline' && { borderWidth: 2, borderColor: theme.colors.primary, elevation: 0, shadowOpacity: 0 },
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, { color: getTextColor() }, textStyle, isLargeText && styles.largeText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16, // Softer curves
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        minHeight: 56,
        // subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    largeText: {
        fontSize: 22,
    }
});

export default Button;
