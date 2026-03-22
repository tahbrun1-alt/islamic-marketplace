CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`label` varchar(64) DEFAULT 'Home',
	`fullName` text NOT NULL,
	`line1` text NOT NULL,
	`line2` text,
	`city` text NOT NULL,
	`state` text,
	`postcode` varchar(20),
	`country` varchar(64) NOT NULL,
	`phone` varchar(30),
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingNumber` varchar(32) NOT NULL,
	`serviceId` int NOT NULL,
	`clientId` int NOT NULL,
	`providerId` int NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled','no_show','refunded') NOT NULL DEFAULT 'pending',
	`scheduledAt` timestamp NOT NULL,
	`duration` int NOT NULL,
	`packageId` varchar(64),
	`addons` json,
	`locationType` enum('online','in_person','at_client','at_provider') NOT NULL DEFAULT 'in_person',
	`address` text,
	`meetingLink` text,
	`totalAmount` decimal(10,2) NOT NULL,
	`depositAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`commissionAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`currency` varchar(8) NOT NULL DEFAULT 'GBP',
	`notes` text,
	`stripePaymentIntentId` varchar(128),
	`payoutStatus` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
	`isRecurring` boolean NOT NULL DEFAULT false,
	`recurringPattern` json,
	`reminderSent` boolean NOT NULL DEFAULT false,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_bookingNumber_unique` UNIQUE(`bookingNumber`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentId` int,
	`type` enum('product','service') NOT NULL,
	`name` varchar(128) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`icon` text,
	`image` text,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('buyer_seller','buyer_provider','support') NOT NULL DEFAULT 'buyer_seller',
	`participant1Id` int NOT NULL,
	`participant2Id` int NOT NULL,
	`productId` int,
	`serviceId` int,
	`orderId` int,
	`bookingId` int,
	`lastMessageAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int,
	`code` varchar(64) NOT NULL,
	`type` enum('percentage','fixed') NOT NULL,
	`value` decimal(10,2) NOT NULL,
	`minOrderAmount` decimal(10,2),
	`maxUses` int,
	`usedCount` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` int NOT NULL,
	`body` text NOT NULL,
	`attachments` json,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(64) NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`data` json,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`title` text NOT NULL,
	`image` text,
	`price` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL,
	`variation` json,
	`digitalFileUrl` text,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(32) NOT NULL,
	`buyerId` int NOT NULL,
	`shopId` int NOT NULL,
	`status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`subtotal` decimal(10,2) NOT NULL,
	`shippingCost` decimal(10,2) NOT NULL DEFAULT '0.00',
	`discountAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`commissionAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`total` decimal(10,2) NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'GBP',
	`couponCode` varchar(64),
	`shippingAddress` json,
	`shippingMethod` text,
	`trackingNumber` text,
	`notes` text,
	`stripePaymentIntentId` varchar(128),
	`payoutStatus` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
	`payoutAmount` decimal(10,2),
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'GBP',
	`status` enum('pending','processing','paid','failed') NOT NULL DEFAULT 'pending',
	`stripeTransferId` varchar(128),
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`orderIds` json,
	`bookingIds` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`paidAt` timestamp,
	CONSTRAINT `payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(128) NOT NULL,
	`value` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platformSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `platformSettings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int NOT NULL,
	`categoryId` int,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`comparePrice` decimal(10,2),
	`currency` varchar(8) NOT NULL DEFAULT 'GBP',
	`images` json,
	`videos` json,
	`tags` json,
	`type` enum('physical','digital') NOT NULL DEFAULT 'physical',
	`digitalFileUrl` text,
	`inventory` int NOT NULL DEFAULT 0,
	`trackInventory` boolean NOT NULL DEFAULT true,
	`variations` json,
	`shippingWeight` decimal(8,3),
	`shippingOptions` json,
	`processingTime` varchar(64),
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isPromoted` boolean NOT NULL DEFAULT false,
	`isHalal` boolean NOT NULL DEFAULT true,
	`occasion` json,
	`gender` enum('all','male','female','children') DEFAULT 'all',
	`rating` decimal(3,2) DEFAULT '0.00',
	`reviewCount` int NOT NULL DEFAULT 0,
	`salesCount` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('banner','featured_product','featured_service','featured_shop','seasonal') NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image` text,
	`linkUrl` text,
	`targetId` int,
	`targetType` varchar(32),
	`season` varchar(64),
	`isActive` boolean NOT NULL DEFAULT true,
	`startsAt` timestamp,
	`endsAt` timestamp,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promotions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`type` enum('product','service','shop','user','review','message') NOT NULL,
	`targetId` int NOT NULL,
	`reason` varchar(128) NOT NULL,
	`details` text,
	`status` enum('pending','reviewed','resolved','dismissed') NOT NULL DEFAULT 'pending',
	`resolvedBy` int,
	`resolution` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('product','service','shop') NOT NULL,
	`targetId` int NOT NULL,
	`authorId` int NOT NULL,
	`orderId` int,
	`bookingId` int,
	`rating` int NOT NULL,
	`title` varchar(256),
	`body` text,
	`images` json,
	`isVerifiedPurchase` boolean NOT NULL DEFAULT false,
	`isVisible` boolean NOT NULL DEFAULT true,
	`sellerReply` text,
	`sellerRepliedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`categoryId` int,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`depositAmount` decimal(10,2),
	`requireDeposit` boolean NOT NULL DEFAULT false,
	`currency` varchar(8) NOT NULL DEFAULT 'GBP',
	`duration` int NOT NULL,
	`images` json,
	`videos` json,
	`tags` json,
	`locationType` enum('online','in_person','at_client','at_provider') NOT NULL DEFAULT 'in_person',
	`address` text,
	`packages` json,
	`addons` json,
	`cancellationPolicy` text,
	`availability` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isPromoted` boolean NOT NULL DEFAULT false,
	`allowRecurring` boolean NOT NULL DEFAULT false,
	`rating` decimal(3,2) DEFAULT '0.00',
	`reviewCount` int NOT NULL DEFAULT 0,
	`bookingCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`logo` text,
	`banner` text,
	`description` text,
	`location` text,
	`phone` varchar(30),
	`email` varchar(320),
	`website` text,
	`instagram` text,
	`facebook` text,
	`tiktok` text,
	`businessHours` json,
	`isVerified` boolean NOT NULL DEFAULT false,
	`isHalalCertified` boolean NOT NULL DEFAULT false,
	`halalCertDoc` text,
	`policies` text,
	`status` enum('pending','active','suspended') NOT NULL DEFAULT 'pending',
	`trialEndsAt` timestamp,
	`stripeAccountId` varchar(128),
	`totalSales` int NOT NULL DEFAULT 0,
	`rating` decimal(3,2) DEFAULT '0.00',
	`reviewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shops_id` PRIMARY KEY(`id`),
	CONSTRAINT `shops_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int,
	`serviceId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(30);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `location` text;--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);