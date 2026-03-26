const express=require('express')
const app=express();

const db=require('./db');

const bodyParser=require('body-parser');
app.use(bodyParser.json());
const person=require('./models/person');
const menuitem=require('./models/menuitem');

app.get('/',function(req,res){
    res.send('Welcome Mehul');
})

// app.get('/chicken',(req,res)=>{
//     var customized_idli={
//         name:"rava idli",
//         size:"10 cm diameter",
//         is_sambhar:true,
//         is_chutney:false
//     }
//     res.send(customized_idli)
// })

app.get('/person/:worktype',async (req,res)=>{
    try{
        const worktype=req.params.worktype;
        if(worktype=='chef' || worktype=='manager' || worktype=='waiter'){
            const response=await person.find({work:worktype});
            console.log('response fetched');
            res.status(200).json(response);
        }
        else{
            res.status(404).json({error:'Invalid work type'});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
    
})

app.post('/person',async (req,res)=>{
    try{
        const data=req.body;
        const newPerson=new person(data);
        const response=await newPerson.save();
        console.log("Data Saved");
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal Server Error"});
    }
})

app.get('/person',async (req,res)=>{
    try{
        const data=await person.find();
        console.log("data saved");
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal Server Error"});
    }
})

app.listen(3000,()=>{
    console.log("listening on port 3000");
});

const personroutes=require('./routes/personroutes');
app.use('/person',personroutes);