import { ProductManager } from "./ProductManager.js";

export const producto = new ProductManager('./src/db/DataBase.json');

/*
(async () => {

    await producto.addProduct({
            title: "Disco sólido",
            description: "240 Gb, sata 3",
            price: 8560,
            thumbnail: "Imagen 89",
            code: "bnw635",
            stock: 2,
        })

        
        console.log(await producto.getproducts());
    })()

    */