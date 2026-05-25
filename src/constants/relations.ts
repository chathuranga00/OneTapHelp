export const contactRelations = ['Family', 'Friend', 'Doctor', 'Other'] as const;

export type ContactRelation = (typeof contactRelations)[number];

export const DEFAULT_RELATION: ContactRelation = 'Family';
