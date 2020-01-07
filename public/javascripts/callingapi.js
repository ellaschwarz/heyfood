//Get data from REST-API

document.addEventListener('DOMContentLoaded', (e) => {
    async function getRestaurants () {
        //Awaits the request of the fetch call
        let request = await fetch ('http://127.0.0.1:3000/restaurants');
        //Proceeed once the first promise is resolved
        let restaurants = await request.json();
        //Proceed only when the first promise is resolved
        console.log(restaurants);

        document.getElementById('navrest').innerHTML = restaurants[2].Name;


        return restaurants;
    }

    getRestaurants();
})