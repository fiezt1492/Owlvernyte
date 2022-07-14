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
  rarity: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  atk: {
    type: Number,
    default: 1
  },
  def: {
    type: Number,
		default: 1
  },
  spd: {
    type: Number,
		default: 1
  },
  skill: {
    type: Number,
		default: 1
  }
})

module.exports = mongoose.model("baseCards", Schema)