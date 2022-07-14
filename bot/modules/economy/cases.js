const db = require("../../databases/mongo").collection("cases");
const baseDB = require("./baseCases")
module.exports = {
  async check(id, ownerId) {
    return db.count({id, ownerId}, {limit: 1})
  },
  async get(id, ownerId) {
    return await db.findOne(
      { 
				id,
				ownerId 
			},
      {
        projection: {
          _id: 0
        }
      });
  },
  async set(id, ownerId, amount) {
		const exist = await this.check(id, ownerId);
		console.log(exist)
		if (exist) {
			await db.updateOne({
				id,
				ownerId,
			},
			{
				$inc: {
					amount: amount
				}
			});
		} else {
			await db.insertOne({
				id,
				ownerId,
				amount,
				createdAt: Date.now()
			})
		}

		
	},
	// async update(id, ownerId, amount) {

	// }
}