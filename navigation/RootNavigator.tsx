import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { typography, radius } from '../theme';
import { useThemeMode } from '../hooks/useThemeMode';

import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import WorkoutSplitScreen from '../screens/WorkoutSplitScreen';
import ArnoldSplitScreen from '../screens/ArnoldSplitScreen';
import MentzerSplitScreen from '../screens/MentzerSplitScreen';
import PlatzSplitScreen from '../screens/PlatzSplitScreen';
import LevroneSplitScreen from '../screens/LevroneSplitScreen';
import CircuitSplitScreen from '../screens/CircuitSplitScreen';
import WorkoutExecutionScreen from '../screens/WorkoutExecutionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UtilitiesScreen from '../screens/UtilitiesScreen';
import TipsScreen from '../screens/TipsScreen';
import BmiScreen from '../screens/calculators/BmiScreen';
import BodyFatScreen from '../screens/calculators/BodyFatScreen';
import ProteinScreen from '../screens/calculators/ProteinScreen';
import CalorieScreen from '../screens/calculators/CalorieScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Home: 'home',
  Workouts: 'fitness-center',
  Utilities: 'calculate',
  Tips: 'lightbulb',
};

function TabSlot({ route, isActive, onPress, label, scale, activeColor, inactiveColor }: any) {
  const color = isActive ? activeColor : inactiveColor;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isActive ? { selected: true } : {}}
      onPress={onPress}
      activeOpacity={0.8}
      style={navStyles.tabSlot}
    >
      <Animated.View style={[navStyles.tabSlotInner, isActive ? { transform: [{ scale }] } : null]}>
        <MaterialIcons name={TAB_ICONS[route.name]} color={color} size={20} />
        <Text
          style={[navStyles.label, { color }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function FloatingTabBar({ state, descriptors, navigation }: any) {
  const { mode, colors } = useThemeMode();
  const isDark = mode === 'dark';
  const glass = {
    tint: isDark ? 'rgba(16,16,16,0.28)' : 'rgba(255,255,255,0.34)',
    rim: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.95)',
    sheenTop: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.95)',
    pillFill: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.62)',
    pillRim: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.9)',
    pillSheen: isDark ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.95)',
    activeColor: colors.primary,
    inactiveColor: isDark ? colors.secondary : colors.onSurfaceVariant,
  };
  const routeCount = state.routes.length;
  const [barWidth, setBarWidth] = useState(0);
  const slotWidth = barWidth / routeCount || 0;

  const pillX = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;
  const dragStartX = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    if (!barWidth || dragging.current) return;
    Animated.spring(pillX, { toValue: state.index * slotWidth, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  }, [state.index, barWidth]);

  const navigateToIndex = (index: number) => {
    const route = state.routes[index];
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (index !== state.index && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gesture) =>
        Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
      onPanResponderGrant: () => {
        dragging.current = true;
        dragStartX.current = state.index * slotWidth;
        Animated.spring(pillScale, { toValue: 1.06, useNativeDriver: true, speed: 20, bounciness: 10 }).start();
      },
      onPanResponderMove: (_evt, gesture) => {
        if (!slotWidth) return;
        const raw = dragStartX.current + gesture.dx;
        const clamped = Math.max(0, Math.min(raw, slotWidth * (routeCount - 1)));
        pillX.setValue(clamped);
      },
      onPanResponderRelease: (_evt, gesture) => {
        dragging.current = false;
        Animated.spring(pillScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start();
        if (!slotWidth) return;
        const raw = dragStartX.current + gesture.dx;
        const clamped = Math.max(0, Math.min(raw, slotWidth * (routeCount - 1)));
        const nearestIndex = Math.round(clamped / slotWidth);
        Animated.spring(pillX, { toValue: nearestIndex * slotWidth, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
        navigateToIndex(nearestIndex);
      },
      onPanResponderTerminate: () => {
        dragging.current = false;
        Animated.spring(pillScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start();
        Animated.spring(pillX, { toValue: state.index * slotWidth, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
      },
    })
  ).current;

  return (
    <View style={navStyles.barWrapper} pointerEvents="box-none">
      <View style={navStyles.barShadow}>
        <View
          style={[navStyles.bar, { borderColor: glass.rim }]}
          onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
          {...panResponder.panHandlers}
        >
          <BlurView
            tint={isDark ? 'dark' : 'light'}
            intensity={60}
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: glass.tint }]} />
          <LinearGradient
            pointerEvents="none"
            colors={[glass.sheenTop, 'transparent']}
            style={navStyles.sheen}
          />

          {barWidth > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                navStyles.pill,
                {
                  width: slotWidth - 10,
                  backgroundColor: glass.pillFill,
                  borderColor: glass.pillRim,
                  shadowColor: isDark ? '#000' : '#7c6a48',
                  transform: [{ translateX: pillX }, { scale: pillScale }],
                },
              ]}
            >
              <BlurView
                tint={isDark ? 'light' : 'light'}
                intensity={isDark ? 24 : 40}
                experimentalBlurMethod="dimezisBlurView"
                style={[StyleSheet.absoluteFill, { borderRadius: navStyles.pill.borderRadius }]}
              />
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: glass.pillFill, borderRadius: navStyles.pill.borderRadius }]} />
              <LinearGradient
                pointerEvents="none"
                colors={[glass.pillSheen, 'transparent']}
                style={navStyles.pillSheen}
              />
            </Animated.View>
          )}
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isActive = state.index === index;
            const label = (options.tabBarLabel ?? options.title ?? route.name).toString().toUpperCase();

            return (
              <TabSlot
                key={route.key}
                route={route}
                isActive={isActive}
                onPress={() => navigateToIndex(index)}
                label={label}
                scale={pillScale}
                activeColor={glass.activeColor}
                inactiveColor={glass.inactiveColor}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const navStyles = {
  barWrapper: {
    position: 'absolute' as const,
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center' as const,
  },
  barShadow: {
    width: '92%' as const,
    maxWidth: 400,
    borderRadius: radius.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 14,
  },
  bar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    width: '100%' as const,
    height: 80,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    overflow: 'hidden' as const,
  },
  sheen: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 34,
  },
  pill: {
    position: 'absolute' as const,
    left: 5,
    top: 4,
    bottom: 4,
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden' as const,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  pillSheen: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 22,
  },
  tabSlot: {
    flex: 1,
    height: '100%' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  tabSlotInner: {
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 3,
  },
  label: { ...typography.labelCaps, fontSize: 8.5, letterSpacing: 0.6, textAlign: 'center' as const, width: '100%' as const },
};

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Utilities" component={UtilitiesScreen} />
      <Tab.Screen name="Tips" component={TipsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="WorkoutSplit" component={WorkoutSplitScreen} />
      <Stack.Screen name="ArnoldSplit" component={ArnoldSplitScreen} />
      <Stack.Screen name="MentzerSplit" component={MentzerSplitScreen} />
      <Stack.Screen name="PlatzSplit" component={PlatzSplitScreen} />
      <Stack.Screen name="LevroneSplit" component={LevroneSplitScreen} />
      <Stack.Screen name="CircuitSplit" component={CircuitSplitScreen} />
      <Stack.Screen name="WorkoutExecution" component={WorkoutExecutionScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="BmiCalc" component={BmiScreen} />
      <Stack.Screen name="BodyFatCalc" component={BodyFatScreen} />
      <Stack.Screen name="ProteinCalc" component={ProteinScreen} />
      <Stack.Screen name="CalorieCalc" component={CalorieScreen} />
    </Stack.Navigator>
  );
}
