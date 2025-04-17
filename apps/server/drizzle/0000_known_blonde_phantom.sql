CREATE TABLE `users` (
	`address` text PRIMARY KEY NOT NULL,
	`first_auth` integer NOT NULL,
	`last_auth` integer NOT NULL,
	`auth_count` integer DEFAULT 1 NOT NULL
);
