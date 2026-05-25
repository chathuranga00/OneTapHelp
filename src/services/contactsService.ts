import type { ContactRelation } from '../constants/relations';
import type { EmergencyContact } from '../store';
import { supabase } from './supabase';

export type EmergencyContactInput = {
  id?: string;
  name: string;
  phone: string;
  relation: ContactRelation;
};

function mapRow(row: {
  id: string;
  name: string;
  phone: string;
  relation: string | null;
}): EmergencyContact {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    relation: (row.relation as ContactRelation) ?? 'Other',
  };
}

export async function fetchEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('id, name, phone, relation')
    .eq('user_id', userId)
    .order('priority_order', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function hasEmergencyContacts(userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('emergency_contacts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function saveEmergencyContacts(
  userId: string,
  contacts: EmergencyContactInput[],
): Promise<EmergencyContact[]> {
  const { error: deleteError } = await supabase
    .from('emergency_contacts')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  if (contacts.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert(
      contacts.map((contact, index) => ({
        user_id: userId,
        name: contact.name.trim(),
        phone: contact.phone.trim(),
        relation: contact.relation,
        priority_order: index,
      })),
    )
    .select('id, name, phone, relation');

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
