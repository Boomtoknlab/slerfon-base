import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users (identified by wallet address)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  isAdmin: boolean("is_admin").default(false),
});

// Staking Pools
export const stakingPools = pgTable("staking_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  apy: decimal("apy").notNull(), // stored as string percentage e.g. "12.5"
  minStake: decimal("min_stake").notNull(),
  lockPeriodDays: integer("lock_period_days").notNull(),
  totalStaked: decimal("total_staked").default("0"),
});

// User Stakes
export const stakes = pgTable("stakes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  poolId: integer("pool_id").notNull(),
  amount: decimal("amount").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  status: text("status").notNull().default("active"), // active, unstaked
});

// Governance Proposals
export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  votesFor: integer("votes_for").default(0),
  votesAgainst: integer("votes_against").default(0),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("active"), // active, passed, rejected
});

// Meme Contest Submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  votes: integer("votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Airdrop Campaigns
export const airdrops = pgTable("airdrops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  totalAmount: decimal("total_amount").notNull(),
  description: text("description"),
  status: text("status").default("active"),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPoolSchema = createInsertSchema(stakingPools).omit({ id: true, totalStaked: true });
export const insertStakeSchema = createInsertSchema(stakes).omit({ id: true, startTime: true, status: true });
export const insertProposalSchema = createInsertSchema(proposals).omit({ id: true, votesFor: true, votesAgainst: true, status: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, votes: true, createdAt: true });
export const insertAirdropSchema = createInsertSchema(airdrops).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type StakingPool = typeof stakingPools.$inferSelect;
export type InsertPool = z.infer<typeof insertPoolSchema>;
export type Stake = typeof stakes.$inferSelect;
export type InsertStake = z.infer<typeof insertStakeSchema>;
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Airdrop = typeof airdrops.$inferSelect;

export type CreateStakeRequest = InsertStake;
export type CreateProposalRequest = InsertProposal;
export type CreateSubmissionRequest = InsertSubmission;
