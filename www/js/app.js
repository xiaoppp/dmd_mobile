// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter',
	['ionic',
    'ngCordova',
    'starter.config',
    'starter.controllers',
    'starter.services',
    'starter.directives'])

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
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.me', {
    url: '/me',
    views: {
      'menuContent': {
        templateUrl: 'templates/me.html'
      }
    }
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

  // .state('app.login', {
  //   url: '/login',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/login.html'
  //     }
  //   }
  // })

  .state('app.apply', {
    url: '/apply',
    views: {
      'menuContent': {
        templateUrl: 'templates/apply.html'
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
    views: {
      'menuContent': {
        templateUrl: 'templates/info.html'
      }
    }
  })

  .state('app.leavemsg', {
    url: '/leavemsg',
    views: {
      'menuContent': {
        templateUrl: 'templates/leavemsg.html'
      }
    }
  })



  .state('app.message', {
    url: '/message',
    views: {
      'menuContent': {
        templateUrl: 'templates/message.html'
      }
    }
  })

  .state('app.money', {
    url: '/money',
    views: {
      'menuContent': {
        templateUrl: 'templates/money.html'
      }
    }
  })

  .state('app.news', {
    url: '/news',
    views: {
      'menuContent': {
        templateUrl: 'templates/news.html'
      }
    }
  })

  .state('app.offer', {
    url: '/offer',
    views: {
      'menuContent': {
        templateUrl: 'templates/offer.html'
      }
    }
  })

  .state('app.records', {
    url: '/records',
    views: {
      'menuContent': {
        templateUrl: 'templates/records.html'
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

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/me');
});
