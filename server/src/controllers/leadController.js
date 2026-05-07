import * as leadService from "../services/leadService.js";

export async function list(req, res, next) {
  try {
    const result = await leadService.listLeads(req.user.id, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const lead = await leadService.createLead(req.user.id, req.body);
    res.status(201).json({ lead });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const lead = await leadService.getLead(req.user.id, req.params.id);
    res.json({ lead });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const lead = await leadService.updateLead(req.user.id, req.params.id, req.body);
    res.json({ lead });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await leadService.deleteLead(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
