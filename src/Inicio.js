import express from 'express'
import { ERRORS } from './consts/errors.js';
import {  producto } from './Managers/index.js'


const app= express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 8080;

app.get("/api/products", async (req, res)=>{

    try {
    const { limit } = req.query

    const allProducts = await producto.getproducts();

    if(!limit || limit <1 ){
        return res.send({success: true, products: allProducts});
    }

    const products = allProducts.slice(0, limit);

    return res.send({success: true, products});

    } catch (error) {
        console.log(error)

        res.send({success: false, error: "Se ha producido un error"});
    }
    
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const { id: paramId } = req.params;
        const id = Number(paramId)

        if(Number.isNaN(id) || id < 0) {
            return res.send({success: false, error: "El Id debe ser un valor válido"})
        }
        const product = await producto.getProductById(id);

        if(!product.id){
            return res.send({success: false, error: "El producto no fue encontrado"})
        }

        res.send({success: true, product});
    
    } catch (error) {
        console.log(error)

        res.send({success: false, error: "Ha ocurrido un error"});
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const {title, description, thumbnail, price, code, stock} = req.body

        if(!title || !description || !thumbnail || !price || !code || !stock){
            return res.send({success: false, error: "Las variables son obligatorias"});

        }

        const savedProduct = await producto.addProduct({
            title,
            description,
            thumbnail,
            price,
            code,
            stock,
        });

        res.send({success: true, product: savedProduct})

    } catch (error) {
        console.log(error);

        if (error.name === ERRORS.VALIDATION_ERROR) {
            return res.send({
                success: false,
                error: `${error.name}: ${error.message}`,
            });
        }

        res.send({success: false, error: "Ha ocurrido un error"});
    }
}
);

app.put('/api/products/:id', async(req,res) =>{
    try {
        const { id: paramId } = req.params;
        const id = Number(paramId);

        if(Number.isNaN(id) || id < 0) {
            return res.send({success: false, error: "El Id debe ser un valor válido"})
        };

        const {title, description, thumbnail, price, code, stock} = req.body

        const updateProduct = await producto.updateProduct(id, {
            title,
            description,
            thumbnail,
            price,
            code,
            stock,
        });

        res.send({success: true, product: updateProduct});
        
    } catch (error) {
        console.log(error);

        if(error.name === ERRORS.NOT_FOUND_ERROR){
            return res.send({success: false, error: `${error.name}: ${error.message}`})
        }

        res.send({success: false, error: "Ha ocurrido un error"});
    }
});

app.delete('/api/products/:id', async(req, res)=>{
    try {
        const { id: paramId } = req.params;
        const id = Number(paramId);

        if(Number.isNaN(id) || id < 0) {
            return res.send({success: false, error: "El Id debe ser un valor válido"})
        };

        const deletedProduct = await producto.deleteProduct(id)

        res.send({success: true, deleted: deletedProduct})


    } catch (error) {
        console.log(error)

        if(error.name === ERRORS.NOT_FOUND_ERROR){
            return res.send({success: false, error: `${error.name}: ${error.message}`})
        }
        
        res.send({success: false, error: "Ha ocurrido un error"});
        
    }

})

app.listen(PORT, () => console.log(`Corriendo el servidor por el puerto ${PORT}`))