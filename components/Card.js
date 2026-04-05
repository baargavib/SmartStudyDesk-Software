import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';

const Card = ({ children, style }) => {
    const { theme } = useContext(AppContext);
    return (
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, shadowColor: theme.isDark ? '#000' : '#000' }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 24, // Modern rounded corners
        padding: 20,
        marginVertical: 10,
        borderWidth: 1, // Flashcard edge
        // Modern soft shadow
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 2,
    }
});

export default Card;
