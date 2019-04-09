
app.controller('questionController',['$scope','$location','$window','quizFactory',function($scope,$location,$window,quizFactory,){
	
	$scope.userType = localStorage.getItem('userType');
	$scope.selectedTopics;
	$scope.selectedTopicsForChange =  localStorage.getItem('selectedTopics');
	$scope.difficultyLevel = "";
	$scope.numOfQuestions;
	$scope.currentQuestionNumber;
	$scope.currentQuestion;
	$scope.currentQuestionAnswer;
	$scope.allOptionsCurrentQuestion;
	$scope.sessionToken;
	$scope.givenAnswer;
	$scope.isAdult = false;
	$scope.isResultTab = false;
	$scope.listOfQuestionAnswer = [];
	$scope.isHintUsed = false;
	console.log($scope.userType);
	console.log($scope.selectedTopics);
	$scope.disablePrevBtn = true;
	$scope.disableNextBtn = false;

	$scope.onLoad = function(){
		$scope.userType = localStorage.getItem('userType');
		var listOfSelectedTopics = localStorage.getItem('selectedTopics');
		var splitSelectedTopics = listOfSelectedTopics.split(",");
		$scope.selectedTopics = splitSelectedTopics[1];
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="child"){
			$scope.isAdult = false;
			$scope.difficultyLevel = "easy";
		}
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="teen"){
			$scope.isAdult = false;
			$scope.difficultyLevel = "medium";
		}
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="adult"){
			$scope.isAdult = true;
			$scope.difficultyLevel = "hard";
		}
		$scope.numOfQuestions = 10;
		$scope.currentQuestionNumber = 0;

		getSessionToken();
		
	}

	var getSessionToken = function(){
		quizFactory.getSessionToken().then(
			function(response){

				console.log(JSON.stringify(response.data.token));
				$scope.sessionToken = response.data.token;
				getQuizQuestions();
			},function(error){
				//console.log(error);
			});
	}

	var getQuizQuestions = function(){
		quizFactory.getQuizQuestions($scope.selectedTopics,$scope.difficultyLevel,$scope.sessionToken).then(
			function(response){
				console.log(JSON.stringify(response.data.results));
				for(question in response.data.results){

					var questionAnswer = response.data.results[question];
					var questionAnswerToAdd = {};
					//console.log(JSON.stringify(questionAnswer));
					questionAnswerToAdd.question = questionAnswer.question;
					questionAnswerToAdd.correctAnswer = questionAnswer.correct_answer;
					//console.log(JSON.stringify(questionAnswerToAdd.correctAnswer));
					var options = [];
					options.push(questionAnswer.correct_answer);
					for(option in questionAnswer.incorrect_answers){
						options.push(questionAnswer.incorrect_answers[option]);
					}
					questionAnswerToAdd.answerOptions = options;
					questionAnswerToAdd.givenAnswer = "";
					questionAnswerToAdd.isHintUsed = false;
					$scope.listOfQuestionAnswer.push(questionAnswerToAdd);

				}
				console.log($scope.listOfQuestionAnswer);
				var copyObject = Object.assign({}, $scope.listOfQuestionAnswer);
				$scope.currentQuestion = copyObject[$scope.currentQuestionNumber].question;
				$scope.currentQuestionAnswer = copyObject[$scope.currentQuestionNumber].correctAnswer;
				$scope.allOptionsCurrentQuestion = copyObject[$scope.currentQuestionNumber].answerOptions;
				$scope.givenAnswer = copyObject[$scope.currentQuestionNumber].givenAnswer;
				$scope.isHintUsed = copyObject[$scope.currentQuestionNumber].isHintUsed;
				console.log($scope.currentQuestion);
				console.log($scope.currentQuestionAnswer);
				console.log($scope.allOptionsCurrentQuestion);
			},function(error){

			});
	}

	$scope.showHint = function(){
		$scope.isAdult = false;
		$scope.isHintUsed = true;
	}

	$scope.nextQuestion = function(){

		console.log($scope.givenAnswer);
		$scope.listOfQuestionAnswer[$scope.currentQuestionNumber].givenAnswer = $scope.givenAnswer;
		$scope.listOfQuestionAnswer[$scope.currentQuestionNumber].isHintUsed = $scope.isHintUsed;
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="adult"){
			$scope.isAdult = true;
			$scope.difficultyLevel = "hard";
		}
		console.log("\n\nafter question: ");
		console.log(JSON.stringify($scope.listOfQuestionAnswer[$scope.currentQuestionNumber]));
		$scope.currentQuestionNumber = $scope.currentQuestionNumber+1;
		console.log("\n\nnext question: ");
		console.log(JSON.stringify($scope.listOfQuestionAnswer[$scope.currentQuestionNumber]));
		if($scope.currentQuestionNumber>=0 && $scope.currentQuestionNumber<=9){
			$scope.currentQuestion = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].question;
			$scope.currentQuestionAnswer = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].correctAnswer;
			$scope.allOptionsCurrentQuestion = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].answerOptions;
			$scope.givenAnswer = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].givenAnswer;
			$scope.isHintUsed = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].isHintUsed;
		}
		
		if($scope.currentQuestionNumber>=1){
			$scope.disablePrevBtn = false;
		}
		if($scope.currentQuestionNumber==9){
			$scope.disableNextBtn = true;
		}
	}

	$scope.prevQuestion = function(){
		$scope.listOfQuestionAnswer[$scope.currentQuestionNumber].givenAnswer = $scope.givenAnswer;
		$scope.listOfQuestionAnswer[$scope.currentQuestionNumber].isHintUsed = $scope.isHintUsed;
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="adult"){
			$scope.isAdult = true;
			$scope.difficultyLevel = "hard";
		}
		$scope.currentQuestionNumber = $scope.currentQuestionNumber-1;
		console.log("\n\prev question: ");
		console.log(JSON.stringify($scope.listOfQuestionAnswer[$scope.currentQuestionNumber]));
		if($scope.currentQuestionNumber>=0 && $scope.currentQuestionNumber<=9){
			$scope.currentQuestion = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].question;
			$scope.currentQuestionAnswer = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].correctAnswer;
			$scope.allOptionsCurrentQuestion = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].answerOptions;
			$scope.givenAnswer = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].givenAnswer;
			$scope.isHintUsed = $scope.listOfQuestionAnswer[$scope.currentQuestionNumber].isHintUsed;
		}
		if($scope.currentQuestionNumber==0){
			$scope.disablePrevBtn = true;
		}
		if($scope.currentQuestionNumber<9){
			$scope.disableNextBtn = false;
		}
	}

	$scope.changeQuizTopic = function(){

		localStorage.setItem('userType',$scope.userType);
		localStorage.setItem('selectedTopics',$scope.selectedTopicsForChange);
		var path = "index.html";
 		window.location.href = path;
	}

}]);