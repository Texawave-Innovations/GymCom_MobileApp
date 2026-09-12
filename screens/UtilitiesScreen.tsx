import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { useThemeMode } from '../hooks/useThemeMode';
import { makeCalcStyles } from './calculators/shared';

const CALCULATORS: {
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  desc: string;
}[] = [
  { route: 'BmiCalc', icon: 'monitor-weight', title: 'BMI', desc: 'Body mass index from height & weight' },
  { route: 'BodyFatCalc', icon: 'pie-chart', title: 'Body Fat %', desc: 'Estimated body fat from BMI, age & sex' },
  { route: 'ProteinCalc', icon: 'restaurant', title: 'Protein', desc: 'Daily protein target by bodyweight & training' },
  { route: 'CalorieCalc', icon: 'local-fire-department', title: 'Calories', desc: 'BMR & maintenance calories from activity' },
];

export default function UtilitiesScreen() {
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeCalcStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.screen}>
      <IronHeader title="GYMCOM" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1200} distance={20} stagger={0.045}>
            UTILITIES
          </ScrollFloat>
          <Text style={styles.pageSub}>TRAINING & NUTRITION CALCULATORS</Text>
        </View>

        {CALCULATORS.map((calc) => (
          <TouchableOpacity
            key={calc.route}
            style={styles.hubCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(calc.route)}
          >
            <View style={styles.hubIconWrap}>
              <MaterialIcons name={calc.icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.hubTextWrap}>
              <Text style={styles.hubTitle}>{calc.title}</Text>
              <Text style={styles.hubDesc}>{calc.desc}</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
