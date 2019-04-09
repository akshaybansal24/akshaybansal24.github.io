app.controller('quizController',['$scope','$location','$window','quizFactory',function($scope,$location,$window,quizFactory,){
	$scope.lisOfTopic=[];
	$scope.selecetdTopics = [];
	$scope.check = "Welcome";

	$scope.getListOfTopic = function(){
		quizFactory.getQuizTopics().then(
			function(response){

				
				console.log(JSON.stringify(response.data.trivia_categories));
				for(tpc in response.data.trivia_categories){
					console.log(JSON.stringify(response.data.trivia_categories[tpc]));
					var topic=new Object();
				topic.id="";
				topic.name="";
				topic.isSelected=false;
					topic.id = response.data.trivia_categories[tpc].id;
					topic.name = response.data.trivia_categories[tpc].name;
					topic.isSelected=false;
					console.log(JSON.stringify(topic.id));
					$scope.lisOfTopic.push(topic);
				}
				//$scope.lisOfTopic = response.data.trivia_categories;
				console.log(JSON.stringify($scope.lisOfTopic));
			},function(error){
				console.log(error);
			});
	}

	$scope.startQuiz=function(){
		console.log($scope.lisOfTopic);
		var path = "quiz.html";
 		window.location.href = path;
	}

}]);