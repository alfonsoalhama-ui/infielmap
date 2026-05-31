import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageCircle, PlusCircle, User } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { MainStackParamList, MainTabParamList } from '@/types';

import { ConversationsScreen } from '@/screens/main/ConversationsScreen';
import { CameraScreen } from '@/screens/main/CameraScreen';
import { ProfileScreen } from '@/screens/main/ProfileScreen';
import { ChatScreen } from '@/screens/main/ChatScreen';
import { SecureViewerScreen } from '@/screens/viewer/SecureViewerScreen';
import { SendMediaScreen } from '@/screens/main/SendMediaScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const color = focused ? colors.primary : colors.textMuted;
  const size = 24;

  const labels: Record<string, string> = {
    Conversations: 'Chats',
    Camera: 'New',
    Profile: 'Profile',
  };

  const IconComponent = {
    Conversations: <MessageCircle size={size} color={color} strokeWidth={focused ? 2.2 : 1.8} />,
    Camera: <PlusCircle size={size} color={color} strokeWidth={focused ? 2.2 : 1.8} />,
    Profile: <User size={size} color={color} strokeWidth={focused ? 2.2 : 1.8} />,
  }[label];

  return (
    <View style={styles.tabIcon}>
      {IconComponent}
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {labels[label]}
      </Text>
    </View>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Conversations" focused={focused} /> }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Camera" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen
        name="SecureViewer"
        component={SecureViewerScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="SendMedia" component={SendMediaScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
