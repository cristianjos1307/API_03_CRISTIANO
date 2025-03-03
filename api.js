const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");

const functions = require("./inc/functions");
const mysql_config = require("./inc/mysql_config");

const API_AVAILABILITY = true;
const API_VERSION = "1.0.0";

const app = express();

app.listen(3000, () => {
  console.log("[SERVER]: Running on port 3000.");
});

app.use((req, res, next) => {
  if (API_AVAILABILITY) {
    next();
  } else {
    res.json(
      functions.response(
        "Atenção",
        "API está em manutenção. Sinto muito.",
        0,
        null
      )
    );
  }
});

const connection = mysql.createConnection(mysql_config);

app.use(cors());

app.use(json());

app.use(express.urlencode({extended:true}))



app.get("/", (req, res) => {
  res.json(functions.response("Sucesso", "API está rodando.", 0, null));
});

app.get("/tasks", (req, res) => [
  connection.query("SELECT * FROM tasks", (err, rows) => {}),
]);

app.get('/tasks/:id',(req,res)=>{
  const id = req.params.id;
  connection.query('SELECT * FROM tasks WHERE id=?'[id],(req,res)=>{
    if(!err){
      if(rows.length>0){
        res.json(functions.response('Sucesso', 'Sucesso na pesquisa',rows.length,rows))
      } else{
        res.json(functions.response('Atenção', 'Não foi possível encontrar a task solicitada',0,null))
      }
    }
    else{
      res.json(functions.response('error',err.message,0,null))
    }
  })
})

app.put('/tasks/:id/status/:status',(req,res)=>{
  const id = req.params.id;
  const status = req.params.status;
  connection.query('UPDATE tasks SET status =? WHERE id =?',[status,id],(err,rows)=>{
    if(!err){
      if(rows.affectedRows>0){
        res.json(functions.response('Sucesso','Sucesso na lateração do status',rows.affectedRows,null))
      }
      else{
        res.json(functions.response('Atenção', 'Task não encontrada',0,null))
      }
    }
    else{
      res.json(functions.response('Erro',err.mesage,0,null))
    }
  })
})

app.delete('/tasks/:id/delete', (req,res)=>{
  const id =req.params.id;
  connection.query('DELETE FROM tasks WHERE id =?',[id],(err,rows)=>{
    if(!terr){
      if(rows.affectedRows>0){
        res.json(functions.response('Sucesso', 'Tasks deletada',rows.affectedRows,null))
      }
      else{
        res.json(functions.response('Atenção', 'Task não encontrada',0,null))
      }
    }
    else{
      res.json(functions.response('Erro',err.message,0,null))
    }
  })
})

app.put('/tasks/create',(req,res)=>{
  const post_data = req.body;


  if(post_data ==undefined){
    res.json(functions.response('Atenção', 'Sem dados de uma task',0,null))
    return;
  }
  const task = post_data.task;
  const status = post_data.status;

  connection.query('INSERT INTO tasks(tasks,status,created_at,update_at) VALUES(?,?,NOW(),MOW()',[task,status],(err,rows)=>{
    if(!err){
      res.json('Sucesso','Task cadastrada no banco',rows.affectedRows,null)
    }
    else{
      res.json(functions.response('Erro',err.message,0,null))
    }
  })

})


app.use((req, res) => {
  res.json(functions.response("Atenção", "Rota não encontrada.", 0, null));
});

