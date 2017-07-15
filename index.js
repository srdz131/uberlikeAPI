/*jshint esversion:6*/
const app = require('./app');


const port = process.env.PORT || 3000;
app.listen(port, ()=>{
  console.log(`You are listening port ${port}`);
});
