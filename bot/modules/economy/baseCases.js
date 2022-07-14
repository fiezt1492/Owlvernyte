const db = require("../../databases/mongo").collection("baseCases");
const caseDB = require("../../databases/mongo").collection("cases");
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
  async set(id, name, cardRates, iconURL = null) {
		const exist = await this.get(id);
		if (exist) return -1;
		await db.insertOne({
			id,
      name,
      cardRates,
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

		// cards.find({
    //   ownerId: x
    // }).toArray()
    // await backpackDB.update({
    //   ""
    // })
    
    await caseDB.deleteMany({
      baseId: id
    })

    
  }
}