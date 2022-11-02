const fs = require('fs/promises');
const express = require("express");
const app = express();

const handlebars = require('express-handlebars');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//rotas
app.get("/", (req, res) => res.render("formulario"))

app.post("/add", async (req, res) => {
    const data = req.body.beneficiarios;
    const beneficiarios = data.filter(b => b.nomeBeneficiario && b.idadeBeneficiario);

    const registroPlano = req.body.registroPlano;
    const quantidadeBeneficiarios = req.body.quantidadeBeneficiarios;

    const fileExists = await fs.stat('beneficiarios.json').then(() => true).catch(() => false);

    const fileContent = fileExists && await fs.readFile('beneficiarios.json', { encoding: 'utf-8' });
    const fileContentAsJSON = fileContent?.length ? fileContent : '[]';

    const sanitizedData = {
        registroPlano,
        quantidadeBeneficiarios,
        nomeBeneficiarios: beneficiarios.map(b => b.nomeBeneficiario),
        idadeBeneficiarios: beneficiarios.map(b => b.idadeBeneficiario),
    }
    const newData = JSON.parse(fileContentAsJSON).concat(sanitizedData);

    await fs.writeFile('beneficiarios.json', JSON.stringify(newData, null, '\t'), { encoding: 'utf-8' })

    return res.status(201).json(newData);
})

//servidor
app.listen(3000, function () {
    console.log("Servidor rodando na url: http://localhost:3000");
})

