ALTER TABLE `bookings` ADD `depositPaid` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `platformFee` decimal(10,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `bookings` ADD `charityFee` decimal(10,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `orders` ADD `platformFee` decimal(10,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `orders` ADD `charityFee` decimal(10,2) DEFAULT '0.00';