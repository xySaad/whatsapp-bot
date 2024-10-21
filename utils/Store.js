import fs from "fs/promises";
import path from "path";

class Store {
  constructor(filePath) {
    this.filePath = filePath || path.join(__dirname, "store.json");
    this.groups = [];
    this.individuals = [];
    this.messages = [];

    // Load existing data from the file
    this.loadFromFile();
  }

  // Load data from the JSON file (if it exists)
  async loadFromFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const parsedData = JSON.parse(data);
      this.groups = parsedData.groups || [];
      this.individuals = parsedData.individuals || [];
      this.messages = parsedData.messages || [];
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error("Error reading store file:", err);
      }
    }
  }

  // Save current data to the JSON file
  async saveToFile() {
    const data = JSON.stringify(
      {
        groups: this.groups,
        individuals: this.individuals,
        messages: this.messages,
      },
      null,
      2
    );

    try {
      await fs.writeFile(this.filePath, data, "utf-8");
    } catch (err) {
      console.error("Error writing store file:", err);
    }
  }

  // Add new contacts and save
  async addContacts(newContacts) {
    newContacts.forEach((contact) => {
      if (contact.id.endsWith("@g.us")) {
        this.groups.push(contact);
      } else if (contact.id.endsWith("@s.whatsapp.net")) {
        this.individuals.push(contact);
      }
    });
    await this.saveToFile(); // Save the updated contacts to the file
  }

  // Retrieve group contacts
  getGroups() {
    return this.groups;
  }

  // Retrieve individual contacts
  getIndividuals() {
    return this.individuals;
  }

  // Add new messages and save
  async addMessage(message) {
    this.messages.push(message);
    await this.saveToFile(); // Save the new messages to the file
  }

  // Retrieve stored messages
  getMessages() {
    return this.messages;
  }

  // Find a message by ID
  findMessageById(id) {
    return this.messages.find((m) => m.key.id === id);
  }
}

export default Store;
