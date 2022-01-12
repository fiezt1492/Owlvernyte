require("dotenv").config()
module.exports = {
	prefix: "o.",
	token: String(process.env.TOKEN),
	owner: "445102575314927617",
	client_id: String(process.env.CLIENT_ID),
	test_guild_id: String(process.env.TEST_GUILD_ID)
}
