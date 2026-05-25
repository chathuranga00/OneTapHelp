import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { CountryCodePicker, getDefaultCountry, ScreenLayout } from '../components';
import { colors, strings, type CountryCode } from '../constants';
import type { RootStackParamList } from '../navigation';
import {
  fetchEmergencyContacts,
  formatPhoneE164,
  getAuthErrorMessage,
  hasEmergencyContacts,
  isSupabaseConfigured,
  sendPhoneOtp,
  verifyPhoneOtp,
} from '../services';
import { useAppStore } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export function AuthScreen({ navigation }: Props) {
  const [country, setCountry] = useState<CountryCode>(getDefaultCountry);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const setSession = useAppStore((s) => s.setSession);
  const setEmergencyContacts = useAppStore((s) => s.setEmergencyContacts);
  const localContactCount = useAppStore((s) => s.emergencyContacts.length);

  const phoneE164 = useMemo(
    () => (phone.trim() ? formatPhoneE164(country.dial, phone) : ''),
    [country.dial, phone],
  );

  const phoneValid = phone.replace(/\D/g, '').length >= 9;
  const otpValid = /^\d{6}$/.test(otp);

  const handleSendOtp = async () => {
    setError(null);
    setSuccess(null);
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add keys to .env and restart npm run dev.');
      return;
    }
    setSendingOtp(true);
    try {
      await sendPhoneOtp(phoneE164);
      setOtpSent(true);
      setOtp('');
      setSuccess(`OTP sent to ${phoneE164}. Check your SMS messages.`);
    } catch (e) {
      setError(getAuthErrorMessage(e, 'send'));
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setSuccess(null);
    setVerifyingOtp(true);
    try {
      const { session } = await verifyPhoneOtp(phoneE164, otp);
      if (!session) {
        setError('Verification succeeded but no session was returned. Try again.');
        return;
      }

      setSession(session);

      const userId = session.user.id;
      const hasRemoteContacts = await hasEmergencyContacts(userId);

      if (!hasRemoteContacts && localContactCount === 0) {
        navigation.replace('SetupContacts');
        return;
      }

      if (hasRemoteContacts) {
        const contacts = await fetchEmergencyContacts(userId);
        setEmergencyContacts(contacts);
      }

      navigation.replace('Home');
    } catch (e) {
      setError(getAuthErrorMessage(e, 'verify'));
    } finally {
      setVerifyingOtp(false);
    }
  };

  const busy = sendingOtp || verifyingOtp;

  return (
    <ScreenLayout title={strings.auth.title} subtitle={strings.auth.subtitle}>
      <View style={styles.form}>
        <View style={styles.phoneRow}>
          <CountryCodePicker value={country} onChange={setCountry} disabled={busy} />
          <TextInput
            label={strings.auth.phone}
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setError(null);
              setSuccess(null);
            }}
            mode="outlined"
            keyboardType="phone-pad"
            disabled={busy || (otpSent && verifyingOtp)}
            style={styles.phoneInput}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholder="771234567"
          />
        </View>

        {phoneValid ? (
          <Text style={styles.phonePreview}>Sending to {phoneE164}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSendOtp}
          loading={sendingOtp}
          disabled={busy || !phoneValid}
          buttonColor={colors.primary}
          textColor={colors.text}
          style={styles.button}
        >
          {strings.auth.sendOtp}
        </Button>

        {otpSent ? (
          <View style={styles.otpSection}>
            <Text style={styles.otpHint}>
              {strings.auth.otpSent} ({phoneE164})
            </Text>
            <TextInput
              label={strings.auth.otp}
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))}
              mode="outlined"
              keyboardType="number-pad"
              maxLength={6}
              disabled={busy}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              placeholder="000000"
            />
            <Button
              mode="contained"
              onPress={handleVerifyOtp}
              loading={verifyingOtp}
              disabled={busy || !otpValid}
              buttonColor={colors.primary}
              textColor={colors.text}
              style={styles.button}
            >
              {strings.auth.verifyOtp}
            </Button>
            <Button
              mode="text"
              onPress={handleSendOtp}
              loading={sendingOtp}
              disabled={busy || !phoneValid}
              textColor={colors.textSecondary}
            >
              {strings.auth.resendOtp}
            </Button>
          </View>
        ) : null}

        {success ? <Text style={styles.success}>{success}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!isSupabaseConfigured ? (
          <Text style={styles.error}>
            Missing Supabase URL or anon key in .env — restart the dev server after adding them.
          </Text>
        ) : null}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 24,
    gap: 12,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  phonePreview: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.surface,
  },
  button: {
    borderRadius: 4,
    minHeight: 48,
  },
  otpSection: {
    marginTop: 8,
    gap: 12,
  },
  otpHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  success: {
    color: colors.success,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
