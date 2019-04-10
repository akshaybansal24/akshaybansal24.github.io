app.factory('quizFactory',['$http',function($http){

	var services={};

	services.getQuizTopics = function(){
		return $http.get('https://opentdb.com/api_category.php');
	}

	services.getSessionToken = function(){
		return $http.get('https://opentdb.com/api_token.php?command=request');
	}

	services.getQuizQuestions = function(quizTopic,difficultyLevel,sessionToken,userType){
		if(userType=='adult'){
			return $http.get('https://opentdb.com/api.php?amount=10&type=multiple&category='+quizTopic+'&difficulty='+difficultyLevel+'&token='+sessionToken);
		}
		else{
			return $http.get('https://opentdb.com/api.php?amount=10&category='+quizTopic+'&difficulty='+difficultyLevel+'&token='+sessionToken);
		}
		
	}

	return services;
}]);