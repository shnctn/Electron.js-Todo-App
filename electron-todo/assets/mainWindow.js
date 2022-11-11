const electron=require("electron");

const{ipcRenderer}=electron;


checkTodoCount()

const inputValue=document.querySelector("#todoValue");


ipcRenderer.on("initApp",(e,todos) =>{
 todos.forEach(todo => {
    drawRow(todo)
 });
})



 inputValue.addEventListener("keypress", (e) => {
    if(e.keyCode==13){
        ipcRenderer.send("todo:save",{ref:"main",inputValue: e.target.value});
        e.target.value="";
    }
 })

document.querySelector("#addBtn").addEventListener("click",()=>{
   if(inputValue.value!=""){
    ipcRenderer.send("todo:save",{ref:"main", inputValue:inputValue.value});
    inputValue.value="";
   }
})

document.querySelector("#extBtn").addEventListener("click",()=>{
    if(confirm("Çıkmak istiyormusunuz?"))
    {
        ipcRenderer.send("todo:quit");
    }
})

ipcRenderer.on("todo:addItem",(e,todo)=>{
    drawRow(todo);
})


function checkTodoCount(){
    const container=document.querySelector(".todo-container");
    const alert= document.querySelector(".alert-container");
    document.querySelector(".total-count-container").innerText=container.children.length;
    
    if(container.children.length !== 0)
    {
        alert.style.display="none"
    }
    else{
        alert.style.display="block"
    }
}


function drawRow(todo){
       
const container=document.querySelector(".todo-container");
//row
const row= document.createElement("div")
row.className="row"


//col
const col= document.createElement("div")
col.className="todo-item p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center"

//p
const p= document.createElement("p")
p.className="m-0 w-100"
p.innerText=todo.text
//button
const button=document.createElement("button")
button.className="btn btn-sm btn-outline-warning flex-shrink-1 mr-1"

//silbutton
const deletebutton=document.createElement("button")
deletebutton.className="btn btn-sm btn-outline-warning flex-shrink-1"
deletebutton.innerText="X"
deletebutton.setAttribute("data-id",todo.id)

deletebutton.addEventListener("click",(e) =>{
    if(confirm("Bu kaydı silmek istediğinizden emin misiniz?"))
    {
        //todo
        e.target.parentNode.parentNode.remove()
        
        ipcRenderer.send("remove:todo",e.target.getAttribute("data-id"))

        checkTodoCount()
    }
})

col.appendChild(p);
col.appendChild(deletebutton);

row.appendChild(col);

container.appendChild(row);
checkTodoCount()
}