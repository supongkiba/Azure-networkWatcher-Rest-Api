const http = require('http');
const https = require("https");
var request  = require('request');
var validUrl = require('valid-url');


//Initialization
var client_id='adcb6ff4-b0ab-4b09-960c-b36efb1404a3';
var client_secret='A69EWJOS86Y4tFFBieMD7TG9NtCYKnZW24iAZnmvA90=';
var tenant_id='263f1b53-bafb-442a-8d18-78a138d81a60';
var subs_id='8ab15bba-509e-4b43-8c3d-84de9f4e3e06';
var nwatcher_name='NetworkWatcher_eastus';
var src_rsc_id='/subscriptions/8ab15bba-509e-4b43-8c3d-84de9f4e3e06/resourceGroups/myresource/providers/Microsoft.Compute/virtualMachines/vm1';
var src_port= 443;
var dest_addr='https://login.microsoftonline.com/';
var dest_port=0;



	//Create object for generating token
	var TokenGen = {
		uri: 'https://login.microsoftonline.com/'+tenant_id+'/oauth2/token',
	  	method: 'POST',
	  	headers: {
	      	'Content-Type': 'application/x-www-form-urlencoded',
	      	'Accept': 'application/json',
	  	},

	  	form:'grant_type=client_credentials&client_id='+client_id+'&client_secret='+client_secret+'&resource=https://management.core.windows.net/'

	};

		//Genereate the token
request(TokenGen, function(error, response, body) {
	  
		if(error){
			console.log(error)
			   	}
	  	else{
	  		var regExpression = new RegExp('access_token":"(.*?)"');
			var apiToken  = body.match(regExpression);
		 	console.log('Token: '+apiToken[1]);
			//console.log(response.statusCode);
	  	}


		//Request body for Checking connectivity
		var reqData={
	
		'destination': {
  				'address': dest_addr,
 				 'port':src_port
 					 },
		'source': {
				'resourceId': src_rsc_id,
 				'port': dest_port
 				 }

		}

		//Create object for Checking connectivity
		var connect={
				uri: 'https://management.azure.com/subscriptions/'+subs_id+'/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/'+nwatcher_name+'/connectivityCheck?api-version=2018-02-01',
				method: 'POST',
				headers: {
					'Authorization':'Bearer '+apiToken[1],
					'Content-type':'application/json'

							},
				json: reqData
				};

		//Request for Checking connectivity			
	request(connect, function(error, response, body) {
	  
		if(error){
			console.log(error)
			   	}
	  	else{
	  	
			console.log("---------------------------------------\n");
			console.log('Status: '+response.statusCode);
			var location=response.headers['location'];
			console.log('Result Location: '+location);

	  	}

 		var perfData={
				uri: location,
				method: 'GET',
				headers: {
					'Authorization':'Bearer '+apiToken[1],
					'Content-type':'application/json'

							}
				};


			setTimeout(function () {
 			//Get the result
			request(perfData, function(error, response, body) {
	  
				if(error){
						console.log(error)
			   		}
				else
					{
	  					console.log(body);
					}
	   			});	
			}, 120000)




	});

	
});

