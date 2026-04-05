import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

/**
 * Lightweight Markdown renderer for React Native.
 * Handles: **bold**, *italic*, `code`, ### headings, - list items, and \n newlines.
 */
export default function MarkdownText({ children, style, theme }) {
    if (!children || typeof children !== 'string') return null;

    const textColor = style?.color || theme?.colors?.text || '#000';
    const lines = children.split('\n');

    return (
        <View>
            {lines.map((line, lineIndex) => {
                const trimmed = line.trim();

                // Heading (### or ##)
                if (trimmed.startsWith('### ')) {
                    return (
                        <Text key={lineIndex} style={[styles.heading, { color: textColor }]}>
                            {parseInline(trimmed.slice(4), textColor)}
                        </Text>
                    );
                }
                if (trimmed.startsWith('## ')) {
                    return (
                        <Text key={lineIndex} style={[styles.heading, { color: textColor, fontSize: 20 }]}>
                            {parseInline(trimmed.slice(3), textColor)}
                        </Text>
                    );
                }

                // Bullet list item (- or *)
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return (
                        <View key={lineIndex} style={styles.listItem}>
                            <Text style={[styles.bullet, { color: textColor }]}>•</Text>
                            <Text style={[styles.listText, { color: textColor }]}>
                                {parseInline(trimmed.slice(2), textColor)}
                            </Text>
                        </View>
                    );
                }

                // Empty line = spacer
                if (trimmed === '') {
                    return <View key={lineIndex} style={{ height: 8 }} />;
                }

                // Regular paragraph
                return (
                    <Text key={lineIndex} style={[styles.paragraph, { color: textColor }]}>
                        {parseInline(trimmed, textColor)}
                    </Text>
                );
            })}
        </View>
    );
}

/** Parse inline markdown: **bold**, *italic*, `code` */
function parseInline(text, color) {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Code: `text`
        const codeMatch = remaining.match(/`(.+?)`/);
        // Italic: *text*
        const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

        // Find the earliest match
        let earliest = null;
        let type = null;

        if (boldMatch && (!earliest || boldMatch.index < earliest.index)) {
            earliest = boldMatch;
            type = 'bold';
        }
        if (codeMatch && (!earliest || codeMatch.index < earliest.index)) {
            earliest = codeMatch;
            type = 'code';
        }
        if (italicMatch && (!earliest || italicMatch.index < earliest.index)) {
            earliest = italicMatch;
            type = 'italic';
        }

        if (!earliest) {
            parts.push(<Text key={key++} style={{ color }}>{remaining}</Text>);
            break;
        }

        // Text before the match
        if (earliest.index > 0) {
            parts.push(<Text key={key++} style={{ color }}>{remaining.slice(0, earliest.index)}</Text>);
        }

        // The matched styled text
        if (type === 'bold') {
            parts.push(<Text key={key++} style={[styles.bold, { color }]}>{earliest[1]}</Text>);
        } else if (type === 'code') {
            parts.push(
                <Text key={key++} style={[styles.code, { color }]}>{earliest[1]}</Text>
            );
        } else if (type === 'italic') {
            parts.push(<Text key={key++} style={[styles.italic, { color }]}>{earliest[1]}</Text>);
        }

        remaining = remaining.slice(earliest.index + earliest[0].length);
    }

    return parts;
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
        marginTop: 4,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 2,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
        paddingLeft: 4,
    },
    bullet: {
        fontSize: 15,
        lineHeight: 22,
        marginRight: 8,
        fontWeight: '700',
    },
    listText: {
        fontSize: 15,
        lineHeight: 22,
        flex: 1,
    },
    bold: {
        fontWeight: '800',
    },
    italic: {
        fontStyle: 'italic',
    },
    code: {
        fontFamily: 'monospace',
        backgroundColor: 'rgba(0,0,0,0.08)',
        paddingHorizontal: 4,
        borderRadius: 4,
        fontSize: 14,
    },
});
