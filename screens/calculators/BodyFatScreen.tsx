import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../../components/IronHeader';
import ScrollFloat from '../../components/ScrollFloat';
import { useThemeMode } from '../../hooks/useThemeMode';
import {
  Card,
  Field,
  HeightInput,
  ResultRow,
  UnitGenderRow,
  convertWeightField,
  isValid,
  makeCalcStyles,
  toKg,
  toNumber,
  type Gender,
  type ThemeColors,
  type UnitSystem,
} from './shared';

// Mirrors fat_vc.swift (Deurenberg, BMI-based):
//   body fat % = (1.20 x BMI) + (0.23 x age) - 16.2  (male)
//   body fat % = (1.20 x BMI) + (0.23 x age) - 5.4   (female)
// Status is rated by age band, thresholds lifted verbatim from the Swift.
type Band = { under: number; healthyMax: number; overweightMax: number };

const MALE_BANDS: Record<string, Band> = {
  '20-40': { under: 8, healthyMax: 19, overweightMax: 25 },
  '40-60': { under: 11, healthyMax: 21, overweightMax: 28 },
  '60-80': { under: 13, healthyMax: 25, overweightMax: 30 },
};

const FEMALE_BANDS: Record<string, Band> = {
  '20-40': { under: 21, healthyMax: 33, overweightMax: 39 },
  '40-60': { under: 23, healthyMax: 35, overweightMax: 40 },
  '60-80': { under: 24, healthyMax: 35, overweightMax: 42 },
};

function bandKey(age: number): string | null {
  if (age >= 20 && age < 40) return '20-40';
  if (age >= 40 && age < 60) return '40-60';
  if (age >= 60 && age < 80) return '60-80';
  return null;
}

function getFatStatus(fat: number, age: number, gender: Gender, colors: ThemeColors) {
  const key = bandKey(age);
  if (!key) return { text: 'ENTER AGE 20-79 FOR A RATING', color: colors.onSurfaceVariant };
  const band = (gender === 'MALE' ? MALE_BANDS : FEMALE_BANDS)[key];
  if (fat < band.under) return { text: 'UNDER WEIGHT', color: '#4FACFE' };
  if (fat < band.healthyMax) return { text: 'HEALTHY', color: '#7cb87c' };
  if (fat < band.overweightMax) return { text: 'OVERWEIGHT', color: colors.primary };
  return { text: 'OBESE', color: colors.error };
}

export default function BodyFatScreen() {
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeCalcStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('MALE');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const weightUnitLabel = unitSystem === 'metric' ? 'KG' : 'LBS';

  const handleUnitSystemChange = (next: UnitSystem) => {
    if (next === unitSystem) return;
    setWeight((prev) => convertWeightField(prev, unitSystem, next));
    setUnitSystem(next);
  };

  const fat = useMemo(() => {
    if (!hasCalculated || !isValid(weight, height, age)) return null;
    const w = toKg(toNumber(weight), unitSystem);
    const h = toNumber(height) / 100;
    const bmi = w / (h * h);
    const a = toNumber(age);
    const offset = gender === 'MALE' ? 16.2 : 5.4;
    const result = 1.2 * bmi + 0.23 * a - offset;
    return parseFloat(result.toFixed(2));
  }, [hasCalculated, weight, height, age, unitSystem, gender]);

  const calculate = () => {
    if (!isValid(weight, height, age)) return;
    setHasCalculated(true);
  };

  const status = fat !== null ? getFatStatus(fat, toNumber(age), gender, colors) : null;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <IronHeader title="BODY FAT" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1200} distance={20} stagger={0.045}>
            BODY FAT %
          </ScrollFloat>
          <Text style={styles.pageSub}>ESTIMATED BODY FAT FROM BMI, AGE & SEX</Text>
        </View>

        <UnitGenderRow
          unitSystem={unitSystem}
          onUnitChange={handleUnitSystemChange}
          gender={gender}
          onGenderChange={setGender}
          styles={styles}
        />

        <Card icon="pie-chart" title="BODY FAT CALCULATOR" colors={colors} styles={styles}>
          <View style={styles.fieldRow}>
            <Field label="WEIGHT" value={weight} onChangeText={setWeight} suffix={weightUnitLabel} colors={colors} styles={styles} />
            <Field label="AGE" value={age} onChangeText={setAge} suffix="YRS" colors={colors} styles={styles} />
          </View>
          <HeightInput height={height} onChangeHeight={setHeight} unitSystem={unitSystem} colors={colors} styles={styles} />
          <TouchableOpacity style={styles.calcBtn} onPress={calculate} activeOpacity={0.85}>
            <Text style={styles.calcBtnText}>CALCULATE BODY FAT</Text>
            <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
          </TouchableOpacity>
          {fat !== null && status && (
            <ResultRow value={`${fat}%`} label="ESTIMATED BODY FAT" sub={status.text} color={status.color} styles={styles} />
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
