const db = require("../../databases/mongo").collection("items");
const baseDB = require("./baseItems")
module.exports = {
  async check(id) {
    return db.count({id : id}, {limit: 1})
  },
  async get(id) {
    return await db.findOne(
      { id },
      {
        projection: {
          _id: 0
        }
      });
  },
  async set(id, { ownerId, amount }) {
		const exist = await this.get();
		if (exist) return -1;

		await db.insertOne({
			id,
      ownerId,
      amount,
      createdAt: Date.now()
		});
	}
}