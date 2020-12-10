import axios from 'axios';


class apiServices {
    retriveContatos() {
        return new Promise((resolve, reject) => {
     		try {
     			axios.get('https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/contacts')
				  .then(function (response) {
				  	const cont = []
				  	response.forEach(doc => cont.push({name: doc.name ? doc.name : doc.notify }))
				    resolve( cont )
				  })
				  .catch(function (error) {
				    reject( error );
				  })
				  .then(function () {
				    // always executed
				  });
			    
			 } catch (error) {
			    console.error(error);
			} 
        }); 
    }
}


export { apiServices };