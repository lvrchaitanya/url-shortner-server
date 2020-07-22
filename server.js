const express = require("express");
const mongoose  = require("mongoose");
const app= express();
const bodyParser =require("body-parser");
const shortid =require ("shortid");

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost:27017/url-shortner",{ useNewUrlParser: true, useUnifiedTopology: true });

const linkSchema ={
    old: String,
    new : String,
    count : Number
}
const Link = mongoose.model("Link",linkSchema);

app.get('/test',(req,res)=> {
   res.send("working");
})

app.get("/:new",(req,res)=>{
    
   Link.findOne( { new: req.params.new }, (err, foundLink)=>{
            
       if(foundLink === null)
       {
           res.send( "link not found");
       }
       else{
        res.redirect(foundLink.old);
        foundLink.count++;
        foundLink.save();
       }

    })
  
});


app.get("/", async (req,res)=>{
  const allurls = await  Link.find( );  
       
       
        res.send(allurls);
      
   
 });
 
app.post("/link",(req,res)=>{
   const newvar =shortid.generate();
   const oldurl = req.body.url;
   if(oldurl === "")
       res.send("ENTER THE LINK");
  else{

     
   Link.findOne( { old: oldurl }, (err, foundLink)=>{
       
        if(err)
        res.send("error ");
        else{
    if(!(foundLink === null)){
        
        Link.findOne( { old: oldurl }, (err, foundLink)=>{
            
            res.send(foundLink.new);
            foundLink.count++;
            foundLink.save();
         })
    }
    else{
    
        const newurl = new  Link({
            old: req.body.url,
            count: 0,
            new:  newvar
           
        })

         newurl.save();
         res.send(newvar);
    }}

  })
  }
   
});

app.listen(process.env.PORT || 5000,()=>  {
    console.log("server running");
});