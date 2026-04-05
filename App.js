import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Modal, Switch, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Screens
import Dashboard from './screens/Dashboard';
import TimerScreen from './screens/TimerScreen';
import NotesScreen from './screens/NotesScreen';
import AIScreen from './screens/AIScreen';
import ResourcesScreen from './screens/ResourcesScreen';

// Tools
import { translations } from './utils/translations';

// App Context
import { AppContext } from './context/AppContext';

const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef();

const Sidebar = ({ currentRoute, theme, t, onOpenSettings }) => {
  const navItems = [
    { name: 'Dashboard', icon: 'grid', label: t.dashboard || 'Dashboard' },
    { name: 'Notes', icon: 'book', label: t.notes || 'Notes' },
    { name: 'AI Assistant', icon: 'sparkles', label: t.aiAssistant || 'AI Assistant' },
    { name: 'Resources', icon: 'library', label: t.resources || 'Resources' },
  ];

  const handleNav = (name) => {
    if (navigationRef.isReady()) navigationRef.navigate(name);
  };

  return (
    <View style={[styles.sidebar, { backgroundColor: theme.colors.card, borderRightColor: theme.colors.border }]}>
      <View style={styles.sidebarHeader}>
        <Ionicons name="school" size={28} color={theme.colors.primary} />
        <Text style={[styles.sidebarTitle, { color: theme.colors.primary }]}>{t.appName}</Text>
      </View>
      <View style={styles.navContainer}>
        {navItems.map(item => {
          const isActive = currentRoute === item.name;
          return (
            <TouchableOpacity 
              key={item.name} 
              style={[styles.sidebarItem, isActive && { backgroundColor: theme.colors.primary + '15' }]} 
              onPress={() => handleNav(item.name)}
            >
              <Ionicons name={item.icon} size={22} color={isActive ? theme.colors.primary : theme.colors.subText} />
              <Text style={[styles.sidebarItemText, { color: isActive ? theme.colors.primary : theme.colors.subText, fontWeight: isActive ? '700' : '500' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Settings button at bottom of sidebar */}
      <View style={{ marginTop: 'auto', paddingBottom: 30 }}>
        <TouchableOpacity 
          style={[styles.sidebarItem, { backgroundColor: theme.colors.primary + '10' }]} 
          onPress={onOpenSettings}
        >
          <Ionicons name="settings" size={22} color={theme.colors.subText} />
          <Text style={[styles.sidebarItemText, { color: theme.colors.subText }]}>{t.settings || 'Settings'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Settings Modal Component
const SettingsModal = ({ visible, onClose, theme, t, language, setLanguage, isLargeText, setIsLargeText, isDarkMode, setIsDarkMode }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t.settings || 'Settings'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.subText} />
            </TouchableOpacity>
          </View>

          {/* Language Section */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>{t.language || 'Language'}</Text>
            <View style={styles.languageRow}>
              <TouchableOpacity
                style={[
                  styles.languageBtn,
                  { borderColor: theme.colors.border },
                  language === 'en' && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.languageBtnText, { color: language === 'en' ? '#FFF' : theme.colors.text }]}>
                  🇬🇧 English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageBtn,
                  { borderColor: theme.colors.border },
                  language === 'ta' && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                ]}
                onPress={() => setLanguage('ta')}
              >
                <Text style={[styles.languageBtnText, { color: language === 'ta' ? '#FFF' : theme.colors.text }]}>
                  🇮🇳 தமிழ்
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Accessibility Section */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>{t.accessibility || 'Accessibility'}</Text>
            
            <View style={styles.settingsRow}>
              <View style={styles.settingsLabelRow}>
                <Ionicons name="text" size={20} color={theme.colors.accent} />
                <Text style={[styles.settingsLabel, { color: theme.colors.text }]}>{t.largeText}</Text>
              </View>
              <Switch
                value={isLargeText}
                onValueChange={setIsLargeText}
                trackColor={{ false: theme.colors.border, true: theme.colors.accent + '60' }}
                thumbColor={isLargeText ? theme.colors.accent : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingsRow}>
              <View style={styles.settingsLabelRow}>
                <Ionicons name="moon" size={20} color={theme.colors.primary} />
                <Text style={[styles.settingsLabel, { color: theme.colors.text }]}>{t.darkMode || 'Dark Mode'}</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary + '60' }}
                thumbColor={isDarkMode ? theme.colors.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default function App() {
  const systemColorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768; // Desktop/Tablet breakpoint

  const [language, setLanguage] = useState('en');
  const [isLargeText, setIsLargeText] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [currentRoute, setCurrentRoute] = useState('Dashboard');
  const [settingsVisible, setSettingsVisible] = useState(false);

  const t = translations[language] || translations['en'];

  // Vibrant Bento Box Colors
  const theme = {
    isDark: isDarkMode,
    colors: isDarkMode ? {
        background: '#0F172A', card: '#1E293B', text: '#F8FAFC', 
        primary: '#3B82F6', secondary: '#10B981', accent: '#8B5CF6', deepNavy: '#1E293B',
        border: '#334155', subText: '#94A3B8'
    } : {
        background: '#F8FAFC', card: '#FFFFFF', text: '#0F172A', 
        primary: '#2563EB', secondary: '#22C55E', accent: '#9333EA', deepNavy: '#0F172A',
        border: '#E2E8F0', subText: '#64748B'
    }
  };

  const navTheme = isDarkMode ? {
    ...NavigationDarkTheme,
    colors: { ...NavigationDarkTheme.colors, background: theme.colors.background, card: theme.colors.card, text: theme.colors.text, border: theme.colors.border, primary: theme.colors.primary }
  } : {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: theme.colors.background, card: theme.colors.card, text: theme.colors.text, border: theme.colors.border, primary: theme.colors.primary }
  };

  // Header right button with settings gear
  const headerRight = () => (
    <TouchableOpacity onPress={() => setSettingsVisible(true)} style={{ marginRight: 16 }}>
      <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );

  return (
    <AppContext.Provider value={{ language, setLanguage, isLargeText, setIsLargeText, t, focusMode, setFocusMode, isDarkMode, setIsDarkMode, theme, isLargeScreen }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, flexDirection: isLargeScreen ? 'row' : 'column', backgroundColor: theme.colors.background }}>
          {/* Render Fixed Sidebar on Monitors */}
          {isLargeScreen && !focusMode && (
            <Sidebar currentRoute={currentRoute} theme={theme} t={t} onOpenSettings={() => setSettingsVisible(true)} />
          )}

          <View style={{ flex: 1 }}>
            <NavigationContainer 
              theme={navTheme} 
              ref={navigationRef}
              onStateChange={() => {
                const current = navigationRef.getCurrentRoute();
                if (current) setCurrentRoute(current.name);
              }}
            >
              {focusMode ? (
                <TimerScreen />
              ) : (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                      let iconName = 'grid';
                      if (route.name === 'Notes') iconName = 'book';
                      if (route.name === 'AI Assistant') iconName = 'sparkles';
                      if (route.name === 'Resources') iconName = 'library';
                      return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.subText,
                    // Hide bottom tab bar if large screen
                    tabBarStyle: isLargeScreen ? { display: 'none' } : {
                      backgroundColor: theme.colors.card,
                      borderTopColor: theme.colors.border,
                      elevation: 10,
                      borderTopWidth: 1,
                      paddingBottom: 8,
                      paddingTop: 8,
                      height: 60,
                    },
                    headerShown: true,
                    headerStyle: { backgroundColor: theme.colors.background, shadowColor: 'transparent', elevation: 0 },
                    headerTitleStyle: { fontWeight: '800', fontSize: isLargeScreen ? 32 : (isLargeText ? 26 : 22), color: theme.colors.text },
                    headerShadowVisible: false,
                    headerRight: headerRight,
                  })}
                >
                  <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: t.studentDashboard, tabBarLabel: t.dashboard }} />
                  <Tab.Screen name="Notes" component={NotesScreen} options={{ title: t.knowledgeVault, tabBarLabel: t.notes }} />
                  <Tab.Screen name="AI Assistant" component={AIScreen} options={{ title: t.aiStudyAssistant, tabBarLabel: t.aiAssistant }} />
                  <Tab.Screen name="Resources" component={ResourcesScreen} options={{ title: t.resources, tabBarLabel: t.resources }} />
                </Tab.Navigator>
              )}
            </NavigationContainer>
          </View>
        </View>

        {/* Settings Modal */}
        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          theme={theme}
          t={t}
          language={language}
          setLanguage={setLanguage}
          isLargeText={isLargeText}
          setIsLargeText={setIsLargeText}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    borderRightWidth: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 12,
  },
  navContainer: {
    gap: 12,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  sidebarItemText: {
    fontSize: 16,
    marginLeft: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  languageBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  languageBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
