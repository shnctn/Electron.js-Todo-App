const electron = require("electron");
const url = require("url");
const path = require("path");
const db=require ("./lib/connection").db;

const {app, BrowserWindow, Menu, ipcMain}=electron;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS']='true'
let mainWindow, addWindow;

app.on('ready',() =>{
  mainWindow=new  BrowserWindow({ 
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
        
    },
    frame:false
    
    });

    mainWindow.setResizable(false);


    // pencerenin olusturulması
   mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/mainWindow.html"),
            protocol:"file",
            slashes:true
        })
    );

    //menunun oluşturulması
    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu);

   
    //todo penceresini eventleri
    ipcMain.on("todo:close",()=>{
        addWindow.close();
        addWindow=null;
     

    });
    ipcMain.on("todo:quit",()=>{
        app.quit();
        addWindow=null;
     

    });
    ipcMain.on("todo:save",(err,data)=>{
    if(data)
    {
       db.query("insert into todor values text= ?",data.inputValue,(e,r,f)=>{
       if(r.insertId>0){
        mainWindow.webContents.send("todo:addItem",
        {
            id:r.insertId,
            text:data.inputValue
        });
       }
       }) 
   
        if(data.ref=="new"){
            addWindow.close();
            addWindow=null;
        
        }
       
    }
    });
    mainWindow.webContents.once("dom-ready",()=>{
         db.query("select * from todor",(error,results,fields)=>{
           mainWindow.webContents.send("initApp",results["rows"]);
          
         })
        
    });
  
    ipcMain.on("remove:todo",(e,id)=>{
         db.query("delete from todor where id = ?",id,(error,results,fields)=>{
           console.log(results);
           if(r.affectedRows>0){
            console.log("silme işlemi başarılıdır..")
           }
        })
    })


});
//menu template yapısı
const mainMenuTemplate=[
    {
        label:"Dosya",
        submenu:[
            {
                label:"Yeni TODO ekle",
                accelerator:process.platform=="darwin"?"Command+Y":"Ctrl+Y",
                click(){
                        createWindow();
                }
            },
            {
                label:"Tümünü sil",
                accelerator:process.platform=="darwin"?"Command+D":"Ctrl+D",
                click(){
                    // if(confirm("Tüm Kayıtları silmek istdiğinize eminmisiniz?")){
                    //     todoList.remove();
                    // }
                }
            },          
            {
                label:"Çıkış",
                accelerator:process.platform=="darwin"? "Command+Q":"Ctrl+Q",
                role:"quit"
            }
        ]
    }
    
]

if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push(
        {
            label:"Geliştirici Araçları",
            submenu:[
                {
                    label:"Geliştrici Araçları", 
                    accelerator:process.platform=="darwin"?"F12":"F12",
                    click(item,focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    label:"Yenile",
                    role:"reload"
    
                }              
            ]
        }
       
    )
}
if(process.platform=="darwin"){ //sistem mac ise  menü seçeneklerinde ayrı dosya alanı gösteriri

    mainMenuTemplate.unsift({
        label:app.getName(),
        role:"TODO"
    })
}

function createWindow(){
    addWindow=new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
            
        },
        width:380,
        height:168,
        title:"Yeni Bir Pencere",
        frame:false
    });
    addWindow.setResizable(false);
    addWindow.loadURL(url.format({
      pathname:path.join(__dirname,"pages/todo.html"),
      protocol:"file",
      slashes:true
    }));

    addWindow.on("close",()=>{
        addWindow=null;
    })
    
}

