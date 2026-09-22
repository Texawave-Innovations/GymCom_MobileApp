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
  type UnitSystem,
} from './shared';

// Mirrors bmi_vc.swift: BMI = weight(kg) / (height(cm) * 0.01)^2
// Bands: <16 Severely underweight · <18.5 Underweight · <25 Normal · <30 Overweight · else Obese
function getBmiCategory(bmi: number, colors: ReturnType<typeof useThemeMode>['colors']) {
  if (bmi < 16) return { text: 'SEVERELY UNDERWEIGHT', color: '#4FACFE' };
  if (bmi < 18.5) return { text: 'UNDERWEIGHT', color: '#4FACFE' };
  if (bmi < 25) return { text: 'NORMAL', color: '#7cb87c' };
  if (bmi < 30) return { text: 'OVERWEIGHT', color: colors.primary };
  return { text: 'OBESE', color: colors.error };
}

export default function BmiScreen() {
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeCalcStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const weightUnitLabel = unitSystem === 'metric' ? 'KG' : 'LBS';

  const handleUnitSystemChange = (next: UnitSystem) => {
    if (next === unitSystem) return;
    setWeight((prev) => convertWeightField(prev, unitSystem, next));
    setUnitSystem(next);
  };

  const bmi = useMemo(() => {
    if (!hasCalculated || !isValid(weight, height)) return null;
    const w = toKg(toNumber(weight), unitSystem);
    const h = toNumber(height) / 100;
    return parseFloat((w / (h * h)).toFixed(2));
  }, [hasCalculated, weight, height, unitSystem]);

  const calculate = () => {
    if (!isValid(weight, height)) return;
    setHasCalculated(true);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <IronHeader title="BMI" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1200} distance={20} stagger={0.045}>
            BMI CALCULATOR
          </ScrollFloat>
          <Text style={styles.pageSub}>BODY MASS INDEX FROM HEIGHT & WEIGHT</Text>
        </View>

        <UnitGenderRow unitSystem={unitSystem} onUnitChange={handleUnitSystemChange} showGender={false} styles={styles} />

        <Card icon="monitor-weight" title="BMI CALCULATOR" colors={colors} styles={styles}>
          <Field label="WEIGHT" value={weight} onChangeText={setWeight} suffix={weightUnitLabel} colors={colors} styles={styles} />
          <HeightInput height={height} onChangeHeight={setHeight} unitSystem={unitSystem} colors={colors} styles={styles} />
          <TouchableOpacity style={styles.calcBtn} onPress={calculate} activeOpacity={0.85}>
            <Text style={styles.calcBtnText}>CALCULATE BMI</Text>
            <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
          </TouchableOpacity>
          {bmi !== null && (
            <ResultRow
              value={String(bmi)}
              label="BODY MASS INDEX"
              sub={getBmiCategory(bmi, colors).text}
              color={getBmiCategory(bmi, colors).color}
              styles={styles}
            />
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
