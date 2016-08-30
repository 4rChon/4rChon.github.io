var WIDTH = 1024;
var HEIGHT = 1024;
function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}
var SystemContext = (function () {
    function SystemContext() {
        var _this = this;
        this.addSystem = function (system) {
            system.init();
            _this.system[system.id] = system;
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
            console.log("Create: " + entity.index + ' : ' + entity.attribute['Game'].val['type']);
        };
        this.getEntity = function (index) {
            return _this.entity[index];
        };
        this.getPlayer = function () {
            return _this.player;
        };
        this.removeEntity = function (index) {
            console.log("Destroy: " + _this.entity[index] + ' : ' + _this.entity[index].attribute['Game'].val['type']);
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
            var canvas = document.createElement("canvas");
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            document.getElementById("canvasContainer").appendChild(canvas);
            _this.canvasContext = canvas.getContext("2d");
        };
        this.clear = function () {
            _this.canvasContext.fillStyle = "white";
            _this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        };
        this.update = function () {
            _this.clear();
        };
        this.finit = function () {
        };
        this.id = "Graphics";
    }
    return GraphicsSystem;
}());
var PhysicsSystem = (function () {
    function PhysicsSystem() {
        this.id = "";
        this.init = function () {
        };
        this.update = function () {
        };
        this.finit = function () {
        };
    }
    return PhysicsSystem;
}());
var InputSystem = (function () {
    function InputSystem() {
        var _this = this;
        this.id = "";
        this.keyCallback = {};
        this.keyDown = {};
        this.init = function () {
            document.addEventListener('keydown', _this.keyboardDown);
            document.addEventListener('keyup', _this.keyboardUp);
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
        this.update = function () {
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
        };
        this.id = "Input";
    }
    return InputSystem;
}());
var GameSystem = (function () {
    function GameSystem() {
        var _this = this;
        this.id = "";
        this.spawnTimer = 0;
        this.maxTimer = 25;
        this.init = function () {
            _this.spawnPlayer(WIDTH / 2, HEIGHT / 2);
        };
        this.update = function () {
            _this.spawnTimer++;
            if (_this.spawnTimer == _this.maxTimer) {
                var x = Math.floor((Math.random() * WIDTH) + 1);
                var y = Math.floor((Math.random() * HEIGHT) + 1);
                _this.spawnEnemy(x, y);
                _this.spawnTimer = 0;
            }
        };
        this.finit = function () {
        };
        this.spawnPlayer = function (x, y) {
            var playerComponents = [
                new EntityGraphics(),
                new EntityPhysics(),
                new PlayerInput()
            ];
            var playerAttributes = [
                new Attribute("Transform", { 'x': x, 'y': y, 'w': 10, 'h': 10 }),
                new Attribute("Sprite", { 'color': "black" }),
                new Attribute("Physics", { 'dx': 0, 'dy': 0, 'acceleration': 3, 'drag': 1, 'terminalVelocity': 15 }),
                new Attribute("Game", { 'type': 'Player', 'active': true }),
                new Attribute("Weapon", { 'rate': 5, 'power': 20 })
            ];
            var player = new Entity(playerComponents, playerAttributes);
            entities.addEntity(player);
        };
        this.spawnEnemy = function (x, y) {
            var enemyComponents = [
                new EntityGraphics(),
                new EntityPhysics(),
                new EnemyAI()
            ];
            var enemyAttributes = [
                new Attribute("Transform", { 'x': x, 'y': y, 'w': 15, 'h': 15 }),
                new Attribute("Sprite", { 'color': "red" }),
                new Attribute("Physics", { 'dx': 0, 'dy': 0, 'acceleration': 2, 'drag': 1, 'terminalVelocity': 20 }),
                new Attribute("Game", { 'type': 'Enemy', 'active': true })
            ];
            var enemy = new Entity(enemyComponents, enemyAttributes);
            entities.addEntity(enemy);
        };
        this.spawnBullet = function (x, y, dx, dy) {
            var bulletComponents = [
                new EntityGraphics(),
                new EntityPhysics(),
                new BulletAI()
            ];
            var bulletAttributes = [
                new Attribute("Transform", { 'x': x, 'y': y, 'w': 5, 'h': 5 }),
                new Attribute("Sprite", { 'color': "black" }),
                new Attribute("Physics", { 'dx': dx, 'dy': dy, 'acceleration': 0, 'drag': 1, 'terminalVelocity': 100 }),
                new Attribute("Game", { 'type': 'Bullet', 'active': true })
            ];
            var bullet = new Entity(bulletComponents, bulletAttributes);
            entities.addEntity(bullet);
        };
        this.id = "Game";
        this.spawnTimer = 0;
    }
    return GameSystem;
}());
var EntityGraphics = (function () {
    function EntityGraphics() {
        this.id = "";
        this.update = function (attribute) {
            var transform = attribute["Transform"];
            var sprite = attribute["Sprite"];
            var ctxt = systems.system["Graphics"].canvasContext;
            ctxt.fillStyle = sprite.val['color'];
            ctxt.fillRect(transform.val['x'], transform.val['y'], transform.val['w'], transform.val['h']);
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
            if (Math.abs(physics.val['dx']) > physics.val['terminalVelocity'])
                physics.val['dx'] = physics.val['terminalVelocity'] * sign(physics.val['dx']);
            if (Math.abs(physics.val['dy']) > physics.val['terminalVelocity'])
                physics.val['dy'] = physics.val['terminalVelocity'] * sign(physics.val['dy']);
            transform.val['x'] += physics.val['dx'];
            transform.val['y'] += physics.val['dy'];
            if (Math.abs(physics.val['dx']) > 0)
                physics.val['dx'] -= physics.val['drag'] * sign(physics.val['dx']);
            if (Math.abs(physics.val['dy']) > 0)
                physics.val['dy'] -= physics.val['drag'] * sign(physics.val['dy']);
        };
        this.id = "Physics";
    }
    return EntityPhysics;
}());
var PlayerInput = (function () {
    function PlayerInput() {
        var _this = this;
        this.id = "";
        this.lastDx = 1;
        this.lastDy = 0;
        this.update = function (attribute) {
            _this.physics = attribute["Physics"];
            _this.transform = attribute["Transform"];
            _this.weapon = attribute["Weapon"];
            _this.cooldown++;
        };
        this.left = function () {
            if (_this.physics.val['dx'] > 0)
                _this.physics.val['dx'] = 0;
            _this.physics.val['dx'] -= _this.physics.val['acceleration'];
        };
        this.up = function () {
            if (_this.physics.val['dy'] > 0)
                _this.physics.val['dy'] = 0;
            _this.physics.val['dy'] -= _this.physics.val['acceleration'];
        };
        this.down = function () {
            if (_this.physics.val['dy'] < 0)
                _this.physics.val['dy'] = 0;
            _this.physics.val['dy'] += _this.physics.val['acceleration'];
        };
        this.right = function () {
            if (_this.physics.val['dx'] < 0)
                _this.physics.val['dx'] = 0;
            _this.physics.val['dx'] += _this.physics.val['acceleration'];
        };
        this.fire = function () {
            if (_this.cooldown >= _this.weapon.val['rate']) {
                var dx = _this.physics.val['dx'];
                var dy = _this.physics.val['dy'];
                if (dx == 0 && dy == 0) {
                    dx = _this.lastDx;
                    dy = _this.lastDy;
                }
                dx = -sign(dx) * _this.weapon.val['power'];
                dy = -sign(dy) * _this.weapon.val['power'];
                _this.lastDx = dx;
                _this.lastDy = dy;
                systems.system["Game"].spawnBullet(_this.transform.val['x'], _this.transform.val['y'], dx, dy);
                _this.cooldown = 0;
            }
        };
        this.id = "Input";
        this.cooldown = 0;
        var inputSystem = systems.system["Input"];
        inputSystem.addKeycodeCallback(65, this.left);
        inputSystem.addKeycodeCallback(87, this.up);
        inputSystem.addKeycodeCallback(83, this.down);
        inputSystem.addKeycodeCallback(68, this.right);
        inputSystem.addKeycodeCallback(32, this.fire);
    }
    return PlayerInput;
}());
var EnemyAI = (function () {
    function EnemyAI() {
        this.id = "";
        this.update = function (attribute) {
            var player = entities.getPlayer();
            var playerTransform = player.attribute["Transform"].val;
            var enemyPhysics = attribute["Physics"].val;
            if (playerTransform['x'] < attribute["Transform"].val['x'])
                enemyPhysics['dx'] -= enemyPhysics['acceleration'];
            if (playerTransform['x'] > attribute["Transform"].val['x'])
                enemyPhysics['dx'] += enemyPhysics['acceleration'];
            if (playerTransform['y'] < attribute["Transform"].val['y'])
                enemyPhysics['dy'] -= enemyPhysics['acceleration'];
            if (playerTransform['y'] > attribute["Transform"].val['y'])
                enemyPhysics['dy'] += enemyPhysics['acceleration'];
        };
        this.id = "AI";
    }
    return EnemyAI;
}());
var BulletAI = (function () {
    function BulletAI() {
        this.update = function (attribute) {
            if (attribute["Physics"].val['dx'] == 0 && attribute["Physics"].val['dy'] == 0)
                attribute["Game"].val['active'] = false;
        };
        this.id = "AI";
    }
    return BulletAI;
}());
var EntityCollision = (function () {
    function EntityCollision() {
        this.update = function (attribtue) {
        };
        this.id = "Collision";
    }
    return EntityCollision;
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
            _this.index = index;
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
            entities.removeEntity(_this.index);
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
    systems.addSystem(new GraphicsSystem());
    systems.addSystem(new PhysicsSystem());
    systems.addSystem(new InputSystem());
    systems.addSystem(new GameSystem());
    gameLoop();
};
//# sourceMappingURL=main.js.map