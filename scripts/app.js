var app = angular.module('introduction', ["firebase","ngStorage"]);

app.controller("main", ["$scope","$firebaseArray","$localStorage","$timeout",
	function($scope,$firebaseArray,$localStorage,$timeout) {
		var ref = new Firebase("https://poltest.firebaseio.com/students");
		
		// $scope.dataStudent =  $firebaseArray(ref).;
		// -----------------------
		// maquetacion de componentes en la vista unidades del modulo docente
		var refUser = new Firebase("https://poltest.firebaseio.com/user");
		var refNick = new Firebase("https://poltest.firebaseio.com/nicknames");
		var refGodfathers = new Firebase("https://poltest.firebaseio.com/godfathers");
		var nicks = $firebaseArray(refNick);
		var Godfathers = $firebaseArray(refGodfathers);

		$scope.viewUser = false;
		$scope.studentEdit = 0;
		$scope.loadUser = function (item,index) {
			$scope.temp = item;
			$scope.studentEdit = index;
			$scope.viewUser = !$scope.viewUser;
		}
		$scope.saveStudent = function (item) {
			console.log($scope.studentEdit);
			students.$save($scope.studentEdit);
			$scope.viewUser = false;
		}
// asignate nick
		$scope.viewAsignateNick = false;
		$scope.tempNick = {};
		$scope.asignateNick = function (item,index) {
			$scope.apodo = '';
			$scope.viewAsignateNick = true;
			$scope.tempNick = item;
			$scope.studentEdit = index;
			var numRandom = Math.floor((Math.random() * 4) + 1);
			$timeout(function() {
				var numNick = Math.floor((Math.random() * nicks.length) + 1);
				$scope.apodo = nicks[numNick-1].name;
				// $scope.viewAsignateNick = false;
				item["nickAsigned"] = true;
				item["nickName"] = nicks[numNick-1].name;
				$scope.image = nicks[numNick-1].url;
				students.$save($scope.studentEdit);
			}, numRandom*1000);
		}
		$scope.resetNick = function () {
			$scope.viewAsignateNick = false;
			$scope.apodo = '';
		}
// asignate godfather
		$scope.viewAsignateGodf = false;
		$scope.tempGod = {};
		$scope.asignateGodf = function (item,index) {
			$scope.viewAsignateGodf = true;
			$scope.tempGod = item;
			$scope.studentEdit = index;
			var numRandom = Math.floor((Math.random() * 4) + 1);
			$timeout(function() {
				var numGodf = Math.floor((Math.random() * Godfathers.length) + 1);
				$scope.padrino = Godfathers[numGodf-1].first_name+" "+Godfathers[numGodf-1].last_name0+" "+Godfathers[numGodf-1].last_name1;
				item["godfAsigned"] = true;
				item["godfName"] = Godfathers[numGodf-1].first_name+" "+Godfathers[numGodf-1].last_name0+" "+Godfathers[numGodf-1].last_name1;
				students.$save($scope.studentEdit);
			}, numRandom*1000);
		}
		$scope.resetgf = function () {
			$scope.viewAsignateGodf = false;
			$scope.apodo = '';
		}


		$scope.validateUser = function (e) {
			if (e.keyCode === 13 && $scope.user.name) {
              console.log("Creando...");
              // refUser.$child($localStorage.counter.id).$child("name").$set($scope.user.name);
              console.log($localStorage.counter);
            	$scope.user.name = "";
				$scope.viewUser = false;
            }
		}
		if (!$localStorage.counter) {
			var user = $firebaseArray(refUser);
			console.info("creando usuario");			
			var userNew = {
				id : "",
				name: "",
				sesions: 0,
			};
			user.$add(userNew).then(function(ref) {
				$localStorage.counter = {
					id: ref.key(),
					name:'',
					sesions:0,
				};
				console.info("usuario creado con id " + ref.key());
				// list.$indexFor(id);
			});
		}else{
			console.info("usuario registrado :)");
			$scope.viewUser = false;			
		}

		$scope.start = false;
		var students = $firebaseArray(ref);
		console.log('cargando...');
		students.$loaded()
			.then(function(data) {
				$scope.start = true;
				$scope.students = data;
				console.log('datos listos');
			})
			.catch(function(error) {
				console.log("Error:", error);
			});
		// others
		$scope.studentView = false;
		$scope.nicknameView = false;
		$scope.godfatherView = false;
		$scope.mainView = true;
		$scope.changeView = function (val) {
			$scope.studentView = false;
			$scope.nicknameView = false;
			$scope.godfatherView = false;
			$scope.mainView = false;
			$scope[val] = true;
		}
	}
]);
app.controller("student", ["$scope", "$firebaseArray","$timeout",
	function($scope, $firebaseArray, $timeout) {
		var ref = new Firebase("https://poltest.firebaseio.com/students").orderByChild('last_name0');
		$scope.students = "s";
		$scope.students = $firebaseArray(ref);
		$scope.messageAddView=false;
		$scope.viewSearch=false;
		$scope.addStudentComp = false;
		$scope.changeViewAdd = function () {
			$scope.addStudentComp = true;
		}
		$scope.smsAdd = "";
		$scope.addStudent = function(obj) {
			obj["godfAsigned"] = false;
			obj["godfName"] = "";
			obj["nickAsigned"] = false;
			obj["nickName"] = "";
			// obj.push({godf:{asigned:false,name:""},nickName:{asigned:false,name:""}});
			if (obj.code.length == 10) {
				if (obj.code.search('[a-b]') == -1) {
					if ($scope.newUser.first_name.search('[0-9]') == -1 && $scope.newUser.last_name0.search('[0-9]') == -1 && $scope.newUser.last_name1.search('[0-9]') == -1) {
						$scope.students.$add(obj);
						// reiniciar
						$scope.newUser.code = "";
						$scope.newUser.first_name = "";
						$scope.newUser.last_name0 = "";
						$scope.newUser.last_name1 = "";
						$scope.smsAdd = "creado...";
						$timeout(function() {
							$scope.smsAdd = "";
						}, 1000);
					}else{
						$scope.smsAdd = "el nombre no debe tener numeros"
						$timeout(function() {
							$scope.smsAdd = "";
						}, 2000);
					}
				}else{
					$scope.smsAdd = "El código no debe tener letras"
					$timeout(function() {
						$scope.smsAdd = "";
					}, 2000);
				}
			}else{
				$scope.smsAdd = "El código debe tener 10 digitos"
				$timeout(function() {
					$scope.smsAdd = "";
				}, 2000);
			}
		};
		$scope.deleteStudent = function(val) {
			$scope.students.$remove(val);
		};

	}
]);



app.controller("nickname", ["$scope", "$firebaseArray","$timeout",
	function($scope, $firebaseArray, $timeout) {
		var ref = new Firebase("https://poltest.firebaseio.com/nicknames");
		$scope.nicknames = {};
		$scope.nicknames = $firebaseArray(ref);
		$scope.messageAddView=false;
		$scope.viewSearch=false;
		$scope.addNickView = false;
		$scope.changeViewAdd = function () {
			$scope.addNickView = true;
		}
		$scope.smsAdd = "";
		$scope.addNick = function(obj) {
			// obj.push({godf:{asigned:false,name:""},nickName:{asigned:false,name:""}});
			if (obj.name.length > 3) {
					if (obj.description.length > 10) {
						$scope.nicknames.$add(obj);
						// reiniciar
						$scope.newNick.name = "";
						$scope.newNick.description = "";
						$scope.newNick.url = "";
						$scope.smsAdd = "nick creado...";
						$timeout(function() {
							$scope.smsAdd = "";
						}, 1000);
					}else{
						$scope.smsAdd = "la descripcion es corta"
						$timeout(function() {
							$scope.smsAdd = "";
						}, 2000);
					}
				
			}else{
				$scope.smsAdd = "El nombre es corto"
				$timeout(function() {
					$scope.smsAdd = "";
				}, 2000);
			}
		};
		$scope.deleteNick = function(val) {
			$scope.nicknames.$remove(val);
		};

	}
]);

app.controller("godfather", ["$scope", "$firebaseArray","$timeout",
	function($scope, $firebaseArray, $timeout) {
		var ref = new Firebase("https://poltest.firebaseio.com/godfathers");
		$scope.godfathers = {};
		$scope.godfathers = $firebaseArray(ref);
		$scope.messageAddView=false;
		$scope.viewSearch=false;
		$scope.addGodFatherView = false;
		$scope.changeViewAdd = function () {
			$scope.addGodFatherView = true;
		}
		$scope.smsAdd = "";
		$scope.addGodFather = function(obj) {
			// obj.push({godf:{asigned:false,name:""},nickName:{asigned:false,name:""}});
			if (obj.position.length > 3) {
				if (obj.first_name.search('[0-9]') == -1 && obj.last_name0.search('[0-9]') == -1 && obj.last_name1.search('[0-9]') == -1) {
					$scope.godfathers.$add(obj).then(function(ref) {
						var id = ref.key();
						$scope.smsAdd = "padrino creado...";
						$timeout(function() {
							$scope.smsAdd = "";
						}, 1000);
						// console.log("added record with id" + id);
						// list.$indexFor(id);
					});
					// reiniciar
					$scope.newGod.position = "";
					$scope.newGod.first_name = "";
					$scope.newGod.last_name0 = "";
					$scope.newGod.last_name1 = "";
				}else{
					$scope.smsAdd = "el nombre no debe tener números"
					$timeout(function() {
						$scope.smsAdd = "";
					}, 2000);
				}
			}else{
				$scope.smsAdd = "El cargo es corto o no está bien"
				$timeout(function() {
					$scope.smsAdd = "";
				}, 2000);
			}
		};
		$scope.deletegodfather = function(val) {
			$scope.godfathers.$remove(val);
		};
	}
]);