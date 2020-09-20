"use strict";
function sqlShow(){
	console.log("База данных состоит из трёх таблиц. Целостность данных обеспечивают внешние ключи.");
	console.log("Структура таблицы пользователей: create table registration(\"idr\" SERIAL Primary Key NOT NULL,\"login\" text unique not null,\"email\" text unique not null,\"password\" text not null,\"isbilled\" boolean);");
	console.log("Структура таблицы проведенных оплат: " + "create table billing(\"idb\" SERIAL Primary Key NOT NULL,\"card\" text,\"idr\" integer not null unique references registration);");
	console.log("Структура таблицы результатов опросника: " + "create table questionare(\"idq\" SERIAL Primary Key NOT NULL,\"answersraw\" text,\"idr\" integer not null unique references registration,\"answersresult\" text);");
}

function fromDataGenerator(){
	
	let n = Math.floor(Math.random() * Math.floor(1000000));
	
	let insertPlace = document.querySelectorAll(".random_data > li > span");
	
	insertPlace[0].innerHTML = "user" + n;
	insertPlace[1].innerHTML = n + "@email.com";
	insertPlace[2].innerHTML = n; 
	
}
function questionareHtml(){
	let questions = [
	"Меня раздражают, когда другие люди ошибаются:",
	"Я могу напомнить приятелю о долге:",
	"Лучше говорить правду, но не всегда всю правду:",
	"Я в состоянии позаботится о себе сам:",
	"Иногда можно проехать \"зайцем\":",
	"Соперничество лучше сотрудничества:",
    "Я часто переживаю по пустякам:",
	"Я человек самостоятельный и достаточно решительный:",
	"Я люблю всех, кого знаю:",
	"Я верю в себя. У меня хватит сил, чтобы справиться с текущими задачами:",
	"Ничего не поделаешь, человек всегда должен быть начеку, чтобы суметь защитить свои интересы:",
	"Я никогда не смеюсь над неприличными шутками:",
	"Я признаю авторитеты и уважаю их:",
	"Я никогда не позволяю давить на себя. Я заявляю протест:",
	"Я поддерживаю любое полезное начинание:",
	"Я всегда говорю правду:",
	"Я практичный человек:",
	"Меня угнетает лишь факт того, что я могу потерпеть неудачу:",
	"Я согласен с изречением: «Руку помощи ищи прежде всего у собственного плеча»:",
	"Друзья оказывают на меня большое влияние:",
	"Я всегда прав, даже если другие считают иначе:",
	"Я согласен с тем, что важен не результат, а процесс:",
	"Прежде чем что-либо сделать, хорошенько подумаю, как это воспримут другие:",
	"Я никогда никому не завидую:"
	];
	
	let questionsContainer = document.querySelector(".questions_container");
	
	for (let i = 0; i < questions.length  ; i++) {
		
		let label = document.createElement('label');
		let labelText = (i+1) + ". " + questions[i]
		label.setAttribute("for","question" + (i+1))
		label.innerHTML = labelText;
		questionsContainer.append(label);
		
		let radioGroup = document.createElement('p');
		
		let inputYes = document.createElement('input');
		inputYes.type = "radio";
		inputYes.id = "question" + (i+1) + "_1";
		inputYes.name = "question" + (i+1);
		inputYes.value = "1";
		inputYes.className = "input_question";
		radioGroup.append("Да ");
		radioGroup.append(inputYes);
		
		let inputNo = document.createElement('input');
		inputNo.type = "radio";
		inputNo.id = "question" + (i+1) + "_0";
		inputNo.name = "question" + (i+1);
		inputNo.value = "0";
		inputNo.className = "input_question";
		radioGroup.append("Нет ");
		radioGroup.append(inputNo);
		
		questionsContainer.append(radioGroup);
		
	};
	
	questionsContainer.style.height=document.documentElement.clientHeight*0.48 + "px";
}

document.addEventListener("DOMContentLoaded", fromDataGenerator);
document.addEventListener("DOMContentLoaded", questionareHtml);
document.addEventListener("DOMContentLoaded", sqlShow);


