const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash")
// const date =require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");
// var newitem = [];
// var worklist = []
mongoose.connect("mongodb://localhost:27017/todolistDb");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const itemSchema = new mongoose.Schema({
    name:String
})

const Item = mongoose.model("Item",itemSchema);

let burger = new Item({
    name:"Burger"
})

let books = new Item({
    name:"Books"
})

// Item.insertMany([burger,books],function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("inserted");
//     }
// })

const listSchema = new mongoose.Schema({
    name:String,
    items: [itemSchema]
})

const List = mongoose.model("aList",listSchema);

app.get("/:customList",function(req,res){
    console.log("req.params.customList",req.params.customList)
    const customListname = _.capitalize(req.params.customList);
    
    List.findOne({name:customListname},function(err,result){
        console.log(result);
        if(!err){
            if(result == null){
                // console.log();
                let list = new List(
                    {
                    name:customListname,
                    items: [burger,books]
                    }) 
                list.save();
                res.redirect("/"+customListname)

            }
            else{
                res.render("list",{listTitle:result.name,newlist:result.items})
            }
        }

    })
    
    
    // let list = new List(
    //     {
    //     name:customListname,
    //     items: [burger,books]
    //     }) 
    
    // list.save();

})


app.get("/",function(req,res){

    Item.find({},function(err,founditems){
        if(err){
            console.log(err);
        }
        else{
            if(founditems.length ==0){
                Item.insertMany([burger,books],function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("inserted");
                    }
                })
                res.redirect("/");
            }
            else{

                res.render("list",{listTitle:"Today",newlist:founditems})
            }
            
        }
    })

    

})





app.post("/",function(req,res){
    console.log(req.body);
    let items = req.body.items;
    let listname = req.body.list;

    const item = new Item({
        name:items
    })

    if(listname === "Today"){
        item.save();
        res.redirect();
    }
    else{
        List.findOne({name:listname},function(err,foundlist){
            if(!err){
                foundlist.items.push(item);
                foundlist.save();
                res.redirect("/" + listname);
            }
        })
    }

    // if(req.body.list == "work"){
    //     worklist.push(req.body.items);
    //     res.redirect("/"+req.body.list);
    // }
    // else{
    //     const addeditem = new Item({
    //         name:req.body.items
            
    //     })
    //     addeditem.save();

    //     res.redirect("/");

    // }
    // console.log("req",newitem)
})


app.post("/delete",function(req,res){
    console.log(req.body);
    const item = req.body.checkbox;
    const listName = req.body.listname;

    if(listName == "Today"){
        Item.deleteOne({_id:req.body.checkbox},function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("deleted");
                res.redirect("/");
            }
        })
    }
    else{
        List.findOneAndUpdate({name:listName},{ $pull: {items:{_id:item} }},function(err,foundlist){
            if(err){
                console.log("err",err);
            }
            else{
                console.log("deleted");
                res.redirect("/" + listName);
            }
        })
    }

    

    


})



app.listen(3000,function(){
    console.log("server started");
})


// app.get("/work",function(req,res){
//     console.log("work requesy");
//     res.render("list",{listTitle:"work",newlist:worklist})


// })


app.get("/about",function(req,res){
    res.render("about");

})


app.post("/work",function(req,res){
    worklist.push(req.body.items);
    res.redirect("/work");
    // console.log("req",newitem)
})