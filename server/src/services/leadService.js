import { ApiError } from "../middleware/errorHandler.js";
import { Lead } from "../models/Lead.js";

function buildLeadQuery(userId, { q, status }) {
  const query = { userId };

  if (status) {
    query.status = status;
  }

  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { leadName: regex },
      { companyName: regex },
      { email: regex },
      { phoneNumber: regex },
      { serviceInterested: regex }
    ];
  }

  return query;
}

export async function listLeads(userId, filters) {
  const page = filters.page;
  const limit = filters.limit;
  const skip = (page - 1) * limit;
  const query = buildLeadQuery(userId, filters);

  const [items, total] = await Promise.all([
    Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments(query)
  ]);

  return {
    items: items.map((lead) => lead.toClient()),
    pagination: {
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

export async function createLead(userId, payload) {
  const lead = await Lead.create({ ...payload, userId });
  return lead.toClient();
}

export async function getLead(userId, id) {
  const lead = await Lead.findOne({ _id: id, userId });

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  return lead.toClient();
}

export async function updateLead(userId, id, payload) {
  const lead = await Lead.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
    runValidators: true
  });

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  return lead.toClient();
}

export async function deleteLead(userId, id) {
  const lead = await Lead.findOneAndDelete({ _id: id, userId });

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  return lead.toClient();
}
