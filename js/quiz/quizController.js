app.controller('quizController',['$scope','$location','$window','quizFactory',function($scope,$location,$window,quizFactory,){
	$scope.lisOfTopic=[];
	$scope.selecetdTopics = [];
	$scope.userType="";
	$scope.showTopics = true;
	$scope.hoverMsgForTopicPanel = "Select an age group first";
	$scope.disableStatQuizBtn = true;

	$scope.getListOfTopic = function(){
		var usrTyp = localStorage.getItem('userType');
				if(usrTyp!=undefined && usrTyp!=null && usrTyp!=""){
					$scope.userType = usrTyp;
					localStorage.removeItem('userType');
				}
		quizFactory.getQuizTopics().then(
			function(response){
				var listOfSelectedTopic = [];
				
				
				console.log($scope.showTopics);
				//console.log(JSON.stringify(response.data.trivia_categories));
				for(tpc in response.data.trivia_categories){
					//console.log(JSON.stringify(response.data.trivia_categories[tpc]));
					var topic=new Object();
					topic.id="";
					topic.name="";
					topic.isSelected=false;
					topic.id = ""+response.data.trivia_categories[tpc].id;
					topic.name = response.data.trivia_categories[tpc].name;
					console.log("Topic Id : " + topic.id + " : " + listOfSelectedTopic.indexOf(topic.id));
					topic.isSelected=false;
					//console.log(JSON.stringify(topic.id));
					$scope.lisOfTopic.push(topic);
				}
				
				
				console.log(JSON.stringify($scope.lisOfTopic));
				//$scope.lisOfTopic = response.data.trivia_categories;
				//console.log(JSON.stringify($scope.lisOfTopic));


				var slctdTpc = localStorage.getItem('selectedTopics');
				if(slctdTpc!=undefined && slctdTpc!=null && slctdTpc!=""){
					localStorage.removeItem('selectedTopics');
					listOfSelectedTopic = slctdTpc.split(",");
					console.log(JSON.stringify(listOfSelectedTopic));
				}

				for(tpc in $scope.lisOfTopic){
					if(listOfSelectedTopic.indexOf($scope.lisOfTopic[tpc].id) >= 0){
						$scope.lisOfTopic[tpc].isSelected = true;
					}
				}

				console.log(JSON.stringify($scope.lisOfTopic));
			},function(error){
				//console.log(error);
			});
	}

	$scope.startQuiz=function(){
		var selectedId = "";
		for(tpc in $scope.lisOfTopic){
			if($scope.lisOfTopic[tpc].isSelected == true){
				selectedId = selectedId + "," + $scope.lisOfTopic[tpc].id;
				$scope.selecetdTopics.push($scope.lisOfTopic[tpc]);
			}
			//console.log($scope.selecetdTopics);
			//console.log($scope.userType);
		}

		localStorage.setItem('userType',$scope.userType);
		localStorage.setItem('selectedTopics',selectedId);
		if($scope.userType=='child'){
			var path = "child.html";
			window.location.href = path;
		}
		else{
			var path = "quiz.html";
			window.location.href = path;
		}		
 		
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