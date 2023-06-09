// var data=[];
// var workData=[];
const mongoose = require("mongoose");
const express = require("express");
const bp = require("body-parser");
const date= require("./data.js")
const app = express();
const _=require("lodash");
//Database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/toDolistDB');
}
const itemSchema = new mongoose.Schema({
    name: String
});
const item= mongoose.model('Item', itemSchema );
const moreSchema= new mongoose.Schema({
      name: String,
      items: [itemSchema]
});
const more= mongoose.model('moreList',moreSchema);
// item.insertMany(defaultItems)
// .then(function () {
//     console.log("Data inserted") ;
// })
// .catch(function (err) {
//     console.log("error");
// });
// item.find()
//   .then(function(items) {
//     items.forEach(function(item) {
//       console.log(item.name);
//       mongoose.connection.close();
//     });
//   })
//   .catch(function(err) {
//     console.log(err);
//   });


app.use(bp.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use('/css', express.static('css'));
 
const aWork= new item({
    name: "Gym"
  });
  const bWork= new item({
    name: "Driving car"
  });
  const cWork= new item({
    name: "Completing this project"
  });
  const defaultItems=[aWork,bWork,cWork];
app.get("/",function (req,res) {
    let currentDate=date.getDate();
  item.find()
  .then(function(objs) {
    if(objs.length!==0){
    res.render('list', {whichDay: "Today",data: objs});
    }
    else{
        
        item.insertMany(defaultItems)
      .then(function () {
      console.log("Data inserted") ;
     })
      .catch(function (err) {
      console.log("error");
     });
     res.redirect("/");
    }
  })
  .catch(function(err) {
    console.log(err);
  });
})
app.post("/delete",function (req,res) {
    var id=req.body.checkbox;
    //console.log(req.body);
    if(req.body.typeOf==='Today'){
    item.deleteOne({_id: id})
    .then(function(result) {
    console.log("Successfully deleted "+id);
    res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
  });
 }
 else{
    const filter = {name: req.body.typeOf}
   const update = {$pull: {items: {_id: id}}};
   more.findOneAndUpdate(filter, 
    update, null, { upsert: true, }).then(post =>{
        res.redirect('/'+req.body.typeOf)
        });
    // more.findOneAndUpdate(
    //     filter,
    //     update,{ new: true 
    //     });
        
 }
})
app.get("/:id/",function (req,res) {
    // res.render('list', {whichDay: "Work",data: workData});

    const customListName=_.capitalize(req.params.id);
    more.findOne({name:customListName})
    .then(function(foundList){
        
          if(!foundList){
            const list = new more({
              name:customListName,
              items:defaultItems
            });
          
            list.save();
            console.log("saved");
            res.redirect("/"+customListName);
          }
          else{
            res.render("list",{whichDay:foundList.name, data:foundList.items});
          }
    })
    .catch(function(err){});
})
app.post("/work",function (req,res) {
    res.redirect("/");
})
app.post("/",function (req,res) {
    let name =req.body.Name;
    console.log(req.body);
    const nameWork= new item({
        name: name
      });
    if(req.body.add!="Today")
    {
        more.findOne({name: req.body.add})
        .then((docs)=>{
            docs.items.push(nameWork);
            docs.save();
            console.log("added");
            res.redirect("/"+req.body.add);
        })
        .catch((err)=>{
            console.log(err);
        });
    }
    else
    {
          nameWork.save();
        res.redirect("/");
    }
    
})
app.listen(3000,function () {
    console.log("server is running");
})