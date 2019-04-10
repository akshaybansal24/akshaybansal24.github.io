
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
	$scope.total;
	$scope.unansweredQuestions;
	$scope.wrongAnswers;
	$scope.percentage;
	$scope.messageToDisplayForResult;
	$scope.isDifficultyChanged = false;
	$scope.messageForDiffilcultyChange;


	$scope.onLoad = function(){
		$scope.messageToDisplayForResult = "";
		$scope.isDifficultyChanged = false;
		$scope.messageForDiffilcultyChange = "";
		$scope.total = 0;
		$scope.unansweredQuestions = 0;
		$scope.wrongAnswers = 0;
		$scope.userType = localStorage.getItem('userType');
		var listOfSelectedTopics = localStorage.getItem('selectedTopics');
		var splitSelectedTopics = listOfSelectedTopics.split(",");
		$scope.selectedTopics = splitSelectedTopics[1];
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="child"){
			$scope.isAdult = false;
			$scope.difficultyLevel = "easy";
			document.getElementById("ch").style.backgroundColor = "#FF662D";
			document.getElementById("cb").style.backgroundColor = "#B95935";
			document.getElementById("cf").style.backgroundColor = "#FF662D";
			document.getElementById("ch1").style.backgroundColor = "#FF662D";
			document.getElementById("cb1").style.backgroundColor = "#B95935";
			document.getElementById("cf1").style.backgroundColor = "#FF662D";
		}
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="teen"){
			$scope.isAdult = false;
			$scope.difficultyLevel = "medium";
			document.getElementById("ch").style.backgroundColor = "#b29d92";
			document.getElementById("cb").style.backgroundColor = "#e2cec3";
			document.getElementById("cf").style.backgroundColor = "#b29d92";
			document.getElementById("ch1").style.backgroundColor = "#b29d92";
			document.getElementById("cb1").style.backgroundColor = "#e2cec3";
			document.getElementById("cf1").style.backgroundColor = "#b29d92";
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
		quizFactory.getQuizQuestions($scope.selectedTopics,$scope.difficultyLevel,$scope.sessionToken,$scope.userType).then(
			function(response){
				console.log(JSON.stringify(response.data.results));
				for(question in response.data.results){

					var questionAnswer = response.data.results[question];
					var questionAnswerToAdd = {};
					//console.log(JSON.stringify(questionAnswer));
					questionAnswerToAdd.question = convertHtmlToText(questionAnswer.question);
					questionAnswerToAdd.correctAnswer = convertHtmlToText(questionAnswer.correct_answer);
					//console.log(JSON.stringify(questionAnswerToAdd.correctAnswer));
					var options = [];
					options.push(questionAnswer.correct_answer);
					for(option in questionAnswer.incorrect_answers){
						options.push(convertHtmlToText(questionAnswer.incorrect_answers[option]));
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

	$scope.endQuiz = function(){
		$scope.listOfQuestionAnswer[$scope.currentQuestionNumber].givenAnswer = $scope.givenAnswer;
		$scope.listOfQuestionAnswer[$scope.currentQuestionNumber].isHintUsed = $scope.isHintUsed;
		for(question in $scope.listOfQuestionAnswer){
			if($scope.listOfQuestionAnswer[question].correctAnswer == $scope.listOfQuestionAnswer[question].givenAnswer){
				$scope.total = $scope.total+1;
			}
			else if($scope.listOfQuestionAnswer[question].givenAnswer == undefined || $scope.listOfQuestionAnswer[question].givenAnswer==null || $scope.listOfQuestionAnswer[question].givenAnswer==""){
				$scope.unansweredQuestions = $scope.unansweredQuestions + 1;
			}
			else{
				$scope.wrongAnswers = $scope.wrongAnswers + 1;
			}
		}

		console.log($scope.total);
		console.log($scope.unansweredQuestions);
		console.log($scope.wrongAnswers);
		$scope.isResultTab = true;
		$scope.percentage = ($scope.total/10)*100;
		if($scope.userType=="child"){

			if($scope.percentage>=80){
				$scope.messageToDisplayForResult = "Congratulations and Celebrations!!! You scored " + $scope.percentage + "% in the quiz";
				var oldLevel = $scope.difficultyLevel;
				if($scope.difficultyLevel=="easy")
					$scope.difficultyLevel = "medium";
				else
					$scope.difficultyLevel = "hard";
				if(oldLevel!=$scope.difficultyLevel){
					$scope.isDifficultyChanged = true;
					$scope.messageForDiffilcultyChange = "You have made progress from "+oldLevel + " to " +  $scope.difficultyLevel+ " level.";
				}
			}
			if($scope.percentage<80 && $scope.percentage>=60){
				$scope.messageToDisplayForResult = "Champion in progress!!! You scored " + $scope.percentage + "% in the quiz";
			}
			if($scope.percentage<60){
				$scope.messageToDisplayForResult = "Don't worry, you will do better next time!!! You scored " + $scope.percentage + "% in the quiz";
			}
		}
		if($scope.userType=="teen"){
			var oldLevel = $scope.difficultyLevel;
			if($scope.percentage>=80){
				$scope.messageToDisplayForResult = "Outstanding!!! You scored " + $scope.percentage + "% in the quiz";
				$scope.difficultyLevel = "hard";
			}
			if($scope.percentage<80 && $scope.percentage>=60){
				$scope.messageToDisplayForResult = "Good Job!!! You scored " + $scope.percentage + "% in the quiz";
				$scope.difficultyLevel = "medium";
			}
			if($scope.percentage<60){
				$scope.messageToDisplayForResult = "Need some more efforts!!! You scored " + $scope.percentage + "% in the quiz";
				$scope.difficultyLevel = "easy";
			}
			if(oldLevel!=$scope.difficultyLevel){
				$scope.isDifficultyChanged = true;
				$scope.messageForDiffilcultyChange = "Your difficulty level is changed from "+oldLevel + " to " +  $scope.difficultyLevel;
			}
		}
		if($scope.userType=="adult"){
			var oldLevel = $scope.difficultyLevel;
			$scope.messageToDisplayForResult = "You have scored " + $scope.percentage + " in the quiz";
			if($scope.percentage>=80){
				$scope.difficultyLevel = "hard";
			}
			if($scope.percentage<80 && $scope.percentage>=60){
				$scope.difficultyLevel = "medium";
			}
			if($scope.percentage<60){
				$scope.difficultyLevel = "easy";
			}
			if(oldLevel!=$scope.difficultyLevel){
				$scope.isDifficultyChanged = true;
				$scope.messageForDiffilcultyChange = "Your difficulty level is changed from "+oldLevel + " to " +  $scope.difficultyLevel;
			}
		}
	}

	var convertHtmlToText = function(html){
		var txt = document.createElement("textarea");
    	txt.innerHTML = html;
    	return txt.value;
	}

	$scope.restartQuiz = function(){
		console.log("i can come here");
		$scope.disablePrevBtn = true;
		$scope.disableNextBtn = false;
		$scope.listOfQuestionAnswer = [];
		$scope.isHintUsed = false;
		$scope.isAdult = false;
		$scope.isResultTab = false;
		$scope.messageToDisplayForResult = "";
		$scope.isDifficultyChanged = false;
		$scope.messageForDiffilcultyChange = "";
		$scope.total = 0;
		$scope.unansweredQuestions = 0;
		$scope.wrongAnswers = 0;
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="child"){
			$scope.isAdult = false;
			document.getElementById("ch").style.backgroundColor = "#FF662D";
			document.getElementById("cb").style.backgroundColor = "#B95935";
			document.getElementById("cf").style.backgroundColor = "#FF662D";
			document.getElementById("ch1").style.backgroundColor = "#FF662D";
			document.getElementById("cb1").style.backgroundColor = "#B95935";
			document.getElementById("cf1").style.backgroundColor = "#FF662D";
		}
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="teen"){
			$scope.isAdult = false;
			document.getElementById("ch").style.backgroundColor = "#b29d92";
			document.getElementById("cb").style.backgroundColor = "#e2cec3";
			document.getElementById("cf").style.backgroundColor = "#b29d92";
			document.getElementById("ch1").style.backgroundColor = "#b29d92";
			document.getElementById("cb1").style.backgroundColor = "#e2cec3";
			document.getElementById("cf1").style.backgroundColor = "#b29d92";
		}
		if($scope.userType!=undefined && $scope.userType!=null && $scope.userType=="adult"){
			$scope.isAdult = true;
		}
		$scope.numOfQuestions = 10;
		$scope.currentQuestionNumber = 0;

		getSessionToken();
	}

}]);