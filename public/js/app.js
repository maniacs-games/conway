define(['game', 'renderer', 'gameclient', 'playermanager'], function(Game, Renderer, GameClient, PlayerManager) {
  var App = function(config) {
    this.config = config;
  };

  App.prototype.init = function(width, height) {
    this.width = width;
    this.height = height;

    this.game = new Game(this);
    this.game.init(width, height);
    
    this.playerManager = new PlayerManager(this);

    this.gameClient = new GameClient(this, this.game, this.playerManager);

    this.renderer = new Renderer(this);
    this.renderer.init();

    var _this = this;

    this.gameClient.createNewPlayer(function(data) {
      _this.gameClient.getPlayers(function(data) {
        _this.gameClient.getUpdate(function(data) {
          _this.run();
        });
      });
    });
  };

  App.prototype.run = function() {
    var _this = this;

    // "the loop"
    requestAnimationFrame(function() {
      var now = +new Date;

      // go to next generation
      if (_this.game.isTimeToTick()) {
        _this.game.tick();
      }

      // get an update from the server
      if (_this.gameClient.isTimeToUpdate() && !_this.gameClient.updating) {
        _this.gameClient.getUpdate(function(data) {
        });
      }

      _this.renderer.renderChanges();
      _this.run();
    });

  };

  return App;
});