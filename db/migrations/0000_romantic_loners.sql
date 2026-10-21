CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`note` text,
	`links` text,
	`submitted_at` text NOT NULL
);
