import Client from "../models/client.js";

export const createClient = async (req, res) => {
  try {
    const { name, industry } = req.body;

    if (!name || !industry) {
      return res.status(400).json({ message: "Name and industry are required" });
    }

    const client = await Client.create({
      name,
      industry,
      createdBy: req.user._id,
    });

    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create client" });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch client" });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { name, industry, isActive } = req.body;

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (name !== undefined) client.name = name;
    if (industry !== undefined) client.industry = industry;
    if (isActive !== undefined) client.isActive = isActive;

    await client.save();

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Failed to update client" });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.isActive = false;
    await client.save();

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete client" });
  }
};
