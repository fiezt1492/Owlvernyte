require("dotenv").config()
module.exports = {
	prefix: String(process.env.PREFIX) || "!",
	token: String(process.env.TOKEN),
	owner: String(process.env.OWNER) || "445102575314927617",
	client_id: String(process.env.CLIENT_ID),
	test_guild_id: String(process.env.TEST_GUILD_ID),
	dev: String(process.env.DEVMODE) || "on",
	port: Number(process.env.PORT) || 80,
	web: String(process.env.WEB) || "off"
}
