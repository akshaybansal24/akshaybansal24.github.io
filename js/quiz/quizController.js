app.controller('quizController',['$scope','$location','$window','quizFactory',function($scope,$location,$window,quizFactory,){
	$scope.lisOfTopic=[];
	$scope.selecetdTopics = [];
	$scope.userType="";
	$scope.showTopics = true;
	$scope.hoverMsgForTopicPanel = "Select an age group first";
	$scope.disableStatQuizBtn = true;

	$scope.getListOfTopic = function(){
		quizFactory.getQuizTopics().then(
			function(response){

				console.log($scope.showTopics);
				//console.log(JSON.stringify(response.data.trivia_categories));
				for(tpc in response.data.trivia_categories){
					//console.log(JSON.stringify(response.data.trivia_categories[tpc]));
					var topic=new Object();
				topic.id="";
				topic.name="";
				topic.isSelected=false;
					topic.id = response.data.trivia_categories[tpc].id;
					topic.name = response.data.trivia_categories[tpc].name;
					topic.isSelected=false;
					//console.log(JSON.stringify(topic.id));
					$scope.lisOfTopic.push(topic);
				}
				//$scope.lisOfTopic = response.data.trivia_categories;
				//console.log(JSON.stringify($scope.lisOfTopic));
			},function(error){
				//console.log(error);
			});
	}

	$scope.startQuiz=function(){
		for(tpc in $scope.lisOfTopic){
			if($scope.lisOfTopic[tpc].isSelected == true){
				$scope.selecetdTopics.push($scope.lisOfTopic[tpc]);
			}
			//console.log($scope.selecetdTopics);
			//console.log($scope.userType);
		}
		var path = "quiz.html";
 		window.location.href = path;
	}

	$scope.startQuiz1=function(){
			//console.log($scope.selecetdTopics);
			//console.log($scope.userType);
	}

	$scope.$watch('userType',function(newValue,oldValue,scope){
		console.log(newValue);
		console.log(oldValue);
		if(newValue != undefined && newValue!=null && newValue!=''){
			console.log("here");
			$scope.showTopics = false;
			$scope.hoverMsgForTopicPanel = "";
			$scope.disableStatQuizBtn = true;
		}
		else{
			$scope.showTopics = true;
			$scope.hoverMsgForTopicPanel = "Select an age group first";
			$scope.disableStatQuizBtn = true;
		}
		if(newValue != oldValue){
			$scope.disableStatQuizBtn = true;
			$scope.selecetdTopics=[];
			for(tpc in $scope.lisOfTopic){
				$scope.lisOfTopic[tpc].isSelected = false;
			}
		}
	});

	$scope.$watch('lisOfTopic',function(newValue,oldValue,scope){
		var flag = 1;
		for(tpc in $scope.lisOfTopic){
			if($scope.lisOfTopic[tpc].isSelected==true){
				$scope.disableStatQuizBtn = false;
				flag=0;
			}
		}
		if(flag==1){
			$scope.disableStatQuizBtn = true;
		}
		console.log("Val :" + $scope.disableStatQuizBtn);
	},true);

}]);