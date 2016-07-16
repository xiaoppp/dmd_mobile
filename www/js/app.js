// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic',
  'ngCordova',
  'starter.config',
  'starter.constants',
  'starter.filters',
  'starter.controllers',
  'starter.services',
  'starter.directives'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    cache: false,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })

  .state('resetpwd', {
    url: '/resetpwd',
    templateUrl: 'templates/resetpwd.html'
  })

  .state('app.loading', {
    url: '/loading',
    cache: false,
    views:{
        'menuContent':{
          templateUrl: 'templates/loading.html',
          controller: 'LoadingCtrl'
        }
    }
  })

  .state('app.me', {
    url: '/me',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/me.html'
      }
    }
  })

  .state('app.error', {
    url: '/error?code',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/error.html',
        controller: 'ErrorCtrl'
      }
    }
  })

  .state('app.apply', {
    url: '/apply',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/apply.html',
        controller: 'ApplyCtrl'
      }
    }
  })

  .state('app.applydetail', {
    url: '/apply/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/applydetail.html',
        controller: 'ApplyDetailCtrl'
      }
    }
  })

  .state('app.group', {
    url: '/group',
    views: {
      'menuContent': {
        templateUrl: 'templates/group.html'
      }
    }
  })

  .state('app.info', {
    url: '/info',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/info.html',
        controller : 'InfoCtrl'
      }
    }
  })

  .state('app.leavemsg', {
    url: '/leavemsg',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/leavemsg.html',
        controller : 'LeaveMsgCtrl'
      }
    }
  })

  .state('app.message', {
    url: '/message',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/message.html',
        controller: 'MessageCtrl'
      }
    }
  })

  .state('app.messagedetail', {
    url: '/message/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/messagedetail.html',
        controller: 'MessageDetailCtrl'
      }
    }
  })

  .state('app.money', {
    url: '/money',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/money.html',
        controller: 'MoneyCtrl'
      }
    }
  })

  .state('app.news', {
    url: '/news',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/news.html',
        controller: 'NewsCtrl'
      }
    }
  })

  .state('app.newsdetail', {
    url: '/news/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/newsdetail.html',
        controller: 'NewsDetailCtrl'
      }
    }
  })

  .state('app.offer', {
    url: '/offer',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/offer.html',
        controller: 'OfferCtrl'
      }
    }
  })

  .state('app.offerdetail', {
    url: '/offer/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/offerdetail.html',
        controller: 'OfferDetailCtrl'
      }
    }
  })

  .state('app.records', {
    url: '/records',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/records.html',
        controller: 'RecordCtrl'
      }
    }
  })

  .state('app.share', {
    url: '/share',
    views: {
      'menuContent': {
        templateUrl: 'templates/share.html'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('app.test', {
    url: '/test',
    views: {
      'menuContent': {
        templateUrl: 'templates/test.html'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/me');
});
