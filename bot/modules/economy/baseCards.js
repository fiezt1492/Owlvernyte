const db = require("../../databases/mongo").collection("baseCards");
const cardDB = require("../../databases/mongo").collection("cards");
module.exports = {
  async get(id) {
    return await db.findOne(
      { id }, 
      {
        projection: {
          _id: 0
      	}
   	 	}
		);
  },
  async getAll() {
    return await db.find({}, {
      projection: {
        _id: 0
      }
    }).toArray()
  },
  async set(id, name, rarity, type, atk, def, spd, skill, iconURL = null) {
		const exist = await this.get(id);
		if (exist) return -1;

		await db.insertOne({
			id,
      name,
			iconURL,
      rarity,
      type,
      atk,
      def,
      spd,
      skill
		});
  },
  async update(id, prop, value) {
    await db.updateOne({
      id,
    }, {
			$set: {
      	[prop]: value
			}
    })
  },
  async remove(id) {
    await db.deleteOne({
      id
    })
    await cardDB.deleteMany({
      baseId: id
    })
  }
}