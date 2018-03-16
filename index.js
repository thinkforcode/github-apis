(function(){
	"use strict";
	 var express = require('express');
	 var bodyParser = require('body-parser');
     var port = process.env.PORT || 3000;
     var request = require('request');
     var path = require('path');
     var app = express();



   //middleware body-parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(express.static(__dirname + '/public'));
    app.use('/img',express.static(__dirname+'/public/assets/img'));
    app.use('/css',express.static(__dirname+'/public/assets/css'));
    app.use('/js',express.static(__dirname+'/public/assets/js'));
    app.use('/pages',express.static(__dirname+'/public/pages'));



    app.get('/search',function(req,res){
    	var username = req.query.username;
    	if(username){
    		request.get({
    			url:"https://api.github.com/users/"+username,
    			 headers: {
    				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
  				 }
    		},function(error,response,body){
    			if(!error){
    				if(response.body !== undefined && response.body !== null){
    					var t = JSON.parse(response.body);
    					var repo_url = t['repos_url'];
    					var final = {};
    					console.log(t['repos_url']);	
    					
    					request.get({
    						url:repo_url,
    						 headers: {
							      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
							 }
    					},function(err2,res2,b2){
    						if(!err2){
    							try{
    								if(res2.body !== undefined && res2.body !== null){
    									final['user_repos'] = JSON.parse(res2.body);
    									final['user_details'] = JSON.parse(response.body);
    									res.send(final);
    								}
    							}catch(e){
    								res.send({message:e});
    							}
    							
    						}else{
    							res.send({message:err2});
    						}
    					});
    				}else{
    					res.send({
    						message:"could not find the username"
    					})
    				}
    			}
    		});
    	}else{
    		res.send({
    			message:"username is required"
    		})
    	}
    });	

    app.get('/home' , function(req,res){
    	res.sendFile(__dirname + '/public/pages/home.html');
    });

     //creating server
     app.listen(port , function(){
     	console.log("server running on the port:" +port);
     });

})();