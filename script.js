window.onload = read; 
    
function read() {
    var text;
    function readfile(object) {
        httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", "file.txt", true);
        httpRequest.onreadystatechange = OnRequestStateChange;
        httpRequest.send(null); 
    }
    function OnRequestStateChange() {
        if (httpRequest.readyState != 4)
            return;
        if (httpRequest.status != 200)
            return;
        text = httpRequest.responseText; 
        divideByLines();firstShow();
    }
    function divideByLines() {
        var lines = text.split('\n'); 
        for (var i=0; i < lines.length; i++) { 
            if (lines[i]!='') {
                addFlight(lines[i]); 
            }
        }
        
    }
    function addFlight(line) {
        var facts = line.split(',');
        aSourceData[indexData] = new Array(facts.length);
        for (var i=0; i < facts.length; i++) {
            aSourceData[indexData][i]=facts[i];
        }
        indexData++;  
    }
    var indexData = 0;
    readfile();
}

var aSourceData = new Array();


var menuData = [
    { name: "Все", isSuitable: function (i) { return true;} },
    { name: "Прилет", isSuitable: function (i) { if (aSourceData[i][0]=='IN') {return true;} else {return false;} } },
    { name: "Вылет",  isSuitable: function (i) { if (aSourceData[i][0]=='OUT') {return true;} else {return false;} } },
    { name: "Задержанные",  isSuitable: function (i) { if (aSourceData[i][6]=='задержан') {return true;} else {return false;} } },
    { name: "Найти рейс",  isSuitable: function (i) { 
                                        var sFlight = document.getElementById('search').value;
                                        if (sFlight=='') {return true;}
                                        
                                        if (aSourceData[i][3]==sFlight) {return true;} else {return false;} 
                                        } }
];


var oMasterSearch= document.querySelector('#masterSide #search');
oMasterSearch.addEventListener('input', onSearchTyping);

function onSearchTyping(oEvent) { 
    var oText = document.getElementById('search').value;
    var messageArea = document.getElementById('search-message');				
    if ((!oText.match(/^\d+$/))||(oText.length>4)) { 
        messageArea.innerHTML = 'Введите номер рейса <br>в формате "0000"'; 
        } else {
        messageArea.innerHTML = ''; 
        }
    setTimeout(function () { messageArea.innerHTML = '';}, 5000);	
}

var aSourceView = [];
var ClassSign = ['▼ Время','▼ Код','▼ Рейс','▼ Направление','▼ Терминал','▼ Статус'];
var ClassName = ['time','code','flight','city','terminal','status'];

function firstShow() {
    aSourceView = aSourceData;
    var oFirstShow = document.querySelector('#detailSide .timetable');
    onCreateTimetable(oFirstShow);
}
 
//show menu
var showMenu = document.querySelector('#masterSide .menu');
for (var i = 0; i < menuData.length; i++) { 
    var showMenuItem = document.createElement("li");
    showMenuItem.innerText = menuData[i].name;    
    showMenu.appendChild(showMenuItem);
}

//show head
var showHead = document.querySelector('#detailSide .head-timetable');
for (var i = 0; i < ClassSign.length; i++) { 
    var showHeadItem = document.createElement("li");
    showHeadItem.setAttribute('class', ClassName[i]);
    showHeadItem.innerText = ClassSign[i];    
    showHead.appendChild(showHeadItem);   
}

//delete previous
function removeChildrenRecursively(node) { 
    if (aSourceView.length>0) {
        aSourceView = aSourceView.slice(1,aSourceView.length);
        }
    if (!node) return;
        while (node.hasChildNodes()) {
            removeChildrenRecursively(node.firstChild);
         node.removeChild(node.firstChild);
        }
}

//show timetable
function onCreateTimetable(parent) {	
    for (var item = 0; item < aSourceView.length; item++) {
        var oTimetableItem = document.createElement('li');
        for (var j =1; j < 7; j++) { 
            var oLineItem = document.createElement('div');
            oLineItem.setAttribute('class', ClassName[j-1]);
            oLineItem.innerText = aSourceView[item][j];    
            oTimetableItem.appendChild(oLineItem); 
       }
       parent.appendChild(oTimetableItem);		
    }
}

var oMasterSide = document.querySelector('.menu');
oMasterSide.addEventListener('click', onMasterClick);

//to do on menu click
function onMasterClick(oEvent) { 
    var oTimetable = document.querySelector('#detailSide .timetable');
    removeChildrenRecursively(oTimetable);
    var oTarget = oEvent.target;
    var sNodeName = oTarget.nodeName;	
    var sName = oTarget.innerText;
    var sMenu;
    for (var i = 0; i < menuData.length; i++) { //opredelyaem index vybranogo zakaza
        if (menuData[i]['name'] === sName) {
            sMenu=menuData[i];
            break;
        } 
    }
    var iAmount = 0; var isGood;
    for (var i = 0; i < aSourceData.length; i++) { //vyvodim zakaz
        isGood = sMenu.isSuitable(i);
        if (isGood) {
            aSourceView[iAmount]=aSourceData[i];
            iAmount++;
        }
    }
    onCreateTimetable(oTimetable);
}

//sort
var oMasterSort = document.querySelector('#detailSide .head-timetable');
oMasterSort.addEventListener("click", SortBy);

function SortBy(oEvent) {
    function Sorting(k) {
        var ar = [];
        for (var i = 0; i < aSort.length-1; i++) {
            for (var j = 0; j < aSort.length-i-1; j++) {
                if (aSort[j][k] > aSort[j+1][k]) {
                    ar = aSort[j];
                    aSort[j] = aSort[j+1];
                    aSort[j+1] = ar;
                }
            }
        }
    }
    if (aSourceView.length>0) 
        { 
        var aSort = aSourceView;
        var oSortShow = document.querySelector('#detailSide .timetable');
        removeChildrenRecursively(oSortShow);
        
        var oTarget = oEvent.target;
        var sNodeName = oTarget.nodeName;	
        var sName = oTarget.innerText; 
        var sSort = 1;
        for (var i = 0; i < ClassSign.length; i++) { 
            if (ClassSign[i] === sName) {
                sSort = i+1;
                break;
                } 
            }
        Sorting(sSort);
        aSourceView = aSort;
        onCreateTimetable(oSortShow);
    }
}