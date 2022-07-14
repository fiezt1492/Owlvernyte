const db = require("../../databases/mongo").collection("baseItems");
const itemDB = require("../../databases/mongo").collection("items");
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
  async set(id, name, type, iconURL = null) {
		const exist = await this.get(id);
		if (exist) return -1;

		await db.insertOne({
			id,
      name,
      type,
			iconURL
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
    await item.deleteMany({
      baseId: id
    })
  }
}