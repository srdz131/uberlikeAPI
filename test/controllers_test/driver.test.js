/*jshint esversion:6*/
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
/*  ROUTES  */
const app = require('../../app.js');
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
  it('POST to /api/drivers creates a new driver', (done) => {
    //uzmi initial count
    Driver.count().then((count) => {
      //napravi request
      request(app)
        .post('/api/drivers')
        .send({
          email: "test@test.com"
        }) //ovo budzi req sa podcima
        .end(() => {
          //uzmi novi count
          Driver.count().then((newCount) => {
            //predpostavi da je vrednost count veca od prethodne,
            //jer smo sacuvali novog drivera
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it('PUT to /api/drivers/:id edits existing driver', (done) => {
    const driver = new Driver({
      email: 'trt@mail.com',
      driving: false
    });

    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({
          driving: true
        })
        .end(() => {
          Driver.findOne({
              email: 'trt@mail.com'
            })
            .then(driver => {
              assert(driver.driving === true);
              done();
            });
        });
    });
  });

  it('DELETES driver at /api/drivers/:id', (done) => {
    const driver = new Driver({
      email: 'trt@mail.com',
      driving: false
    });

    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findById(driver._id)
          .then((drvr) => {
            assert(drvr === null);
            done();
          });
        });
    });
  });

  // test za koriscenje geoloca kod mongodb-a
  it('GET to /api/drivers find nearest drivers', (done) => {
    const belgradedriver = new Driver({
      email: 'bgd@mejl.com',
      geometry: {type: 'Point', coordinates: [20.4489,44.7866] }
    });
    const miamiDriver = new Driver({
      email: 'miami@palms.com',
      geometry: { type: 'Point', coordinates: [-80.254,25.791] }
    });

    //sacuvaj
    Promise.all([belgradedriver.save(), miamiDriver.save()])
      .then(() => {
        request(app)
        //napravi req
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, response) => {
            //predpostavi da nesto ima u req.body
            assert(response.body.length === 1);
            //predpostavi da je email isti kao i kod novog drivera (miamiDriver)
            assert(response.body[0].obj.email === 'miami@palms.com');
            done();
          });
      });
  });
});
