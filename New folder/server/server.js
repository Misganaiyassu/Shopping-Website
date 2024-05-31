const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const users = [
    {
        id: 1,
        username: "admin",
        password: "admin"
    },
    {
        id: 2,
        username: "admin1",
        password: "admin2"
    }
]

const products = [
    {
        id: 1,
        price: 9,
        name: "Banana",
        stock: 15,
        img: "https://www.gepaghana.org/cms/wp-content/uploads/2017/04/banana.jpg"
    },
    {
        id: 2,
        price: 8,
        name: "Orange",
        stock: 15,
        img: "https://media.istockphoto.com/photos/orange-fruit-isolated-on-white-picture-id477836156?k=6&m=477836156&s=612x612&w=0&h=so0IENCIE95_bgdadhstzVSBoAOqEyAnwr1TirAXdsY="
    },
    {
        id: 3,
        price: 8,
        name: "Mango",
        stock: 10,
        img: "https://weknowyourdreams.com/images/mango/mango-04.jpg"
    },
    {
        id: 4,
        price: 10,
        name: "apple",
        stock: 10,
        img: "https://www.applesfromny.com/wp-content/uploads/2020/05/20Ounce_NYAS-Apples2.png"
    },
    {
        id: 5,
        price: 7,
        name: "Grape",
        stock: 15,
        img: "https://weknowyourdreams.com/images/grapes/grapes-02.jpg"
    },

]


const app = express();

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));


var loggedIn = [];


app.get("/", (req, res) => {
    res.send("hello");
})

app.get("/update-stock", (req, res) => {
    const query = req.query;

    console.log(query)


    if (loggedIn.indexOf(query.user) != -1) {
        const product = products.filter(product => {
            return query.id == product.id;
        })


        product[0].stock -= Number(query.quantity);


        res.status(200);
    }

    res.status(400);

})

app.post("/login", (req, res) => {
    const logInInfo = req.body;
    let response = null;
    let status = 200;

    const user = users.filter(user => {
        return user.username == logInInfo.username && user.password == logInInfo.password
    })

    if (user.length > 0) {

        const data = `${user[0].username},${Date.now()}`

        loggedIn.push(data)


        response = data;
    } else {
        response = "Error, User could not be found.";
        status = 404;
    }


    res.setHeader('Content-Type', 'application/json');

    console.log(user)

    res.status(status).json({ status, response })

})

app.get("/logout", (req, res) => {
    const user = req.query.user;
    loggedIn.splice(loggedIn.indexOf(user), 1);
    res.status(200);
})

app.get("/products", (req, res) => {
    res.json(products)
})

app.listen(3000, () => {
    console.log("http://localhost:3000")
})