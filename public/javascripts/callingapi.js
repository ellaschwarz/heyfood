
//Getting data from REST-API
document.addEventListener('DOMContentLoaded', (e) => {
    async function getReviews () {
        //Awaits the request of the fetch call
        let request = await fetch ('http://127.0.0.1:3000/reviews');
        //Proceeed once the first promise is resolved
        const reviews = await request.json();
        //Proceed only when the first promise is resolved

        let request2 = await fetch ('http://127.0.0.1:3000/restaurants')
        const restaurants = await request2.json();

         let i = 0;
         
         restaurants.forEach(element => {
            
            let restaurantReviews = reviews.filter(reviews => reviews.idRestaurants === restaurants[i].idRestaurants);
            console.log(restaurantReviews);
        
            for(let y = 0; y < restaurantReviews.length; y++) {

            //Appending all the elements regarding reviews
            let newBlock = document.querySelector(`.media${i}`)
            let litag = document.createElement('LI');
            litag.setAttribute('class', 'media');

            let atag = document.createElement('A');
            atag.setAttribute('class', 'pull-left');
            
            let imgtag = document.createElement('IMG');
            imgtag.setAttribute('class', '.img-circle');
            imgtag.setAttribute('src','https://bootdey.com/img/Content/user_1.jpg');
            atag.appendChild(imgtag);
            
            let divtag = document.createElement('DIV');
            divtag.setAttribute('class','media-body');
            
            //Appending username
            let strongtag = document.createElement('STRONG');
            strongtag.setAttribute('class',`text-success${i}`)
            strongtag.innerHTML = '@'+restaurantReviews[y].username;
            //newUsername.appendChild(strongtag);

            // Appending rateing
            let h5tag = document.createElement('H5');
            h5tag.setAttribute('class', `ratenumber${i}`)
            h5tag.innerHTML = 'Rate: '+ restaurantReviews[y].Rateing;
        //  let newRate = document.querySelector(`.ratenumber${i}`);
           
            //Appending comments
            let ptag = document.createElement('P');
            ptag.setAttribute('class', `.comment${i}`);
            ptag.innerHTML = JSON.stringify(restaurantReviews[y].Comment);
           
            divtag.append(strongtag, h5tag, ptag);
            
            newBlock.append(atag, divtag);
           }
           i++;    
        });   
        getAvgRateing(reviews);
    }

    getReviews();


    async function getAvgRateing (reviews){
        let request3 = await fetch('http://127.0.0.1:3000/reviews/avgrates');
        const average = await request3.json();

        let request2 = await fetch ('http://127.0.0.1:3000/restaurants');
        const restaurants = await request2.json();

        let i = 0;

        restaurants.forEach(element => {
        let averageReviews = average.filter(average => average.idRestaurants === restaurants[i].idRestaurants);
        for(let j = 0; j < averageReviews.length; j++) {
            let avg = document.querySelector(`.avgrateing${i}`);
            
            let spantag = document.createElement('SPAN');
            
            spantag.innerHTML = averageReviews[j].Avg_Rateing;
            
            avg.appendChild(spantag);
            
        }

        console.log(average);
        i++;
     });

    }

    
});