import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // ─── Milestones ─────────────────────────────────────────────────────────────
  const milestonesData = [
    {
      title: "Profile Live",
      description: "Optimized your freelancer profile and set up your initial offering.",
      day: 4,
      xpReward: 100,
      icon: "UserCircle",
    },
    {
      title: "Portfolio Proof",
      description: "Created your first compelling piece of proof of work.",
      day: 9,
      xpReward: 200,
      icon: "Briefcase",
    },
    {
      title: "Outreach Mode",
      description: "Started sending targeted proposals and cold messages.",
      day: 14,
      xpReward: 300,
      icon: "Send",
    },
    {
      title: "First Call",
      description: "Booked your first discovery call with a potential client.",
      day: 21,
      xpReward: 500,
      icon: "Video",
    },
    {
      title: "First Client",
      description: "Closed the deal and landed your first paying client.",
      day: 30,
      xpReward: 1000,
      icon: "Trophy",
    },
  ];

  for (const ms of milestonesData) {
    await prisma.milestone.upsert({
      where: { id: `ms_${ms.day}` },
      update: ms,
      create: { ...ms, id: `ms_${ms.day}` },
    });
  }
  console.log("✅ Milestones seeded");

  // ─── Tools ──────────────────────────────────────────────────────────────────
  const toolsData = [
    {
      id: "tool_notion",
      name: "Notion",
      category: "Productivity",
      description: "The all-in-one workspace for your freelance business.",
      url: "https://notion.so",
      skills: ["All"],
      pricing: "Freemium",
      isFeatured: true,
    },
    {
      id: "tool_canva",
      name: "Canva",
      category: "Portfolio",
      description: "Create stunning visuals and portfolio decks in minutes.",
      url: "https://canva.com",
      skills: ["Graphic Design", "Social Media", "All"],
      pricing: "Freemium",
    },
    {
      id: "tool_upwork",
      name: "Upwork",
      category: "Outreach",
      description: "The largest global freelancing platform.",
      url: "https://upwork.com",
      skills: ["All"],
      pricing: "Free to join",
    },
    {
      id: "tool_loom",
      name: "Loom",
      category: "Proposals",
      description: "Record video pitches to stand out from the competition.",
      url: "https://loom.com",
      skills: ["Video Editing", "All"],
      pricing: "Freemium",
      isFeatured: true,
    },
    {
      id: "tool_apollo",
      name: "Apollo.io",
      category: "Outreach",
      description: "Find email addresses and automate cold outreach.",
      url: "https://apollo.io",
      skills: ["Copywriting", "Web Development"],
      pricing: "Freemium",
    },
    {
      id: "tool_chatgpt",
      name: "ChatGPT",
      category: "AI Tools",
      description: "Draft proposals, brainstorm ideas, and overcome blocks.",
      url: "https://chat.openai.com",
      skills: ["All"],
      pricing: "Freemium",
    },
    {
      id: "tool_framer",
      name: "Framer",
      category: "Portfolio",
      description: "Build a beautiful portfolio website visually.",
      url: "https://framer.com",
      skills: ["Web Development", "UI/UX Design"],
      pricing: "Freemium",
    },
    {
      id: "tool_cal",
      name: "Cal.com",
      category: "Productivity",
      description: "Open-source scheduling for booking client calls.",
      url: "https://cal.com",
      skills: ["All"],
      pricing: "Freemium",
    },
  ];

  for (const tool of toolsData) {
    await prisma.tool.upsert({
      where: { id: tool.id },
      update: tool,
      create: tool,
    });
  }
  console.log("✅ Tools seeded");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
