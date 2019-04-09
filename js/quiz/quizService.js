app.factory('quizFactory',['$http',function($http){

	var services={};

	services.getQuizTopics = function(){
		return $http.get('https://opentdb.com/api_category.php');
	}

	return services;
}]);