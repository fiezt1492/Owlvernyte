const db = require("../../databases/mongo").collection("admin");
module.exports = {
	async getMaxHp() {
		const object = await db.findOne(
      {
				name: 'maxHp'
			},
      {
        projection: {
          _id: 0
        }
      });
		return object.value
	},
  async setMaxHp(value) {
		await db.updateOne(
			{
				name: 'maxHp'
			},
			{
        $set: {
          name: 'maxHp',
					value
        }
			},
			{
				upsert: true
			}
		)
  }
}



/*
  Dungeon floors
  document 
  {
    name: 'Floor 1.1.1.1.1'
    cards
  }
*/