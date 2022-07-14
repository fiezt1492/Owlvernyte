// const db = require("../../databases/mongo").collection("banlist")
module.exports = async (client) => {
	const db = client.db.collection("banlist")
	let banlist = await db.find({},{
        projection: {
          _id: 0
        }
      }).toArray()
	return banlist.map(o => o.id)
}