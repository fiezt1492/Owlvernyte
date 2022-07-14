const db = require("../../databases/mongo").collection("cards");
const baseDB = require("./baseCards")
const skills = "Coming soon"
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
	// async getCards(baseId) {
	// 	return await db.find({
	// 		baseId
	// 	},{
	// 		projection: {
	// 			_id: 0
	// 		}
	// 	})
	// },
  async getFull(id, client) {
    const card = await this.get(id)
    const baseCard = { ...client.baseCardsList.find((e) => e.id === card.baseId)}
    delete baseCard.id
    baseCard.atk = Math.ceil(card.value * baseCard.atk)
    baseCard.def = Math.ceil(card.value * baseCard.def)
    baseCard.spd = Math.ceil(card.value * baseCard.spd)
    return {...card, ...baseCard}
  },
  async set(id, card) {
		const exist = await this.get(id);
		if (exist) return -1;

		await db.insertOne({
			id,
      ownerId: card.ownerId || "",
			status: card.status || "idle",
			durability: card.durability || 100,
			iconURL: card.iconURL || "",
      baseId: card.baseId || "",
			caseId: card.caseId || "",
			star: card.star || 1,
      value: card.value || 0,
      element: card.element || "",
      createdAt: Date.now()
		});
	}

  // cards.find({
  //   status: "market"
  // })

  /*
  baseCase 001 {
    cards: [
      {
        id
        rate
      },..
    ]
  }

  baseCase 002 {
    cards: [
      {
        id
        rate
      },..
    ]
  }
  */
}