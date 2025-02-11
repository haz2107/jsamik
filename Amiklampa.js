(function() {
  'use strict';

  // Название плагина и его версия
  var pluginName = 'AmikLampa';
  var pluginVersion = '1.0';

  // Основной URL API для нового источника
  var apiUrl = 'https://github.com/haz2107/jsamik/Amiklampa.js'; // Замените на реальный URL API
  // Функция для загрузки данных с API
  function fetchData(url, callback) {
    Lampa.Utils.fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        callback(data);
      })
      .catch(function(error) {
        console.error('Ошибка при загрузке данных:', error);
      });
  }

  // Компонент для отображения контента
  function AmikComponent(object) {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var files = new Lampa.Explorer(object);
    var filter = new Lampa.Filter(object);

    this.initialize = function() {
      this.loading(true);
      this.fetchContent();
    };

    this.fetchContent = function() {
      var url = apiUrl + '/search?q=' + encodeURIComponent(object.movie.title);
      fetchData(url, function(data) {
        if (data && data.results) {
          this.displayContent(data.results);
        } else {
          this.noContent();
        }
      }.bind(this));
    };

    this.displayContent = function(items) {
      scroll.clear();
      items.forEach(function(item) {
        var html = Lampa.Template.get('online_item', {
          title: item.title,
          poster: item.poster,
          year: item.year,
          description: item.description
        });
        html.on('hover:enter', function() {
          Lampa.Player.play({
            title: item.title,
            url: item.url,
            quality: item.quality,
            subtitles: item.subtitles
          });
        });
        scroll.append(html);
      });
      this.loading(false);
    };

    this.noContent = function() {
      scroll.clear();
      scroll.append(Lampa.Template.get('online_empty', {
        message: 'Контент не найден'
      }));
      this.loading(false);
    };

    this.loading = function(status) {
      if (status) {
        scroll.body().append(Lampa.Template.get('online_loading'));
      } else {
        scroll.body().find('.online-loading').remove();
      }
    };
  }

  // Регистрация плагина
  function startPlugin() {
    Lampa.Manifest.plugins = {
      type: 'video',
      version: pluginVersion,
      name: pluginName,
      description: 'Плагин для просмотра онлайн контента от Amik',
      component: 'amik',
      onContextMenu: function(object) {
        return {
          name: 'Смотреть онлайн (Amik)',
          description: 'Плагин для просмотра онлайн контента от Amik'
        };
      },
      onContextLauch: function(object) {
        Lampa.Component.add('amik', AmikComponent);
        Lampa.Activity.push({
          url: '',
          title: 'Онлайн (Amik)',
          component: 'amik',
          movie: object
        });
      }
    };

    // Добавление кнопки в интерфейс
    Lampa.Listener.follow('full', function(e) {
      if (e.type == 'complite') {
        var btn = $('<div class="full-start__button selector view--online amik--button">\
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">\
            <path d="M0 0h24v24H0z" fill="none"/>\
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>\
          </svg>\
          <span>Amik</span>\
        </div>');
        btn.on('hover:enter', function() {
          Lampa.Activity.push({
            url: '',
            title: 'Онлайн (Amik)',
            component: 'amik',
            movie: e.data.movie
          });
        });
        e.object.activity.render().find('.view--torrent').after(btn);
      }
    });
  }

  // Запуск плагина
  if (!window.amikPlugin) {
    window.amikPlugin = true;
    startPlugin();
  }
})();
