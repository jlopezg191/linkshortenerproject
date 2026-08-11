import {
	pgTable,
	bigserial,
	varchar,
	text,
	timestamp,
	boolean,
	integer,
	jsonb,
} from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
	id: bigserial('id', { mode: 'number' }).primaryKey(),
	short_code: varchar('short_code', { length: 64 }).notNull(),
	url: text('url').notNull(),
	clerk_user_id: varchar('clerk_user_id', { length: 255 }),
	created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
	expires_at: timestamp('expires_at', { withTimezone: true }),
	is_active: boolean('is_active').notNull().default(true),
	clicks: integer('clicks').notNull().default(0),
	meta: jsonb('meta'),
});

export type Link = typeof links;

