var WIDTH = 1024;
var HEIGHT = 1024;
var SystemState;
(function (SystemState) {
    SystemState[SystemState["None"] = 0] = "None";
    SystemState[SystemState["Init"] = 1] = "Init";
    SystemState[SystemState["Update"] = 2] = "Update";
    SystemState[SystemState["Finit"] = 3] = "Finit";
})(SystemState || (SystemState = {}));
var Vector = (function () {
    function Vector(x, y) {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.magnitude = function () {
            return Math.sqrt(_this.x * _this.x + _this.y * _this.y);
        };
        this.setMagnitude = function (magnitude) {
            var angle = _this.getAngle();
            _this.x = magnitude * Math.cos(angle);
            _this.y = magnitude * Math.sin(angle);
        };
        this.magSq = function () {
            return _this.x * _this.x + _this.y * _this.y;
        };
        this.normalize = function () {
            var len = _this.magnitude();
            _this.x /= len;
            _this.y /= len;
            return _this;
        };
        this.zero = function () {
            _this.x = 0;
            _this.y = 0;
        };
        this.copy = function (v) {
            _this.x = v.x;
            _this.y = v.y;
        };
        this.rotate = function (radians) {
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            var x = (cos * _this.x) + (sin * _this.y);
            var y = (cos * _this.y) - (sin * _this.x);
            _this.x = x;
            _this.y = y;
        };
        this.getAngle = function () {
            return Math.atan2(_this.y, _this.x);
        };
        this.multiply = function (value) {
            _this.x *= value;
            _this.y *= value;
        };
        this.add = function (v) {
            _this.x += v.x;
            _this.y += v.y;
        };
        this.subtract = function (v) {
            _this.x -= v.x;
            _this.y -= v.y;
        };
        this.x = x;
        this.y = y;
    }
    return Vector;
}());
function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}
var SystemContext = (function () {
    function SystemContext() {
        var _this = this;
        this.addSystem = function (system) {
            _this.system[system.id] = system;
            console.log("Register System: " + system.id);
        };
        this.getSystem = function (name) {
            return _this.system[name];
        };
        this.removeSystem = function (name) {
            _this.system[name].finit();
            delete _this.system[name];
        };
        this.updateSystems = function () {
            for (var key in _this.system) {
                if (_this.system[key].state == SystemState.None)
                    _this.system[key].init();
                _this.system[key].update();
            }
        };
        this.system = {};
    }
    return SystemContext;
}());
var EntityContext = (function () {
    function EntityContext() {
        var _this = this;
        this.addEntity = function (entity) {
            _this.entity[_this.index] = (entity);
            entity.init(_this.index++);
            if (entity.attribute["Game"].val["type"] === "Player")
                _this.player = entity;
        };
        this.getEntity = function (index) {
            return _this.entity[index];
        };
        this.getPlayer = function () {
            return _this.player;
        };
        this.removeEntity = function (index) {
            delete _this.entity[index];
        };
        this.updateEntities = function () {
            for (var key in _this.entity) {
                _this.entity[key].update();
            }
        };
        this.entity = {};
        this.index = 0;
    }
    return EntityContext;
}());
var GraphicsSystem = (function () {
    function GraphicsSystem() {
        var _this = this;
        this.id = "";
        this.init = function () {
            _this.state = SystemState.Init;
            var canvas = document.createElement("canvas");
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            document.getElementById("canvasContainer").appendChild(canvas);
            _this.canvasContext = canvas.getContext("2d");
        };
        this.update = function () {
            _this.state = SystemState.Update;
            _this.clear();
            _this.renderScore();
            _this.renderCooldown();
            _this.renderPower();
            _this.renderSpawnRate();
            _this.renderSpawnAmount();
        };
        this.finit = function () {
            _this.state = SystemState.Finit;
        };
        this.clear = function () {
            _this.canvasContext.fillStyle = "white";
            _this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        };
        this.renderScore = function () {
            _this.canvasContext.fillStyle = "#eee";
            _this.canvasContext.font = "400px Arial";
            _this.canvasContext.textAlign = "center";
            _this.canvasContext.fillText("" + systems.getSystem('Game').getCurrentScore(), WIDTH / 2, HEIGHT / 2);
        };
        this.renderCooldown = function () {
            _this.canvasContext.fillStyle = "#999";
            _this.canvasContext.font = "15px Arial";
            _this.canvasContext.fillText("y", 50, 50);
            _this.canvasContext.fillText("+", 70, 50);
            _this.canvasContext.fillText("-" + entities.getPlayer().attribute['Weapon'].val['cooldown'], 90, 50);
        };
        this.renderPower = function () {
            _this.canvasContext.fillStyle = "#999";
            _this.canvasContext.font = "15px Arial";
            _this.canvasContext.fillText("u", 50, 100);
            _this.canvasContext.fillText("+", 70, 100);
            _this.canvasContext.fillText("*" + entities.getPlayer().attribute['Weapon'].val['power'], 90, 100);
        };
        this.renderSpawnRate = function () {
            _this.canvasContext.fillStyle = "#999";
            _this.canvasContext.font = "15px Arial";
            _this.canvasContext.fillText("i", 50, 150);
            _this.canvasContext.fillText("+", 70, 150);
            _this.canvasContext.fillText("/" + systems.getSystem('Game').spawnTimerMax, 90, 150);
        };
        this.renderSpawnAmount = function () {
            _this.canvasContext.fillStyle = "#999";
            _this.canvasContext.font = "15px Arial";
            _this.canvasContext.fillText("o", 50, 200);
            _this.canvasContext.fillText("+", 70, 200);
            _this.canvasContext.fillText("x" + systems.getSystem('Game').spawnAmount, 90, 200);
        };
        this.id = "Graphics";
        this.state = SystemState.None;
    }
    return GraphicsSystem;
}());
var PhysicsSystem = (function () {
    function PhysicsSystem() {
        var _this = this;
        this.init = function () {
            _this.state = SystemState.Init;
        };
        this.update = function () {
            _this.state = SystemState.Update;
        };
        this.finit = function () {
            _this.state = SystemState.Finit;
        };
        this.id = 'Physics';
        this.state = SystemState.None;
    }
    return PhysicsSystem;
}());
var InputSystem = (function () {
    function InputSystem() {
        var _this = this;
        this.keyCallback = {};
        this.keyDown = {};
        this.init = function () {
            _this.state = SystemState.Init;
            document.addEventListener('keydown', _this.keyboardDown);
            document.addEventListener('keyup', _this.keyboardUp);
        };
        this.update = function () {
            _this.state = SystemState.Update;
            for (var key in _this.keyDown) {
                var is_down = _this.keyDown[key];
                if (is_down) {
                    var callback = _this.keyCallback[key];
                    if (callback != null) {
                        callback();
                    }
                }
            }
        };
        this.finit = function () {
            _this.state = SystemState.Finit;
        };
        this.keyboardDown = function (event) {
            event.preventDefault();
            _this.keyDown[event.keyCode] = true;
        };
        this.keyboardUp = function (event) {
            _this.keyDown[event.keyCode] = false;
        };
        this.addKeycodeCallback = function (keycode, f) {
            _this.keyCallback[keycode] = f;
            _this.keyDown[keycode] = false;
        };
        this.id = 'Input';
        this.state = SystemState.None;
    }
    return InputSystem;
}());
var GameSystem = (function () {
    function GameSystem() {
        var _this = this;
        this.score = 0;
        this.currentScore = 0;
        this.spawnTimer = 0;
        this.spawnAmount = 0;
        this.spawnTimerMax = 0;
        this.init = function () {
            _this.state = SystemState.Init;
            _this.score = 0;
            _this.currentScore = 0;
            _this.spawnTimer = 0;
            _this.spawnAmount = 1;
            _this.spawnTimerMax = 25;
            _this.spawnPlayer(new Vector(WIDTH / 2, HEIGHT / 2), new Vector(0, 0), new Vector(10, 10));
        };
        this.update = function () {
            _this.state = SystemState.Update;
            _this.updateSpawn();
            _this.updateScore();
        };
        this.finit = function () {
            _this.state = SystemState.Finit;
        };
        this.updateSpawn = function () {
            _this.spawnTimer++;
            if (_this.spawnTimer == _this.spawnTimerMax) {
                for (var i = 0; i < _this.spawnAmount; i++) {
                    var x = Math.floor((Math.random() * WIDTH) + 1);
                    var y = Math.floor((Math.random() * HEIGHT) + 1);
                    _this.spawnEnemy(new Vector(x, y), new Vector(0, 0), new Vector(15, 15));
                    _this.spawnTimer = 0;
                }
            }
        };
        this.updateScore = function () {
            if (_this.currentScore < _this.score)
                _this.currentScore++;
            else if (_this.currentScore > _this.score)
                _this.currentScore--;
        };
        this.addScore = function (score) {
            _this.score += score * _this.spawnAmount;
        };
        this.reduceScore = function (score) {
            _this.score -= score * _this.spawnAmount;
        };
        this.getScore = function () {
            return _this.score;
        };
        this.getCurrentScore = function () {
            return _this.currentScore;
        };
        this.upgradePower = function () {
            if (_this.score < 100) {
                console.log("Not enough score");
                return;
            }
            var weapon = entities.getPlayer().attribute['Weapon'];
            _this.score -= 100;
            weapon.val['power']++;
        };
        this.upgradeCooldown = function () {
            var weapon = entities.getPlayer().attribute['Weapon'];
            if (weapon.val['cooldown'] == 1) {
                console.log("Already at minimum cooldown");
                return;
            }
            if (_this.score < 100) {
                console.log("Not enough score");
                return;
            }
            _this.score -= 100;
            weapon.val['cooldown']--;
        };
        this.upgradeSpawnRate = function () {
            if (_this.score < 100) {
                console.log("Not enough score");
                return;
            }
            _this.score -= 100;
            if (_this.spawnTimerMax > 0) {
                _this.spawnTimerMax--;
            }
        };
        this.upgradeSpawnAmount = function () {
            if (_this.score < 100) {
                console.log("Not enough score");
                return;
            }
            _this.score -= 100;
            _this.spawnAmount++;
        };
        this.spawnPlayer = function (position, velocity, dimensions) {
            var playerComponents = [
                new EntityGraphics(),
                new EntityPhysics(),
                new EntityCollision(),
                new PlayerInput(),
                new PlayerAI()
            ];
            var playerAttributes = [
                new Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
                new Attribute("Sprite", { 'color': "black" }),
                new Attribute("Physics", { 'velocity': velocity, 'acceleration': 3, 'drag': 1, 'terminalVelocity': 15 }),
                new Attribute("Collision", { 'collidingWith': 'Nothing' }),
                new Attribute("Game", { 'index': -1, 'type': 'Player', 'active': true }),
                new Attribute("Weapon", { 'cooldown': 10, 'power': 20 })
            ];
            var player = new Entity(playerComponents, playerAttributes);
            entities.addEntity(player);
        };
        this.spawnEnemy = function (position, velocity, dimensions) {
            var enemyComponents = [
                new EntityGraphics(),
                new EntityPhysics(),
                new EntityCollision(),
                new EnemyAI()
            ];
            var enemyAttributes = [
                new Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
                new Attribute("Sprite", { 'color': "red" }),
                new Attribute("Physics", { 'velocity': velocity, 'acceleration': 2, 'drag': 1, 'terminalVelocity': 20 }),
                new Attribute("Collision", { 'collidingWith': 'Nothing' }),
                new Attribute("Game", { 'index': -1, 'type': 'Enemy', 'active': true })
            ];
            var enemy = new Entity(enemyComponents, enemyAttributes);
            entities.addEntity(enemy);
        };
        this.spawnBullet = function (position, velocity, dimensions) {
            var bulletComponents = [
                new EntityGraphics(),
                new EntityPhysics(),
                new EntityCollision(),
                new BulletAI()
            ];
            var bulletAttributes = [
                new Attribute("Transform", { 'position': position, dimensions: dimensions }),
                new Attribute("Sprite", { 'color': "black" }),
                new Attribute("Physics", { 'velocity': velocity, 'acceleration': 0, 'drag': 1, 'terminalVelocity': 100 }),
                new Attribute("Collision", { 'collidingWith': 'Nothing' }),
                new Attribute("Game", { 'index': -1, 'type': 'Bullet', 'active': true })
            ];
            var bullet = new Entity(bulletComponents, bulletAttributes);
            entities.addEntity(bullet);
        };
        this.id = 'Game';
        this.state = SystemState.None;
    }
    return GameSystem;
}());
var EntityGraphics = (function () {
    function EntityGraphics() {
        this.id = "";
        this.update = function (attribute) {
            var transform = attribute["Transform"];
            var sprite = attribute["Sprite"];
            var ctxt = systems.getSystem("Graphics").canvasContext;
            ctxt.fillStyle = sprite.val['color'];
            ctxt.fillRect(transform.val['position'].x, transform.val['position'].y, transform.val['dimensions'].x, transform.val['dimensions'].y);
        };
        this.id = "Graphics";
    }
    return EntityGraphics;
}());
var EntityPhysics = (function () {
    function EntityPhysics() {
        this.id = "";
        this.update = function (attribute) {
            var transform = attribute["Transform"];
            var physics = attribute["Physics"];
            if (physics.val['velocity'].magnitude() > physics.val['terminalVelocity']) {
                physics.val['velocity'].setMagnitude(physics.val['terminalVelocity']);
            }
            transform.val['position'].add(physics.val['velocity']);
            var magnitude = physics.val['velocity'].magnitude();
            if (magnitude > 0) {
                if (magnitude < physics.val['drag'])
                    physics.val['velocity'].zero();
                else
                    physics.val['velocity'].setMagnitude(magnitude - physics.val['drag']);
            }
        };
        this.id = "Physics";
    }
    return EntityPhysics;
}());
var EntityCollision = (function () {
    function EntityCollision() {
        this.id = "";
        this.update = function (attribute) {
            var entityList = entities.entity;
            for (var key in entityList) {
                if (key == attribute["Game"].val['index'])
                    continue;
                if (attribute["Collision"].val['collidingWith'] !== 'Nothing')
                    return;
                var collideWith = {};
                collideWith['position'] = entityList[key].attribute["Transform"].val['position'];
                collideWith['dimensions'] = entityList[key].attribute["Transform"].val['dimensions'];
                var dimensions = new Vector(0, 0);
                dimensions.add(collideWith['dimensions']);
                dimensions.add(attribute["Transform"].val['dimensions']);
                dimensions.multiply(0.5);
                var difference = new Vector(0, 0);
                difference.copy(collideWith['position']);
                difference.subtract(attribute["Transform"].val['position']);
                difference.x = Math.abs(difference.x);
                difference.y = Math.abs(difference.y);
                if (difference.x < dimensions.x && difference.y < dimensions.y) {
                    attribute["Collision"].val['collidingWith'] = entityList[key].attribute["Game"].val['type'];
                    entityList[key].attribute["Collision"].val['collidingWith'] = attribute["Game"].val['type'];
                }
            }
        };
        this.id = "Collision";
    }
    return EntityCollision;
}());
var PlayerInput = (function () {
    function PlayerInput() {
        var _this = this;
        this.id = "";
        this.update = function (attribute) {
            _this.physics = attribute["Physics"];
            _this.transform = attribute["Transform"];
        };
        this.left = function () {
            if (_this.physics.val['velocity'].x > 0)
                _this.physics.val['velocity'].x = 0;
            _this.physics.val['velocity'].x -= _this.physics.val['acceleration'];
        };
        this.up = function () {
            if (_this.physics.val['velocity'].y > 0)
                _this.physics.val['velocity'].y = 0;
            _this.physics.val['velocity'].y -= _this.physics.val['acceleration'];
        };
        this.down = function () {
            if (_this.physics.val['velocity'].y < 0)
                _this.physics.val['velocity'].y = 0;
            _this.physics.val['velocity'].y += _this.physics.val['acceleration'];
        };
        this.right = function () {
            if (_this.physics.val['velocity'].x < 0)
                _this.physics.val['velocity'].x = 0;
            _this.physics.val['velocity'].x += _this.physics.val['acceleration'];
        };
        this.id = "Input";
        var inputSystem = systems.getSystem("Input");
        var gameSystem = systems.getSystem("Game");
        inputSystem.addKeycodeCallback(65, this.left);
        inputSystem.addKeycodeCallback(87, this.up);
        inputSystem.addKeycodeCallback(83, this.down);
        inputSystem.addKeycodeCallback(68, this.right);
        //inputSystem.addKeycodeCallback(32, this.fire);
        inputSystem.addKeycodeCallback(89, gameSystem.upgradePower);
        inputSystem.addKeycodeCallback(85, gameSystem.upgradeCooldown);
        inputSystem.addKeycodeCallback(73, gameSystem.upgradeSpawnRate);
        inputSystem.addKeycodeCallback(79, gameSystem.upgradeSpawnAmount);
    }
    return PlayerInput;
}());
var PlayerAI = (function () {
    function PlayerAI() {
        var _this = this;
        this.id = "";
        this.update = function (attribute) {
            _this.physics = attribute['Physics'];
            _this.transform = attribute['Transform'];
            _this.weapon = attribute['Weapon'];
            _this.cooldown++;
            if (_this.cooldown >= _this.weapon.val['cooldown']) {
                _this.fire();
                _this.cooldown = 0;
            }
        };
        this.fire = function () {
            var orientation = new Vector(0, 0);
            orientation.copy(_this.physics.val['velocity']);
            if (orientation.magnitude() == 0) {
                orientation.copy(_this.lastOrientation);
            }
            orientation.normalize().multiply(-_this.weapon.val['power']);
            _this.lastOrientation.copy(orientation);
            var position = _this.transform.val['position'];
            systems.getSystem("Game").spawnBullet(new Vector(position.x, position.y), orientation, new Vector(5, 5));
        };
        this.id = "AI";
        this.cooldown = 0;
        this.lastOrientation = new Vector(1, 0);
    }
    return PlayerAI;
}());
var EnemyAI = (function () {
    function EnemyAI() {
        this.id = "";
        this.update = function (attribute) {
            var player = entities.getPlayer();
            var playerTransform = player.attribute["Transform"].val;
            var enemyPhysics = attribute["Physics"].val;
            if (playerTransform['position'].x < attribute["Transform"].val['position'].x)
                enemyPhysics['velocity'].x -= enemyPhysics['acceleration'];
            if (playerTransform['position'].x > attribute["Transform"].val['position'].x)
                enemyPhysics['velocity'].x += enemyPhysics['acceleration'];
            if (playerTransform['position'].y < attribute["Transform"].val['position'].y)
                enemyPhysics['velocity'].y -= enemyPhysics['acceleration'];
            if (playerTransform['position'].y > attribute["Transform"].val['position'].y)
                enemyPhysics['velocity'].y += enemyPhysics['acceleration'];
            if (attribute["Collision"].val['collidingWith'] === 'Bullet') {
                systems.getSystem("Game").addScore(5);
                attribute["Game"].val['active'] = false;
            }
            else if (attribute["Collision"].val['collidingWith'] === 'Player') {
                systems.getSystem("Game").reduceScore(20);
                attribute["Game"].val['active'] = false;
            }
        };
        this.id = "AI";
    }
    return EnemyAI;
}());
var BulletAI = (function () {
    function BulletAI() {
        this.id = "";
        this.update = function (attribute) {
            if (attribute["Physics"].val['velocity'].magnitude() == 0)
                attribute["Game"].val['active'] = false;
            if (attribute["Collision"].val['collidingWith'] === 'Enemy')
                attribute["Game"].val['active'] = false;
        };
        this.id = "AI";
    }
    return BulletAI;
}());
var Attribute = (function () {
    function Attribute(id, val) {
        this.id = "";
        this.val = {};
        this.id = id;
        this.val = val;
    }
    return Attribute;
}());
var Entity = (function () {
    function Entity(components, attributes) {
        var _this = this;
        this.init = function (index) {
            _this.attribute["Game"].val['index'] = index;
        };
        this.update = function () {
            if (!_this.attribute["Game"].val['active']) {
                _this.finit();
                return;
            }
            for (var key in _this.component) {
                _this.component[key].update(_this.attribute);
            }
        };
        this.finit = function () {
            entities.removeEntity(_this.attribute["Game"].val['index']);
        };
        this.component = {};
        for (var key in components) {
            this.component[components[key].id] = components[key];
        }
        this.attribute = {};
        for (var key in attributes) {
            this.attribute[attributes[key].id] = attributes[key];
        }
    }
    return Entity;
}());
function gameLoop() {
    requestAnimationFrame(gameLoop);
    systems.updateSystems();
    entities.updateEntities();
}
var systems = new SystemContext();
var entities = new EntityContext();
window.onload = function () {
    systems.addSystem(new PhysicsSystem());
    systems.addSystem(new InputSystem());
    systems.addSystem(new GameSystem());
    systems.addSystem(new GraphicsSystem());
    gameLoop();
};
//# sourceMappingURL=main.js.map