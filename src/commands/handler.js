const { REST, Routes } = require("discord.js");
const { clientId, token, guildId } = require("../../config.json");
const fs = require("node:fs");
const path = require("node:path");

module.exports = function CommandHandler() {
  function getCommand(mypath, commands) {
    const commandFiles = fs
      .readdirSync(mypath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(mypath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.error(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  const commands = [];

  const slashPath = path.join(__dirname, ".", "slash");
  const modPath = path.join(__dirname, ".", "mod");

  if (!fs.existsSync(slashPath) || !fs.existsSync(modPath)) {
    console.log(`[ERROR] Directory not found for adding commands`);
    return;
  }

  getCommand(slashPath, commands);
  getCommand(modPath, commands);

  const rest = new REST().setToken(token);

  (async () => {
    try {
      console.warn(
        `\nStarted refreshing ${commands.length} application (/) commands.`
      );

      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });

      console.warn(
        `Successfully reloaded ${data.length} application (/) commands.\n`
      );
    } catch (error) {
      console.error(error);
    }
  })();
};
