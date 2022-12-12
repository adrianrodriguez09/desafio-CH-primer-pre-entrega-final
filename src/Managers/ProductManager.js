import fs from 'fs'

export class ProductManager {

    constructor(path) {
        
        this.path = path
    }

    read = () => {
        if (fs.existsSync(this.path)){
            return fs.promises.readFile(this.path, 'utf-8').then(r => JSON.parse(r))
        }
        return []
    }
    getNextId = list => {
        const count = list.length
        return (count > 0) ? list[count-1].id +1 : 1
    }

    write = list => {
        return fs.promises.writeFile(this.path, JSON.stringify(list, null, 3))
    }

    getproducts = async () => {
        const data = await this.read()
        return data
    }

    addProduct = async (object) => {
        const list = await this.read()
        const nextID = this.getNextId(list)
        object.id = nextID

        list.push(object)

        await this.write(list)
    }
    updateProduct = async (id, object) => {
        object.id = id
        const list = await this.read()
        for (let i = 0; i < list.length; i++){
            if (list[i].id ==id){
                list [i] = object 
                break
            }
            
        }
        await this.write(list)
    }
    getProductById = async (id) => {
        const data = await this.read() 
        const object = data.find(i =>i.id === id);
        if (object){
            return object
        } else {
            return "Id no encontrado"
        }
    }
     
    deleteProduct = async (id) => {      
        
        const data = await this.read();
        const object = data.filter(i =>i.id !== id);
        const exists = data.some(i =>i.id === id)
            if (exists){
                await this.write(object)
                return "Objeto eliminado"
            } else {
                return "Objeto no encontrado"
            }                    
        }
        
    }
 
/*
const producto = new ProductManager('./DataBase.json');

//Agregar producto

(async () => {

    await producto.addProduct({
            title: "Monitor",
            description: "PS4",
            price: 5000,
            thumbnail: "Imagen 0",
            code: "abc126",
            stock: 10,
        })

        
        console.log(await producto.getproducts());
    })()



//probar metodos

(async () =>{

    console.log(await producto.getProductById(1));
    
})()

*/


