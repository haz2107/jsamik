(function() {
         // Название плагина
         const pluginName = "CinemaPlugin";

         // Регистрация плагина в Lampa
         if (window.lampa && window.lampa.plugins) {
             window.lampa.plugins.register(pluginName, function() {
                 // Логика плагина
                 this.init = function() {
                     console.log("Cinema Plugin initialized!");
                     // Добавьте здесь вызовы API Cinema и интеграцию с Lampa
                 };

                 // Метод для поиска контента
                 this.search = function(query) {
                     // Логика поиска через Cinema API
                     return fetch(`https://api.cinema.example/search?q=${query}`)
                         .then(response => response.json())
                         .then(data => {
                             // Обработка данных и возврат в формате, понятном Lampa
                             return data.results.map(item => ({
                                 title: item.title,
                                 description: item.description,
                                 image: item.poster,
                                 link: item.url
                             }));
                         });
                 };

                 // Метод для воспроизведения контента
                 this.play = function(url) {
                     // Логика для воспроизведения видео через Cinema
                     console.log(`Playing content from Cinema: ${url}`);
                     // Интеграция с видеоплеером Lampa
                 };
             });
         }
     })();
