import { 
  users, stakingPools, stakes, proposals, submissions, airdrops,
  type User, type InsertUser,
  type StakingPool, type InsertPool,
  type Stake, type InsertStake,
  type Proposal, type InsertProposal,
  type Submission, type InsertSubmission,
  type Airdrop
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByAddress(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Staking
  getPools(): Promise<StakingPool[]>;
  createPool(pool: InsertPool): Promise<StakingPool>;
  createStake(stake: InsertStake): Promise<Stake>;
  getUserStakes(userId: number): Promise<Stake[]>;
  
  // Governance
  getProposals(): Promise<Proposal[]>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  voteProposal(id: number, support: boolean): Promise<Proposal | undefined>;
  
  // Meme Contest
  getSubmissions(): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  
  // Airdrop
  getAirdrops(): Promise<Airdrop[]>;
  createAirdrop(airdrop: Airdrop): Promise<Airdrop>; // Airdrop usually created by seed/admin
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByAddress(address: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, address));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPools(): Promise<StakingPool[]> {
    return await db.select().from(stakingPools).orderBy(desc(stakingPools.id));
  }

  async createPool(pool: InsertPool): Promise<StakingPool> {
    const [newPool] = await db.insert(stakingPools).values(pool).returning();
    return newPool;
  }

  async createStake(stake: InsertStake): Promise<Stake> {
    const [newStake] = await db.insert(stakes).values(stake).returning();
    return newStake;
  }

  async getUserStakes(userId: number): Promise<Stake[]> {
    return await db.select().from(stakes).where(eq(stakes.userId, userId));
  }

  async getProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals).orderBy(desc(proposals.endTime));
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const [newProposal] = await db.insert(proposals).values(proposal).returning();
    return newProposal;
  }

  async voteProposal(id: number, support: boolean): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    if (!proposal) return undefined;

    const [updated] = await db.update(proposals)
      .set({
        votesFor: support ? (proposal.votesFor || 0) + 1 : proposal.votesFor,
        votesAgainst: !support ? (proposal.votesAgainst || 0) + 1 : proposal.votesAgainst
      })
      .where(eq(proposals.id, id))
      .returning();
    return updated;
  }

  async getSubmissions(): Promise<Submission[]> {
    return await db.select().from(submissions).orderBy(desc(submissions.votes));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async getAirdrops(): Promise<Airdrop[]> {
    return await db.select().from(airdrops);
  }

  async createAirdrop(airdrop: Airdrop): Promise<Airdrop> {
    const [newAirdrop] = await db.insert(airdrops).values(airdrop).returning();
    return newAirdrop;
  }
}

export const storage = new DatabaseStorage();
