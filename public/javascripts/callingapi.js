
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
         
         reviews.forEach(element => {
            
           // for(let i = 0; i < reviews.length; i++) {
            let restaurantReviews = reviews.filter(reviews => reviews.idRestaurants === restaurants[i].idRestaurants);
            console.log(restaurantReviews[0]);
            //let node = document.createElement('P')
        
            for(let y = 0; y < restaurantReviews.length; y++) {

            //Appending all the elements regarding reviews
            let newBlock = document.querySelector(`.media${i}`)
            let litag = document.createElement('LI');
            litag.setAttribute('class', 'media');

            let atag = document.createElement('A');
            atag.setAttribute('class', 'pull-left');
            //let newa = document.querySelector('.pull-left')
            
            let imgtag = document.createElement('IMG');
            imgtag.setAttribute('class', '.img-circle');
            imgtag.setAttribute('src','https://bootdey.com/img/Content/user_1.jpg');
            atag.appendChild(imgtag);
            //let newimg = document.querySelector('.img-circle')
            
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
            // let newComment = document.querySelector(`.comment${i}`);
           
            divtag.append(strongtag, h5tag, ptag);
            // let newUsername = document.querySelector(`.text-success${i}`);
            
            newBlock.append(atag, divtag);
            //newComment.appendChild(ptag);
           }

           i++; 
            
        });
        
    }

    getReviews();
});