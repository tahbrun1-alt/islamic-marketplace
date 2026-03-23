-- Follow system: users following shops
CREATE TABLE `follows` (
  `id` int AUTO_INCREMENT NOT NULL,
  `followerId` int NOT NULL,
  `shopId` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `follows_id` PRIMARY KEY(`id`),
  CONSTRAINT `follows_follower_shop_unique` UNIQUE(`followerId`, `shopId`)
);--> statement-breakpoint

-- Add followerCount to shops for fast reads
ALTER TABLE `shops` ADD `followerCount` int NOT NULL DEFAULT 0;--> statement-breakpoint

-- Add video support to reviews
ALTER TABLE `reviews` ADD `videos` json;
