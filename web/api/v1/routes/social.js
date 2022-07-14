const router = require("express").Router();

router.get("/facebook", (req, res) => {
	res.redirect("https://www.facebook.com/owlvernyte")
})

router.get("/instagram", (req, res) => {
	res.redirect("https://www.instagram.com/owlvernyte")
})

router.get("/youtube", (req, res) => {
	res.redirect("https://www.youtube.com/channel/UCEG5sgFKieaUuHsu5VG-kBg")
})

router.get("/discord", (req, res) => {
	res.redirect("https://discord.gg/F7ZK6ssMUm")
})

module.exports = router