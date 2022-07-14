const mongoose = require('mongoose')

const Schema = mongoose.Schema({
  id: {
    type: String,
    required: true,
		unique: true
  },
  name:{
    type: String,
    required: true
  },
  iconURL: {
    type: String,
    // required: true
  },
  cardRates: [
		{
      baseCard: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			},
      rate: {
				type: Number,
				required: true,
				min: 0,
				max: 100
			}
    }
	]
})
        
module.exports = mongoose.model("baseCases", Schema)