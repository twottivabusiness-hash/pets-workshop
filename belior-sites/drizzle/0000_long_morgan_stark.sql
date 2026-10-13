CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`instruction` text NOT NULL,
	`department` text NOT NULL,
	`assignee` text NOT NULL,
	`kind` text NOT NULL,
	`status` text DEFAULT 'working' NOT NULL,
	`result` text DEFAULT '' NOT NULL,
	`tool_log` text DEFAULT '[]' NOT NULL,
	`approval_required` integer DEFAULT false NOT NULL,
	`approved_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
