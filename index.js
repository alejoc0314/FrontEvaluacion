const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const axios = require('axios');
const port = 8081;


hbs.registerHelper('if', function (conditional, options) {
    if (conditional) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// Definición carpeta documentos estáticos
app.use(express.static('public'));

// Configuración motor de plantillas
app.set('views', path.join(__dirname + '/public/views'));

app.set('view engine', 'hbs');

// Definición ruta de documentos parciales
hbs.registerPartials(__dirname + '/public/views/partials');

app.listen(port, () => {
    console.log('listening on port ' + port);
});

// Página de login

app.get('/', (req, res) => {

    res.render('login', {
        titulo: 'CosmeTIC',
        user_name: 'Alejandro Cañas',
        consecutivo: 'Login'
    });
})

// Página de inicio

app.get('/home', (req, res) => {

    res.render('home', {
        titulo: 'CosmeTIC',
        user_name: 'Alejandro Cañas',
        consecutivo: 'Home'
    });
})

// Página de Roles

app.get('/robos', async (req, res) => {
    try {
        const url = "http://localhost:8080/api/robo";
        const response = await axios.get(url, {
            method: "GET",
            mode: "cors",
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (response.status === 200) {
            const data = response.data;
            const robos = data.robo;
            res.render('Robos/robos', {
                titulo: 'Examen | Robos',
                user_name: 'Alejandro Cañas',
                consecutivo: 'Robos',
                lista_robos: robos
            });
        } else {
            console.error("Error al obtener la lista de roles:", response.status);
            res.status(response.status).send("Error al obtener la lista de robos");
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        res.status(500).send("Error al obtener los robos");
    }
});

app.get('/registroRobos', (req, res) => {
    res.render('Robos/registroRobos', {
        titulo: 'Examen | Nuevo Robo',
        user_name: 'Alejandro Cañas',
        consecutivo: 'Registro Robos'
    });
})

app.get('/editarRobos', async (req, res) => {
    try {
        const roboId = req.query._id;
        const url = `http://localhost:8080/api/robo/getOne?_id=${roboId}`;
        const response = await axios.get(url, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });

        if (response.status === 200) {
            const robo = response.data;
            console.log(robo);
            res.render('Robos/editarRobos', {
                titulo: 'Examen | Editar Robo',
                user_name: 'Alejandro Cañas',
                consecutivo: 'Editar Roles',
                _id: roboId,
                robo: robo
            });
        } else {
            console.error('Error al obtener los datos del robo:', response.status);
            res.status(response.status).send('Error al obtener los datos del robo');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        res.status(500).send('Error al obtener el robo');
    }
});

