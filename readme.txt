Задание 1
Табло аэропорта - Airport.html

Данные лежат в файле File.txt

Реализованные функции:просмотр всех рейсов, 
просмотр только вылетающих рейсов, 
просмотр только прилетающих рейсов, 
просмотр задержанных рейсов,поиск по номеру рейса,
дополнительно: сортировка по заголовкам таблицы.


Задание 2 
Ticker - Ticker.html

this._i не увеличивается из-за строки:		
	setInterval(ticker.tick, 1000);

Код, выполняемый в setTimeout, выполнятся в отдельном контексте выполнения. 
Причина ошибки (this._i не увеличивается) в нашем примере заключается в том, 
что в функции setTimeout значением this является глобальный объект window (который не имеет свойства _i).

Чтобы исправить, можно использовать функцию в качестве первого аргумента:
setInterval(function () { ticker.tick(); }, 1000);

Можно также явно задать значение this с помощью функции bind():		
setInterval(ticker.tick.bind(ticker), 1000);

Также в setTimeout можно передать строку кода, но этот метод считается небезопасным:
setInterval('ticker.tick()', 1000);
