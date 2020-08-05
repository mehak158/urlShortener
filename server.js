const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  let { fullUrl, uniqueName } = req.body;
  const expireIn = req.body.expireIn || 30 * 60;

  console.log("unique name", req.body.uniqueName)

  if (expireIn && Number.isNaN(expireIn)) {
    return res.status(403).json({
      error: "Please provide valid expire time.",
      ok : false
  }) }
  

  if (uniqueName == ''){
      await ShortUrl.create({ full: req.body.fullUrl,unique_name:req.body.uniqueName })
  }
  else {
    let nameExists = await ShortUrl.findOne({ unique_name:req.body.uniqueName });
    if(nameExists){
        return res.status(403).json({
            error: "Unique name already exists, choose another",
            ok : false
        }) }
    else {
      const currentDate = new Date().getTime();
      const expireAt = new Date(currentDate + parseInt(expireIn) * 1000);
    
      await ShortUrl.create({ full: req.body.fullUrl, short:uniqueName,expiryDate:expireAt, unique_name:req.body.uniqueName })
    }
  }
  const d = new Date;
  const exp = new Date(req.body.date);

  if(d.toDateString() === exp.toDateString()) {
    await ShortUrl.findOneAndRemove({short:req.body.shortUrl})
  }

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);