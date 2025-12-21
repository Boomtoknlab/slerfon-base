import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Users
  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUserByAddress(req.params.address);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  });

  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Staking
  app.get(api.staking.pools.path, async (req, res) => {
    const pools = await storage.getPools();
    res.json(pools);
  });

  app.post(api.staking.stake.path, async (req, res) => {
    try {
      const input = api.staking.stake.input.parse(req.body);
      const stake = await storage.createStake(input);
      res.status(201).json(stake);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.staking.userStakes.path, async (req, res) => {
    const stakes = await storage.getUserStakes(Number(req.params.userId));
    res.json(stakes);
  });

  // Governance
  app.get(api.governance.list.path, async (req, res) => {
    const proposals = await storage.getProposals();
    res.json(proposals);
  });

  app.post(api.governance.create.path, async (req, res) => {
    try {
      const input = api.governance.create.input.parse(req.body);
      const proposal = await storage.createProposal(input);
      res.status(201).json(proposal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.governance.vote.path, async (req, res) => {
    const { support } = req.body;
    const proposal = await storage.voteProposal(Number(req.params.id), support);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    res.json(proposal);
  });

  // Meme Contest
  app.get(api.memeContest.list.path, async (req, res) => {
    const submissions = await storage.getSubmissions();
    res.json(submissions);
  });

  app.post(api.memeContest.submit.path, async (req, res) => {
    try {
      const input = api.memeContest.submit.input.parse(req.body);
      const submission = await storage.createSubmission(input);
      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Airdrop
  app.get(api.airdrop.list.path, async (req, res) => {
    const airdrops = await storage.getAirdrops();
    res.json(airdrops);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const pools = await storage.getPools();
  if (pools.length === 0) {
    await storage.createPool({ 
      name: "Slerf Maximizer", 
      apy: "420.69", 
      minStake: "1000", 
      lockPeriodDays: 30 
    });
    await storage.createPool({ 
      name: "Slow & Steady", 
      apy: "69.42", 
      minStake: "100", 
      lockPeriodDays: 7 
    });
  }

  const proposals = await storage.getProposals();
  if (proposals.length === 0) {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    await storage.createProposal({
      title: "Burn 50% of Treasury",
      description: "Should we burn half of the treasury to boost scarcity? This aligns with our deflationary goals.",
      endTime: nextWeek,
    });
    await storage.createProposal({
      title: "Listing on New Exchange",
      description: "Vote to prioritize listing on BaseSwap or Aerodrome.",
      endTime: nextWeek,
    });
  }

  const airdrops = await storage.getAirdrops();
  if (airdrops.length === 0) {
    // Note: 'createAirdrop' in schema has 'status' as optional string, 'totalAmount' as decimal string
    // casting any to satisfy typescript if types mismatch slightly (though they should match)
    await storage.createAirdrop({
      name: "Early Adopter Drop",
      totalAmount: "1000000",
      description: "Rewards for early Slerf holders on Base.",
      status: "active"
    } as any);
  }
}
