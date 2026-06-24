import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const DEMO_PASSWORD = "Password123!";
const DEMO_EMAILS = [
  "landlord@smartrent.demo",
  "tenant@smartrent.demo",
  "admin@smartrent.demo",
];

async function main() {
  loadEnvLocal();

  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    throw new Error(
      "Refusing to seed production. Set ALLOW_PRODUCTION_SEED=true only if you understand the risk.",
    );
  }

  const mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI.");
  }

  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    throw new Error('Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://".');
  }

  await mongoose.connect(mongoUri, { bufferCommands: false });

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection did not expose a database handle.");
  }

  const now = new Date();
  const users = db.collection("users");
  const properties = db.collection("properties");
  const tenancies = db.collection("tenancies");
  const issues = db.collection("issues");
  const evidences = db.collection("evidences");
  const conversations = db.collection("conversations");
  const messages = db.collection("messages");
  const disputes = db.collection("disputes");
  const notifications = db.collection("notifications");

  const existingDemoUsers = await users
    .find<{ _id: mongoose.Types.ObjectId }>({ email: { $in: DEMO_EMAILS } })
    .toArray();
  const demoUserIds = existingDemoUsers.map((user) => user._id.toString());

  if (demoUserIds.length > 0) {
    const demoProperties = await properties
      .find<{ _id: mongoose.Types.ObjectId }>({ landlordId: { $in: demoUserIds } })
      .toArray();
    const demoPropertyIds = demoProperties.map((property) => property._id.toString());
    const demoTenancies = await tenancies
      .find<{ _id: mongoose.Types.ObjectId }>({
        $or: [
          { landlordId: { $in: demoUserIds } },
          { tenantId: { $in: demoUserIds } },
          { tenantEmail: "tenant@smartrent.demo" },
        ],
      })
      .toArray();
    const demoTenancyIds = demoTenancies.map((tenancy) => tenancy._id.toString());
    const demoIssues = await issues
      .find<{ _id: mongoose.Types.ObjectId }>({
        $or: [
          { landlordId: { $in: demoUserIds } },
          { tenantId: { $in: demoUserIds } },
          { propertyId: { $in: demoPropertyIds } },
          { tenancyId: { $in: demoTenancyIds } },
        ],
      })
      .toArray();
    const demoIssueIds = demoIssues.map((issue) => issue._id.toString());

    await Promise.all([
      notifications.deleteMany({ userId: { $in: demoUserIds } }),
      messages.deleteMany({
        $or: [
          { senderId: { $in: demoUserIds } },
          { receiverId: { $in: demoUserIds } },
        ],
      }),
      conversations.deleteMany({ participants: { $in: demoUserIds } }),
      disputes.deleteMany({
        $or: [
          { landlordId: { $in: demoUserIds } },
          { tenantId: { $in: demoUserIds } },
          { issueId: { $in: demoIssueIds } },
        ],
      }),
      evidences.deleteMany({
        $or: [
          { uploadedBy: { $in: demoUserIds } },
          { issueId: { $in: demoIssueIds } },
        ],
      }),
      issues.deleteMany({ _id: { $in: demoIssues.map((issue) => issue._id) } }),
      tenancies.deleteMany({ _id: { $in: demoTenancies.map((tenancy) => tenancy._id) } }),
      properties.deleteMany({ _id: { $in: demoProperties.map((property) => property._id) } }),
      users.deleteMany({ email: { $in: DEMO_EMAILS } }),
    ]);
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const landlordId = new mongoose.Types.ObjectId();
  const tenantId = new mongoose.Types.ObjectId();
  const adminId = new mongoose.Types.ObjectId();

  await users.insertMany([
    {
      _id: landlordId,
      email: "landlord@smartrent.demo",
      firstName: "Laura",
      lastName: "Landlord",
      name: "Laura Landlord",
      passwordHash,
      role: "landlord",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: tenantId,
      email: "tenant@smartrent.demo",
      firstName: "Theo",
      lastName: "Tenant",
      name: "Theo Tenant",
      passwordHash,
      role: "tenant",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: adminId,
      email: "admin@smartrent.demo",
      firstName: "Ada",
      lastName: "Admin",
      name: "Ada Admin",
      passwordHash,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  const riversideId = new mongoose.Types.ObjectId();
  const canaryWharfId = new mongoose.Types.ObjectId();

  await properties.insertMany([
    {
      _id: riversideId,
      landlordId: landlordId.toString(),
      propertyName: "Riverside Apartment",
      address: "18 Thames Walk",
      city: "London",
      postcode: "E14 7DF",
      propertyType: "Apartment",
      status: "active",
      description: "Two-bedroom apartment overlooking the Thames.",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: canaryWharfId,
      landlordId: landlordId.toString(),
      propertyName: "Canary Wharf Studio",
      address: "42 Dock Street",
      city: "London",
      postcode: "E14 5AB",
      propertyType: "Studio",
      status: "maintenance",
      description: "Modern studio close to transport and business district.",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  const tenancyId = new mongoose.Types.ObjectId();

  await tenancies.insertOne({
    _id: tenancyId,
    propertyId: riversideId.toString(),
    landlordId: landlordId.toString(),
    tenantId: tenantId.toString(),
    tenantName: "Theo Tenant",
    tenantEmail: "tenant@smartrent.demo",
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-12-31T00:00:00.000Z"),
    rentAmount: 1850,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });

  const leakIssueId = new mongoose.Types.ObjectId();
  const heatingIssueId = new mongoose.Types.ObjectId();
  const applianceIssueId = new mongoose.Types.ObjectId();

  await issues.insertMany([
    {
      _id: leakIssueId,
      propertyId: riversideId.toString(),
      tenancyId: tenancyId.toString(),
      tenantId: tenantId.toString(),
      landlordId: landlordId.toString(),
      title: "Kitchen ceiling water leak",
      category: "Water Leak",
      description: "Water is dripping from the ceiling near the kitchen light fitting.",
      priority: "high",
      status: "open",
      createdAt: new Date("2026-06-20T09:30:00.000Z"),
      updatedAt: new Date("2026-06-20T09:30:00.000Z"),
    },
    {
      _id: heatingIssueId,
      propertyId: riversideId.toString(),
      tenancyId: tenancyId.toString(),
      tenantId: tenantId.toString(),
      landlordId: landlordId.toString(),
      title: "Heating not working",
      category: "Heating Failure",
      description: "Heating has stopped working in the living room and bedroom.",
      priority: "high",
      status: "in_progress",
      createdAt: new Date("2026-06-18T14:15:00.000Z"),
      updatedAt: new Date("2026-06-19T11:45:00.000Z"),
    },
    {
      _id: applianceIssueId,
      propertyId: riversideId.toString(),
      tenancyId: tenancyId.toString(),
      tenantId: tenantId.toString(),
      landlordId: landlordId.toString(),
      title: "Washing machine door fault",
      category: "Appliance Fault",
      description: "The washing machine door does not lock consistently.",
      priority: "medium",
      status: "awaiting_response",
      createdAt: new Date("2026-06-12T08:00:00.000Z"),
      updatedAt: new Date("2026-06-16T16:20:00.000Z"),
    },
  ]);

  await evidences.insertMany([
    {
      _id: new mongoose.Types.ObjectId(),
      uploadedBy: tenantId.toString(),
      issueId: leakIssueId.toString(),
      fileName: "water-leak-photo.jpg",
      fileUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      fileType: "image",
      cloudinaryPublicId: "smartrent/issues/demo-water-leak-photo",
      createdAt: new Date("2026-06-20T09:35:00.000Z"),
      updatedAt: new Date("2026-06-20T09:35:00.000Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      uploadedBy: tenantId.toString(),
      issueId: heatingIssueId.toString(),
      fileName: "heating-error-report.pdf",
      fileUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf",
      fileType: "pdf",
      cloudinaryPublicId: "smartrent/issues/demo-heating-error-report",
      createdAt: new Date("2026-06-18T14:20:00.000Z"),
      updatedAt: new Date("2026-06-18T14:20:00.000Z"),
    },
  ]);

  const leakConversationId = new mongoose.Types.ObjectId();
  const heatingConversationId = new mongoose.Types.ObjectId();

  await conversations.insertMany([
    {
      _id: leakConversationId,
      participants: [tenantId.toString(), landlordId.toString()],
      issueId: leakIssueId.toString(),
      tenancyId: tenancyId.toString(),
      propertyId: riversideId.toString(),
      subject: "Kitchen ceiling water leak",
      lastMessage: "I have contacted an emergency plumber for this afternoon.",
      lastMessageAt: new Date("2026-06-20T10:10:00.000Z"),
      createdAt: new Date("2026-06-20T09:40:00.000Z"),
      updatedAt: new Date("2026-06-20T10:10:00.000Z"),
    },
    {
      _id: heatingConversationId,
      participants: [tenantId.toString(), landlordId.toString()],
      issueId: heatingIssueId.toString(),
      tenancyId: tenancyId.toString(),
      propertyId: riversideId.toString(),
      subject: "Heating repair update",
      lastMessage: "The engineer is booked for tomorrow morning.",
      lastMessageAt: new Date("2026-06-19T12:00:00.000Z"),
      createdAt: new Date("2026-06-18T14:30:00.000Z"),
      updatedAt: new Date("2026-06-19T12:00:00.000Z"),
    },
  ]);

  await messages.insertMany([
    {
      _id: new mongoose.Types.ObjectId(),
      conversationId: leakConversationId.toString(),
      senderId: tenantId.toString(),
      receiverId: landlordId.toString(),
      issueId: leakIssueId.toString(),
      tenancyId: tenancyId.toString(),
      propertyId: riversideId.toString(),
      subject: "Kitchen ceiling water leak",
      message: "The leak is active and close to the kitchen light fitting.",
      isRead: true,
      createdAt: new Date("2026-06-20T09:40:00.000Z"),
      updatedAt: new Date("2026-06-20T09:40:00.000Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      conversationId: leakConversationId.toString(),
      senderId: landlordId.toString(),
      receiverId: tenantId.toString(),
      issueId: leakIssueId.toString(),
      tenancyId: tenancyId.toString(),
      propertyId: riversideId.toString(),
      subject: "Kitchen ceiling water leak",
      message: "I have contacted an emergency plumber for this afternoon.",
      isRead: false,
      createdAt: new Date("2026-06-20T10:10:00.000Z"),
      updatedAt: new Date("2026-06-20T10:10:00.000Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      conversationId: heatingConversationId.toString(),
      senderId: tenantId.toString(),
      receiverId: landlordId.toString(),
      issueId: heatingIssueId.toString(),
      tenancyId: tenancyId.toString(),
      propertyId: riversideId.toString(),
      subject: "Heating repair update",
      message: "Can you confirm when the engineer can attend?",
      isRead: true,
      createdAt: new Date("2026-06-18T14:30:00.000Z"),
      updatedAt: new Date("2026-06-18T14:30:00.000Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      conversationId: heatingConversationId.toString(),
      senderId: landlordId.toString(),
      receiverId: tenantId.toString(),
      issueId: heatingIssueId.toString(),
      tenancyId: tenancyId.toString(),
      propertyId: riversideId.toString(),
      subject: "Heating repair update",
      message: "The engineer is booked for tomorrow morning.",
      isRead: false,
      createdAt: new Date("2026-06-19T12:00:00.000Z"),
      updatedAt: new Date("2026-06-19T12:00:00.000Z"),
    },
  ]);

  const disputeId = new mongoose.Types.ObjectId();

  await disputes.insertOne({
    _id: disputeId,
    disputeReference: "DIS-2026-0001",
    issueId: leakIssueId.toString(),
    propertyId: riversideId.toString(),
    tenancyId: tenancyId.toString(),
    landlordId: landlordId.toString(),
    tenantId: tenantId.toString(),
    raisedBy: tenantId.toString(),
    title: "Urgent leak response dispute",
    reason: "Tenant believes the leak response should be escalated as urgent.",
    description: "The issue is near electrical fittings and requires documented escalation.",
    status: "under_review",
    priority: "high",
    resolutionNotes: "Awaiting contractor attendance confirmation.",
    createdAt: new Date("2026-06-20T11:00:00.000Z"),
    updatedAt: new Date("2026-06-20T11:30:00.000Z"),
  });

  await notifications.insertMany([
    {
      _id: new mongoose.Types.ObjectId(),
      userId: landlordId.toString(),
      title: "New issue reported",
      message: "Theo Tenant reported \"Kitchen ceiling water leak\" at Riverside Apartment.",
      type: "issue_created",
      relatedEntityType: "issue",
      relatedEntityId: leakIssueId.toString(),
      isRead: false,
      createdAt: new Date("2026-06-20T09:30:00.000Z"),
      updatedAt: new Date("2026-06-20T09:30:00.000Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: tenantId.toString(),
      title: "New message from Laura Landlord",
      message: "Kitchen ceiling water leak",
      type: "message_received",
      relatedEntityType: "message",
      relatedEntityId: leakConversationId.toString(),
      isRead: false,
      createdAt: new Date("2026-06-20T10:10:00.000Z"),
      updatedAt: new Date("2026-06-20T10:10:00.000Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: landlordId.toString(),
      title: "New dispute raised",
      message: "Theo Tenant raised \"Urgent leak response dispute\".",
      type: "dispute_created",
      relatedEntityType: "dispute",
      relatedEntityId: disputeId.toString(),
      isRead: false,
      createdAt: new Date("2026-06-20T11:00:00.000Z"),
      updatedAt: new Date("2026-06-20T11:00:00.000Z"),
    },
  ]);

  console.log("SmartRent demo data seeded successfully.");
  console.log("");
  console.log("Demo credentials");
  console.log("Landlord: landlord@smartrent.demo / Password123!");
  console.log("Tenant:   tenant@smartrent.demo / Password123!");
  console.log("Admin:    admin@smartrent.demo / Password123!");
}

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
