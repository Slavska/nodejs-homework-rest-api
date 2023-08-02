import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
};

export const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === contactId);
  return result || null;
};

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateContactStorage(contacts);
  return result;
};

export const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContactStorage(contacts);
  return newContact;
};

const updateContactStorage = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

export const updateContact = async (contactId, { name, email, phone }) => {
  const data = await listContacts();
  const index = data.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  data[index] = { contactId, name, email, phone };
  await updateContactStorage(data);
  return data[index];
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
