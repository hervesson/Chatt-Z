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
			 } catch (error) {
			    console.error(error);
			} 
        }); 
    }

    sendMessages(messageObj, reference) {
    	return new Promise((resolve, reject) => {
	        try {
	     		var xhr = new XMLHttpRequest();

				xhr.open('POST', 'https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/send-messages');

				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.send(JSON.stringify({ "phone": reference , "message": messageObj.message }));
				xhr.onreadystatechange = function() {
    				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	    				axios.get("https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/queue")
						.then(function (response) {
							resolve( response )
						}).catch(function (error) {
							reject( error );
						})
			    	}
				}
			} catch (error) {
				reject(false)
				console.log(error);
			}
		})	
	}

	sendImagem(image, reference, legenda) {
		return new Promise((resolve, reject) => {
	        try {
	     		var xhr = new XMLHttpRequest();

				xhr.open('POST', 'https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/send-image');

				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.send(JSON.stringify({ "phone": reference , "image": image.url, "caption":legenda }));
				xhr.onreadystatechange = function() {
	    			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		    			axios.get("https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/queue")
						.then(function (response) {
							resolve( response )
						}).catch(function (error) {
							reject( error );
						})
				    }
				}
			} catch (error) {
				reject(false)
				console.log(error);
			}
		})	
	}

	sendAudio(audio, reference) {
		return new Promise((resolve, reject) => {
	        try {
	     		var xhr = new XMLHttpRequest();

				xhr.open('POST', 'https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/send-audio');

				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.send(JSON.stringify({ "phone": reference , "audio": audio.url }));
				xhr.onreadystatechange = function() {
	    			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		    			axios.get("https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/queue")
						.then(function (response) {
							resolve( response )
						}).catch(function (error) {
							reject( error );
						})
				    }
				}
			} catch (error) {
				reject(false)
				console.log(error);
			}
		})		
	}

	sendDocument(documento, reference, fileName) {
		return new Promise((resolve, reject) => {
	        try {
	     		var xhr = new XMLHttpRequest();

				xhr.open('POST', 'https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/send-document/pdf');

				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.send(JSON.stringify({ "phone": reference , "document": documento.url, "fileName": fileName}));
				xhr.onreadystatechange = function() {
	    			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		    			axios.get("https://api.z-api.io/instances/38D8CC84406F2021E634BE6CF1A401E6/token/5472C5514B387077FE149946/queue")
						.then(function (response) {
							resolve( response )
						}).catch(function (error) {
							reject( error );
						})
				    }
				}
			} catch (error) {
				reject(false)
				console.log(error);
			}
		})	
	}	
}


export { apiServices };