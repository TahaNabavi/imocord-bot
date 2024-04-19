const { REST, Routes } = require("discord.js");
const { clientId, token, guildId } = require("../../config.json");
const fs = require("node:fs");
const path = require("node:path");

module.exports = function CommandHandler() {
  const commands = [];

  // Define the path to the commands directory
  const foldersPath = path.join(__dirname, ".", "slash"); // Make sure 'slash' directory exists

  // Check if the directory exists
  if (!fs.existsSync(foldersPath)) {
    console.log(`[ERROR] Directory not found: ${foldersPath}`);
    return;
  }

  const commandFiles = fs
    .readdirSync(foldersPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath); // Make sure this file exists and is valid

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.error(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const rest = new REST().setToken(token);

  (async () => {
    try {
      console.warn(
        `\nStarted refreshing ${commands.length} application (/) commands.`
      );

      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      console.warn(
        `Successfully reloaded ${data.length} application (/) commands.\n`
      );
    } catch (error) {
      console.error(error);
    }
  })();
};
