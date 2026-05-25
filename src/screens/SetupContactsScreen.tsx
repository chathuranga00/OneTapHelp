import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Menu, Text, TextInput } from 'react-native-paper';

import { ScreenLayout } from '../components';
import { colors, config, strings } from '../constants';
import { contactRelations, DEFAULT_RELATION, type ContactRelation } from '../constants/relations';
import type { RootStackParamList } from '../navigation';
import { fetchEmergencyContacts, saveEmergencyContacts } from '../services';
import { useAppStore, type EmergencyContact } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'SetupContacts'>;

function createLocalId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function SetupContactsScreen({ navigation }: Props) {
  const session = useAppStore((s) => s.session);
  const setEmergencyContacts = useAppStore((s) => s.setEmergencyContacts);

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState<ContactRelation>(DEFAULT_RELATION);
  const [relationMenuOpen, setRelationMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    if (!session?.user.id) return;
    setLoading(true);
    try {
      const remote = await fetchEmergencyContacts(session.user.id);
      setContacts(remote);
      setEmergencyContacts(remote);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [session?.user.id, setEmergencyContacts]);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setRelation(DEFAULT_RELATION);
    setEditingId(null);
  };

  const handleAddOrUpdate = () => {
    if (!name.trim() || !phone.trim()) return;

    if (editingId) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, name: name.trim(), phone: phone.trim(), relation }
            : c,
        ),
      );
      resetForm();
      return;
    }

    if (contacts.length >= config.maxEmergencyContacts) return;

    const contact: EmergencyContact = {
      id: createLocalId(),
      name: name.trim(),
      phone: phone.trim(),
      relation,
    };
    setContacts((prev) => [...prev, contact]);
    resetForm();
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelation(contact.relation);
  };

  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) resetForm();
  };

  const handleSaveAndContinue = async () => {
    if (!session?.user.id) {
      setError('You must be signed in to save contacts.');
      return;
    }
    if (contacts.length === 0) return;

    setError(null);
    setSaving(true);
    try {
      const saved = await saveEmergencyContacts(
        session.user.id,
        contacts.map((c) => ({
          name: c.name,
          phone: c.phone,
          relation: c.relation,
        })),
      );
      setEmergencyContacts(saved);
      navigation.replace('Home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save contacts');
    } finally {
      setSaving(false);
    }
  };

  const atMax = contacts.length >= config.maxEmergencyContacts;
  const canSubmitForm = name.trim().length > 0 && phone.trim().length > 0;

  return (
    <ScreenLayout
      title={strings.setupContacts.title}
      subtitle={strings.setupContacts.subtitle}
      footer={
        <Button
          mode="contained"
          onPress={handleSaveAndContinue}
          loading={saving}
          disabled={saving || contacts.length === 0 || loading}
          buttonColor={colors.primary}
          textColor={colors.text}
          style={styles.saveButton}
        >
          {strings.setupContacts.saveContinue}
        </Button>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.form}>
          <TextInput
            label={strings.setupContacts.name}
            value={name}
            onChangeText={setName}
            mode="outlined"
            disabled={saving || (!editingId && atMax)}
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
          />
          <TextInput
            label={strings.setupContacts.phone}
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            disabled={saving || (!editingId && atMax)}
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
          />

          <Menu
            visible={relationMenuOpen}
            onDismiss={() => setRelationMenuOpen(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setRelationMenuOpen(true)}
                disabled={saving || (!editingId && atMax)}
                textColor={colors.text}
                style={styles.relationButton}
              >
                {strings.setupContacts.relation}: {relation}
              </Button>
            }
            contentStyle={styles.menu}
          >
            {contactRelations.map((option) => (
              <Menu.Item
                key={option}
                onPress={() => {
                  setRelation(option);
                  setRelationMenuOpen(false);
                }}
                title={option}
                titleStyle={styles.menuItem}
              />
            ))}
          </Menu>

          <Button
            mode="outlined"
            onPress={handleAddOrUpdate}
            disabled={!canSubmitForm || saving || (!editingId && atMax)}
            textColor={colors.primary}
            style={styles.addButton}
          >
            {editingId ? strings.setupContacts.updateContact : strings.setupContacts.addContact}
          </Button>

          {editingId ? (
            <Button mode="text" onPress={resetForm} textColor={colors.textSecondary}>
              Cancel edit
            </Button>
          ) : null}

          {atMax && !editingId ? (
            <Text style={styles.hint}>{strings.setupContacts.maxReached}</Text>
          ) : null}
        </View>

        <Text style={styles.count}>
          {contacts.length} / {config.maxEmergencyContacts} contacts
        </Text>

        {contacts.length === 0 ? (
          <Text style={styles.empty}>{strings.setupContacts.emptyList}</Text>
        ) : (
          contacts.map((contact, index) => (
            <View key={contact.id} style={styles.contactRow}>
              <View style={styles.contactNumber}>
                <Text style={styles.contactNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactDetail}>{contact.phone}</Text>
                <Chip compact style={styles.relationChip} textStyle={styles.relationChipText}>
                  {contact.relation}
                </Chip>
              </View>
              <View style={styles.contactActions}>
                <IconButton
                  icon="pencil"
                  iconColor={colors.textSecondary}
                  size={20}
                  onPress={() => handleEdit(contact)}
                  disabled={saving}
                />
                <IconButton
                  icon="delete"
                  iconColor={colors.primary}
                  size={20}
                  onPress={() => handleDelete(contact.id)}
                  disabled={saving}
                />
              </View>
            </View>
          ))
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
  },
  form: {
    marginTop: 8,
    gap: 10,
  },
  input: {
    backgroundColor: colors.surface,
  },
  relationButton: {
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  menu: {
    backgroundColor: colors.surface,
  },
  menuItem: {
    color: colors.text,
  },
  addButton: {
    borderColor: colors.primary,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
  },
  count: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 12,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  contactNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactNumberText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  contactDetail: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  relationChip: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: colors.surfaceElevated,
  },
  relationChipText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    borderRadius: 4,
    minHeight: 48,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
});
