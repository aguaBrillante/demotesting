"use strict"; 

let interpretationText = "<p>Интерпретация:</p><p>Максимальный бал А: вы не часто пользуетесь качеством ассертивности в жизни. Вы часто испытываете недовольство собой и окружающими и бывает, что не хватает уверенности для реализации своих интересов. Вам нужно тренировать инициативность и стойкость.</p><p>Максимальный бал Б: вы на правильном пути и можете очень хорошо овладеть ассертивностью. Временами ваши попытки действовать ассертивно выливаются в агрессивность. Поиск золотой середины при проявлении инициативы и силы помогут вам развить навыки ассертивности.</p> <p>Максимальный бал В: в принципе, вы уже сейчас способны действовать ассертивно. У вас сложилось ясное видение себя и своего поведения, вы оцениваете себя реалистично, а это хорошая база для приобретения какого-либо навыка, необходимого при контактах с окружающими.</p>";

//Formtypes

let formTypes = {
	registration : {
		inputs: [["input_login","value"],["input_pswd","value"],["input_email","value"],],
		
		inputsN: 3,
		
		sqlStatementSetter:  function () {
			if(!this.tableUpdatePG || !this.inputLogin || !this.inputPswd || !this.inputEmail) {throw new Error("Некорректный контекст функции sqlStatementSetter")};
			this.sqlStatement = "insert into " + this.tableUpdatePG + " (\"login\",\"password\",\"email\") values ('" + this.inputLogin + "','" + this.inputPswd + "','" + this.inputEmail + "');";
		},
		
		urlForFetch: "/update.php",
		
		reponseMsgsStock : {
			"1":[/^1$/,"Регистрация прошла успешно."],
			"duplicate key":[/duplicate key/,"Этот логин/email уже зарегистрирован."],
		},
		resultParsing: false,
	},

    billing : {
		inputs: [["input_login","value"],["input_pswd","value"],["input_card","value"],],
		
		inputsN: 3,
		
		sqlStatementSetter:  function () {
			if(!this.tableUpdatePG || !this.inputLogin || !this.inputPswd || !this.inputCard) {throw new Error("Некорректный контекст функции sqlStatementSetter")};
			this.sqlStatement = "insert into " + this.tableUpdatePG + " (\"idr\") select \"idr\" from registration where \"login\" = '" + this.inputLogin + "' AND \"password\" = '" + this.inputPswd + "'; update " + this.tableUpdatePG + " set \"card\" = '" + this.inputCard + "' where \"idr\" =  (select \"idr\" from registration where \"login\" = '" + this.inputLogin + "' AND \"password\" = '" + this.inputPswd + "'); update registration set \"isbilled\" = 'true' where \"login\" = '" + this.inputLogin + "' AND \"password\" = '" + this.inputPswd + "';";
		},
		
		urlForFetch: "/update.php",
		
		reponseMsgsStock : {
			"1":[/^1$/,"Оплата прошла успешно."],
			"0":[/^0$/,"Введите корректный логин или пароль."],
			"duplicate key":[/duplicate key/,"Вы уже оплатили опрос."],
		},
		resultParsing: false,
	},

	questionare : {
		inputs: [["input_login","value"],["input_pswd","value"],["questions_container",false,"input_question"],],
		
		inputsN: 2,
		
		sqlStatementSetter: function () {
			if(!this.tableUpdatePG || !this.inputLogin || !this.inputPswd || !this.answersRaw || !this.answersResult) {throw new Error("Некорректный контекст функции sqlStatementSetter")};
			this.sqlStatement = "insert into " + this.tableUpdatePG + " (\"idr\") select \"idr\" from registration where \"login\" = '" + this.inputLogin + "' AND \"password\" = '" + this.inputPswd + "' AND \"isbilled\" = true; update " + this.tableUpdatePG + " set \"answersraw\" = '" + this.answersRaw + "', \"answersresult\" = '" + JSON.stringify(this.answersResult) + "' where \"idr\" =  (select \"idr\" from registration where \"login\" = '" + this.inputLogin + "' AND \"password\" = '" + this.inputPswd + "' AND \"isbilled\" = true);";
		},
			
		urlForFetch: "/update.php",
		
		reponseMsgsStock : {
			"1":[/^1$/, "<p>Ваши ответы записаны. "],
			"0":[/^0$/, "Некорректный логин/пароль или не оплачен опрос."],
			"duplicate key":[/duplicate key/, "Вы уже прошли опрос."],
		},
		
		scales: {
			"A":[0,5,6,10,12,17,19,22],
			"B":[1,3,7,9,13,16,18,21],
			"C":[2,4,8,11,14,15,20,23],
		},
		qN: 24,
		qIndex: 2,
		resultParsing: true,
	},

	repeatResult : {
		inputs: [["input_login","value"],["input_pswd","value"],],
		
		inputsN: 2,
		
		sqlStatementSetter: function () {
			if(!this.tableUpdatePG || !this.inputLogin || !this.inputPswd) {throw new Error("Некорректный контекст функции sqlStatementSetter")};
			this.sqlStatement = "select \"login\",\"password\",\"email\",\"card\",\"isbilled\",\"answersraw\",\"answersresult\" from registration a, billing b, questionare c where a.\"idr\"=b.\"idr\"AND  a.\"idr\"=c.\"idr\" AND \"login\"='" + this.inputLogin + "' AND \"password\"='" + this.inputPswd + "';"
		},
		
		urlForFetch: "/select.php",
		
		reponseMsgsStock : {
			"answersresult":[/answersresult/,"Ваши данные по всем формам: "],
			"false":[/^false$/,"Некорректный логин/пароль или нет оплаты/результатов опрос."],
		},
		resultParsing: true,
	},
}

//Form object
function FormObj ()  {
		
		Object.defineProperties(this, {
			
			tableUpdatePG:{enumerable: false, writable: true, configurable:true},
			validationErrorMsg:{enumerable: false, writable: true, configurable:true},
			goPost: {value: false, enumerable: false, writable: true,configurable:true},
			updatePG: { enumerable: false, writable: true, configurable:true},
			sqlStatement: {enumerable: false, writable: true, configurable:true},
			url: {enumerable: false, writable: true, configurable:true},
			toString: {enumerable: false,writable: true,configurable:true},
		});
		
		this.updatePG = async function (){
			
			if(this.goPost && this.sqlStatement!==undefined && /\w?.php/.test(this.url)) {
				console.log("Текст SQL-запроса: \"" + this.sqlStatement + "\"")
				
				let response;
				
				response = await fetch(this.url, {
					method: 'POST', 
					headers: {
					'Content-Type': 'text/plain',
				},
				body: this.sqlStatement,
				})
							
				if (response.ok===false){
					throw new Error("Response.ok is false. Status: " + response.status);
				} else {
					this.responseBody = await response.text();
					if (this.responseBody===undefined||this.responseBody==="") {
						throw new Error("Ошибка интеграции с сервером.");
						};
				};
				console.log("Ответ с сервера получен.");
			
			} else {
				throw new Error("Некорректный контекст функции updatePG")
			}
		}
		
		this.toString = function () {
			let objToString = "";
			for (let key in this) {
				  objToString += key + ":" + this[key] + ",";
			}
			return "{" + objToString + "}";
		}
}
	
//Submit handler
let pressSubmit = async function(formId, formType) {
	
	if(typeof formId!=="string"||typeof formType!=="string"){
		console.log("Некорректные аргументы функции pressSubmit");
		return false;
	}
	
	formId = "#" + formId;
	let formInWork = document.querySelector(formId);
	if(!formInWork){
		console.log("Некорректный HTML, функция pressSubmit");
		return false;
	}
	
	let smsg = formInWork.querySelector(".submit_msg");
	if(!smsg){
		console.log("Некорректный HTML, функция pressSubmit");
		return false;
	}
	smsg.classList.add("faded_elem");
	smsg.innerHTML = null;
	
	let formObj = new FormObj();
	
	for(let key in formTypes) {
		if (key === formType) {
			formType = formTypes[key];
			formObj.tableUpdatePG = key;
		}
	}
	
	console.log("НОВАЯ ФОРМА");
	
	try {
		getInputsData(formType.inputs,formInWork,formObj); 
		
		let check = checksInputsData(formObj, formType.inputsN, formType.qN);
		
		if (check) {
			formObj.goPost = true;
			
			if(formObj.answersRaw!==undefined) {
				answersProcessing.call(formObj, formType.scales)
			}
	
			formType.sqlStatementSetter.call(formObj)
			
			formObj.url = formType.urlForFetch; 
			
			await formObj.updatePG()
		};
			
		if (formObj.responseBody!==undefined) {
			
			responseHandler.call(
			formObj, 
			formObj.responseBody, 
			formType.reponseMsgsStock, 
			formType.resultParsing
			);
		}
		
	} catch(err) {
		console.log(err);
		formObj.validationErrorMsg = "Неизвестная ошибка - попробуйте снова или сообщите о ней на t.yamaltdinova@gmail.com";
	}
	
	smsg.innerHTML = formObj.validationErrorMsg;
	smsg.classList.remove("faded_elem");
	
	//возвращает sql запрос для тестирования вариантов формироавния тела запроса
	//с вызовом и без вызова answersProcessing
	
	if (formObj.sqlStatement!==undefined) return formObj.sqlStatement;  
}


//Functions for submit handler
function isObjectObject (arg) {
	return {}.toString.call(arg).slice(8, -1)==="Object";
}
function isObjectHtmlElement (arg) {
	return ({}.toString.call(arg).slice(8, 12)==="HTML")&&({}.toString.call(arg).slice(-8, -1)==="Element");
}
function isObjectNodeList (arg) {
	return ({}.toString.call(arg).slice(8, -1)==="NodeList");
}
	
function getInputsData (inputslist, forminwork, formobj) {	
	let a = Array.isArray(inputslist);
	let b = _.size(inputslist); 
	let c = isObjectHtmlElement(forminwork);
	let d = isObjectObject(formobj);
	let e = _.size(formobj);
	if (!a||!b||!c||!d||e) {
		throw new Error("Некорректные аргументы функции getInputsData");
	}
	
	inputslist.forEach(function(item,i,arr) {
			
		if(!item[0] || !(item[1] || item[2])){
			throw new Error("Некорректные данные formType/настройки HTML");
		}
		
		let elem = forminwork.querySelector("."+item[0])
		
		if(!elem){
			throw new Error("Некорректные данные formType/настройки HTML");
		}
		
		if (item[1]) {
			let val = item[1];
			let propVal = elem[val];
			
			if (!propVal.length) return;
			formobj[_.camelCase(item[0])] = propVal;
			
		} else {
			let propVal = elem.querySelectorAll("."+item[2]);
			
			if (!propVal.length) {
				throw new Error("Некорректные данные formType/настройки HTML");
			};
			
			formobj[_.camelCase(item[0])] = [];
			
			for(let nodeElem of propVal) {
				if (!nodeElem.value||+nodeElem.value!==+nodeElem.value) {
					
					throw new Error("Некорректные настройки HTML - radio input value is NaN");
				};
				
				if(!nodeElem.checked) continue;
			
				
				formobj[_.camelCase(item[0])].push(nodeElem.value);
			}
		};
	});
	console.log("функция getInputsData завершила обработку inputs");
}

function checkAnswersArr (qN) {
	
	if (typeof(qN) !== "number"||qN!=qN) {
		throw new Error("Некорректный аргумент функции checkAnswers");
	}
	
	for (let key in this){
		if (Array.isArray(this[key])) {
			this.answersRaw = this[key];
			delete this[key];
		}
	};
	
	if (this.answersRaw===undefined ) {
		throw new Error("Некорректные настройки функции checkAnswersArr - в контексте нет свойства-массива");
	};
	
	if(this.answersRaw.length === qN) {
		return true;
	} else {
		console.log("Есть вопросы без ответов");
		return false;
	}
	
}
				
function answersProcessing (scales) {
	
	let a = isObjectObject(scales);
	let b = _.size(scales);
	let c; 
	let d; 
	if(this) {
		c = Array.isArray(this.answersRaw)
		d = _.size(this.answersRaw);
		};
	
	if (!a||!b||!c||!d) {
		throw new Error("Некорректные контекст и аргумент функции answersProcessing");
	}
	
	let f = 0;
	for (let key in scales) {
		if(!Array.isArray(scales[key])) throw new Error("Некорректные данные formType.scales/настройки HTML");
		f += scales[key].length;
	}
	if (f !== d) {
		throw new Error("Некорректные данные formType.scales/настройки HTML");
	}
	
	let context = this;
	let  makeAnswersResultBind = makeAnswersResult.bind(context);
	
	let counts = {};
	for (let key in scales) {
		
		let count = scales[key].reduce(function (sum, current){let endSum = makeAnswersResultBind(sum, current); return endSum}, 0);
		counts[key] = count;
	}
	
	this.answersResult = counts;
	console.log("Ответы записаны.");
	
	//function for reduce
	function makeAnswersResult(sum,current) {
			
		for (let i=0; i < this.answersRaw.length ; i++) { //
				
			if (i===current && this.answersRaw[i]==="1") {
				sum += 1;
				break;
						
			}else if (i===current && !this.answersRaw[i]) {
				break;
			};
		};
		return sum;
	}
}

function checkFormFilled (n) {
	
	if (!isObjectObject(this)||!_.isNumber(n)||n!=n||n===0) {
		throw new Error("Некорректные аргументы функции checkFormFilled");
	}
	
	let i = 0;
	for (let key in this) {
		if (!({}.toString.call(this[key]).slice(8, -1)==="Array")){
			i++;
		};
	};
		
	if (i === n) {
		console.log("Все поля формы заполнены.");
		return true;
	} else if (i > n) {
		throw new Error("Некорректные данные formType.scales/настройки HTML: перечисляемых свойств объекта больше n.");
		return false;
	} else {
		console.log("Заполнены не все поля формы.");
		return false;
	}
}

function checkDataFormat () {
	
	let errMsg = "Некорректный контекст функции checkDataFormat.";
	
	if (!isObjectObject(this)||!_.size(this)) {
		throw new Error(errMsg);
	}
	
	let i=0;
	let j=0;
	
	for (let key in this) {
		
		if (typeof(this[key])==="string" && /^[a-zA-Z0-9@\.]{1,}$/.test(this[key])) {
			i++;
			j++; 
			
		} else if (typeof(this[key])==="string") {
			i++;
			console.log("Значение \"" + this[key] + "\"" + " содержит неразрешенные символы.")
			
		} else if ({}.toString.call(this[key]).slice(8, -1)==="Array") {
			console.log("Массив не проверяется.")
			
		} else if (this[key]!=="string") {
			throw new Error(errMsg);
		} 
	}
		
	if (i>0 && i===j) {
		console.log("Данные формы соответствуют заданному формату.");
		return true
	} else if (i>0 && i!==j) {
		return false;
	} else if (i===0) {
		throw new Error(errMsg);
	}
}

function checksInputsData(formobj, inputsn, qn) {
	let errMsg = "Некорректные аргументы функции checkInputsData.";
	
	let a = isObjectObject(formobj);
	let b = (typeof(inputsn)=="number" && inputsn > 0);
	
	if (!a||!b) {
		throw new Error(errMsg);
	}
	;	
	let check;
	
	for (let key in formobj) {
		
		if ({}.toString.call(formobj[key]).slice(8, -1)==="Array"){ 
			
			if(!(typeof(qn)=="number" && qn > 0)){
				throw new Error(errMsg);
			};
			
			check = checkAnswersArr.call(formobj, qn); 
		} 
	}
	if (check===false) {
		formobj.validationErrorMsg = "Необходимо ответить на все вопросы.";
		return false;
	}
		
	check = checkFormFilled.call(formobj, inputsn);
	if (!check) {
		formobj.validationErrorMsg = "Необходимо заполнить все поля формы.";
		return false;
	}
		
	check = checkDataFormat.call(formobj);
	if (!check) {
		formobj.validationErrorMsg = "Используйте символы: a-z, A-Z, 0-9.";
		return false;
	}
	
	if(check){
		console.log("Форма прошла валидацию, запускаю асинхронный запрос на сервер.");		
		return true;
	} else {
		console.log("something not tracked");
		return false;
	}
}

function responseHandler (response, msgsstock, resultparsing) {
	
	let errMsg = "Некорректный аргумент функции responseHandler";

	if (typeof response !== "string" || !response.length  || !isObjectObject(msgsstock) ||!_.size(msgsstock) || typeof resultparsing !== "boolean") {	 
		throw new Error(errMsg); 
	}
	
	for (let key in msgsstock){	
		if (msgsstock[key][0].test(response)) {
			this.validationErrorMsg = msgsstock[key][1];
			if (resultparsing===false || response==="false" || resultparsing===true && response ==="0" || resultparsing===true && response.includes("duplicate key")) return;
		} 
	}
	if (this.validationErrorMsg===undefined) {
			throw new Error ("Нет интепретации ответа с сервера в msgsstock, функция responseHandler");
	}
	
	if (resultparsing && response === "1") {
		this.validationErrorMsg += addAnswersResult.call(this)
	};
	
	if (resultparsing && response !== "1") {
		selectResponseParse.call(this, response, interpretationText)
	};
	
	function addAnswersResult () {
		let str = "Баллы: " + _.trim(JSON.stringify(this.answersResult), "{}") + interpretationText;
		return str;
	}
}

function selectResponseParse (response, interpretationtext) {
	
	if (typeof(response)!=="string"|| response.length===0 || typeof(interpretationtext)!=="string" || !interpretationtext.length){
		throw new Error("Некорректный аргумент фукнции selectResponseParse.");
	}
	
	try{
		response = JSON.parse(response);
	}catch(err) {
			throw new Error("Некорректный аргумент JSON.parse в фукнции selectResponseParse.");
	}
	if (!Array.isArray(response)) {
		throw new Error("Некорректный результат JSON.parse() в фукнции selectResponseParse.");
	}
		
	let list = "";
	for (let key in response[0]) {
			
		let val;
	
		switch (key) {
			case "isbilled": val="Оплата"; 
			break;
			case "login": val="Логин"; 
			break;
			case "password": val="Пароль";
			break;
			case "email": val="Email"; 
			break;
			case "card": val="Карта"; 
			break;
			case "answersraw": val="Баллы ответов"; 
			break;
			case "answersresult": val="Суммы баллов по опроснику"; 
			break;
		};
			
		if (key === "isbilled") {
			list += "<li>" + val + ": true</li>";
			
		} else if (key === "answersresult"){
			
			list += "<li>" + val + ": " + _.trim(response[0][key],"{}") + "</li>";
			
		} else {
			list += "<li>" + val + ": " + response[0][key] + "</li>";
		}
	}
	this.validationErrorMsg += "<ul>" + list + "</ul>" + interpretationtext;
}


	
