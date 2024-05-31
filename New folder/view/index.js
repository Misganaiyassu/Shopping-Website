
const userData = sessionStorage.userData;

if (userData == null || userData == {}) {
    window.location.href = "login.html";
}

var cart = [];
var productsGlobal;


async function getProducts() {
    const productFetch = await fetch("http://localhost:3000/products")


    const products = await productFetch.json();

    productsGlobal = products;

    return products;
}

function refreshProducts(products) {
    $('.p').remove();


    products.forEach(product => {
        if (product.stock > 0) {
            $('.products').append(createRowProduct(product));
        }
    });

    $(".add-to-cart").click(function (e) {
        e.preventDefault();
        const id = $(this).parent().parent().parent().attr('id')

        const product = productsGlobal.filter(product => {
            return product.id == id;
        })

        addToCart(product[0]);

    });
}

const init = async () => {
    refreshProducts(await getProducts());
    refreshCart();

    const data = userData.split(",");
    $('#username').text(`Welcome, ${data[0]}`)

}

const createRowProduct = (data) => {

    // inside the p that with # change that to an img tag with the data.url as src
    const row = $(`
    
        <div class="data-row p" id=${data.id}>
            <div class="column" >
                <p class="column-title">${data.name}</p>
            </div>
            <div class="column">
                <p class="column-title">${data.price}</p>
            </div>
            <div class="column">


                <p class="column-title"><img class="image" src="${data.img}"></p>
            </div>
            <div class="column">
                <p class="column-title">${data.stock}</p>
            </div>
            <div class="column">
                <p class="column-title">
                    <button class="add-to-cart">Add</button>
                </p>
            </div>
        </div>
    `)

    return row;
}

const createRowCart = (data) => {

    let str = "";


    if ($('.exist').length <= 0) {
        str +=
            ` <div class="head-row exist">
                    <div class="column">
                        <p class="column-title">Name</p>
                    </div>
                    <div class="column">
                        <p class="column-title">Price</p>
                    </div>
                    <div class="column">
                        <p class="column-title">Total</p>
                    </div>
                    <div class="column">
                        <p class="column-title">Quantity</p>
                    </div>
            </div>
        `
    }

    str += `
    <div class="data-row cart" id=${data.id}>
        <div class="column" >
            <p class="column-title">${data.name}</p>
        </div>
        <div class="column">
            <p class="column-title">${data.price}</p>
        </div>
        <div class="column">
            <p class="column-title">${data.price * data.quantity}</p>
        </div>
        <div class="column">
        <button class="remove-btn">-</button>
        <label class="quantity">${data.quantity}</label>
        <button class="add-btn">+</button>
        </div>
    </div>
`

console.log(str)
    const row = $(str);

    return row;
}

function refreshCart() {
    $(".shopping-cart").text("");
    $('.cart').remove();
    $('.row').remove();
    if (cart.length <= 0) {
        $(".shopping-cart").text("There is no Item in your shopping cart!");
        return;
    }

    cart.forEach(product => {
        $(".shopping-cart").append(createRowCart(product));
    });


    $(".shopping-cart").append(
        $(`
            <div class="row total left">
                <label for="">Total</label>
                <label for="" id="total">${calcTotal()}</label>
            </div>
        `)
    );

    $(".add-btn").click(function (e) {
        e.preventDefault(0);
        const id = $(this).parent().parent().attr('id')
        const product = cart.filter(product => {
            return product.id == id;
        })

        const productMain = productsGlobal.filter(p => {
            return p.id == id;
        })


        const stock = productMain[0].stock;

        if (product[0].quantity == stock) {
            return;
        }

        product[0].quantity += 1;
        refreshCart();
    })

    $(".remove-btn").click(function (e) {
        e.preventDefault(0);
        const id = $(this).parent().parent().attr('id')
        const product = cart.filter(product => {
            return product.id == id;
        })

        if (product[0].quantity == 1) {



            cart.splice(cart.indexOf(product[0]), 1)


        }

        product[0].quantity -= 1;
        refreshCart();
    })



}

function calcTotal() {

    let total = 0;
    cart.forEach(element => {
        total += element.quantity * element.price
    });

    return total;
}

function addToCart(product) {

    const cartP = cart.filter(cartp => {
        return product.id == cartp.id;
    })

    if (cartP.length <= 0) {
        cart.push(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }
        );
    } else {
        const productMain = productsGlobal.filter(p => {
            return product.id == p.id;
        })


        const stock = productMain[0].stock;

        if (cartP[0].quantity == stock) {
            return;
        }

        cartP[0].quantity += 1;
    }

    refreshCart();
}


init();

$('#place-order').click(async function (e) {
    e.preventDefault();

    cart.forEach(cartProduct => {

        $.get(`http://localhost:3000/update-stock?id=${cartProduct.id}&quantity=${cartProduct.quantity}&user=${sessionStorage.userData}`)

        // await fetch()
    });

    cart = [];
    refreshCart();
    refreshProducts(await getProducts());

})

$('#logout').click(function (e) {
    $.get(`http://localhost:3000/logout?user=${sessionStorage.userData}`)
    sessionStorage.removeItem('userData');
    window.location.href = "login.html";
})

