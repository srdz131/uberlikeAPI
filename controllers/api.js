/*jshint esversion:6*/
const express = require('express');
const router = express.Router();

const Driver = require('../models/driver');

/*  GET   */
//trazi vozaca koji je u krugu od naznacene maxDistance od korisnikovih koordinata
//npr. req je /api/drivers?lng=20&lat=44
router.get('/drivers',(req,res,next)=>{
  //izvuci longitude and latitude iz ?stringa
  const {lng, lat} = req.query;

  //koristi mongooseov geoNear model metod da nadjes rezultate koji se nalaze u nekom krugu od naznacene
  //tacke u ovom slucaju je to radius od 200000m
  Driver.geoNear(
    //naznaci da je tip potrage "Point" i ubaci koordinate koje je korisnik obezbedio
    {type : 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
    //ovo je query objekat i tu preciziramo da je tip spherical i da je maxDistance 200km
    { spherical: true, maxDistance: 200000 }
  )
  //onda izbaci sve vozace koji su u krugu od 200000m od koordinata lng=20&lat=44 (koord za beograd npr)
  .then((drivers) => res.send(drivers))
  .catch(next);
});


/*  POST   */
router.post('/drivers', (req,res,next)=>{
    //driverProps je json objekat
    const driverProps = req.body;

    Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next);
});


/*  PUT   */
router.put('/drivers/:id', (req,res,next) => {
  const id = req.params.id;

  Driver.findByIdAndUpdate( {_id: id}, req.body)
    .then(() => Driver.findById({ _id:id }))
    .then(driver => res.send(driver))
    .catch(next);
});


/*  DELETE   */
router.delete('/drivers/:id' ,(req,res,next) => {
  const id = req.params.id;

  Driver.findByIdAndRemove({ _id: id })
    .then(() => res.status(204).send({message: "Deleted successfully" }))
    .catch(next);
});


module.exports = router;
