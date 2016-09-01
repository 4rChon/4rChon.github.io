define("Attribute/Attribute", ["require", "exports"], function (require, exports) {
    "use strict";
    var Attribute = (function () {
        function Attribute(id, val) {
            this.id = "";
            this.val = {};
            this.id = id;
            this.val = val;
        }
        return Attribute;
    }());
    exports.Attribute = Attribute;
});
define("Attribute/package", ["require", "exports", "Attribute/Attribute"], function (require, exports, Attribute_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(Attribute_1);
});
define("Component/Component", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Component/BulletAI", ["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.BulletAI = BulletAI;
});
define("System/System", ["require", "exports"], function (require, exports) {
    "use strict";
    var SystemState;
    (function (SystemState) {
        SystemState[SystemState["None"] = 0] = "None";
        SystemState[SystemState["Init"] = 1] = "Init";
        SystemState[SystemState["Update"] = 2] = "Update";
        SystemState[SystemState["Finit"] = 3] = "Finit";
    })(SystemState || (SystemState = {}));
    exports.SystemState = SystemState;
});
define("Util/Util", ["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.Vector = Vector;
    function sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }
    exports.sign = sign;
});
define("System/GameSystem", ["require", "exports", "System/System", "Globals", "Util/Util", "Attribute/package", "Component/package", "Entity/package"], function (require, exports, System_1, Globals_1, Util_1, package_1, package_2, package_3) {
    "use strict";
    var GameSystem = (function () {
        function GameSystem() {
            var _this = this;
            this.score = 0;
            this.currentScore = 0;
            this.spawnTimer = 0;
            this.spawnAmount = 0;
            this.spawnAmountCost = 0;
            this.spawnTimerMax = 0;
            this.spawnTimerCost = 0;
            this.weaponPowerCost = 0;
            this.weaponRateCost = 0;
            this.init = function () {
                _this.state = System_1.SystemState.Init;
                _this.score = 0;
                _this.currentScore = 0;
                _this.spawnAmountCost = 100;
                _this.spawnTimerCost = 100;
                _this.weaponPowerCost = 100;
                _this.weaponRateCost = 100;
                _this.spawnTimer = 0;
                _this.spawnAmount = 1;
                _this.spawnTimerMax = 25;
                _this.spawnPlayer(new Util_1.Vector(Globals_1.WIDTH / 2, Globals_1.HEIGHT / 2), new Util_1.Vector(0, 0), new Util_1.Vector(10, 10));
            };
            this.update = function () {
                _this.state = System_1.SystemState.Update;
                _this.updateSpawn();
                _this.updateScore();
            };
            this.finit = function () {
                _this.state = System_1.SystemState.Finit;
            };
            this.updateSpawn = function () {
                _this.spawnTimer++;
                if (_this.spawnTimer >= _this.spawnTimerMax) {
                    for (var i = 0; i < _this.spawnAmount; i++) {
                        var x = Math.floor((Math.random() * Globals_1.WIDTH) + 1);
                        var y = Math.floor((Math.random() * Globals_1.HEIGHT) + 1);
                        _this.spawnEnemy(new Util_1.Vector(x, y), new Util_1.Vector(0, 0), new Util_1.Vector(15, 15));
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
                if (_this.score < _this.weaponPowerCost) {
                    console.log("Not enough score");
                    return;
                }
                var weapon = Globals_1.entities.getPlayer().attribute['Weapon'];
                _this.score -= _this.weaponPowerCost;
                _this.weaponPowerCost += 25;
                weapon.val['power']++;
            };
            this.upgradeCooldown = function () {
                var weapon = Globals_1.entities.getPlayer().attribute['Weapon'];
                if (weapon.val['cooldown'] == 1) {
                    console.log("Already at minimum cooldown");
                    return;
                }
                if (_this.score < _this.weaponRateCost) {
                    console.log("Not enough score");
                    return;
                }
                _this.score -= _this.weaponRateCost;
                _this.weaponRateCost += 50;
                weapon.val['cooldown']--;
            };
            this.upgradeSpawnRate = function () {
                if (_this.score < _this.spawnTimerCost) {
                    console.log("Not enough score");
                    return;
                }
                _this.score -= _this.spawnTimerCost;
                _this.spawnTimerCost += 75;
                if (_this.spawnTimerMax > 0) {
                    _this.spawnTimerMax--;
                }
            };
            this.upgradeSpawnAmount = function () {
                if (_this.score < _this.spawnAmountCost) {
                    console.log("Not enough score");
                    return;
                }
                _this.score -= _this.spawnAmountCost;
                _this.spawnAmountCost *= 2;
                _this.spawnAmount++;
            };
            this.spawnPlayer = function (position, velocity, dimensions) {
                var playerComponents = [
                    new package_2.EntityGraphics(),
                    new package_2.EntityPhysics(),
                    new package_2.EntityCollision(),
                    new package_2.PlayerInput(),
                    new package_2.PlayerAI()
                ];
                var playerAttributes = [
                    new package_1.Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
                    new package_1.Attribute("Sprite", { 'color': "black" }),
                    new package_1.Attribute("Physics", { 'velocity': velocity, 'acceleration': 3, 'drag': 1, 'terminalVelocity': 15 }),
                    new package_1.Attribute("Collision", { 'collidingWith': 'Nothing' }),
                    new package_1.Attribute("Game", { 'index': -1, 'type': 'Player', 'active': true }),
                    new package_1.Attribute("Weapon", { 'cooldown': 10, 'power': 20 })
                ];
                var player = new package_3.Entity(playerComponents, playerAttributes);
                Globals_1.entities.addEntity(player);
            };
            this.spawnEnemy = function (position, velocity, dimensions) {
                var enemyComponents = [
                    new package_2.EntityGraphics(),
                    new package_2.EntityPhysics(),
                    new package_2.EntityCollision(),
                    new package_2.EnemyAI()
                ];
                var enemyAttributes = [
                    new package_1.Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
                    new package_1.Attribute("Sprite", { 'color': "red" }),
                    new package_1.Attribute("Physics", { 'velocity': velocity, 'acceleration': 2, 'drag': 1, 'terminalVelocity': 20 }),
                    new package_1.Attribute("Collision", { 'collidingWith': 'Nothing' }),
                    new package_1.Attribute("Game", { 'index': -1, 'type': 'Enemy', 'active': true })
                ];
                var enemy = new package_3.Entity(enemyComponents, enemyAttributes);
                Globals_1.entities.addEntity(enemy);
            };
            this.spawnBullet = function (position, velocity, dimensions) {
                var bulletComponents = [
                    new package_2.EntityGraphics(),
                    new package_2.EntityPhysics(),
                    new package_2.EntityCollision(),
                    new package_2.BulletAI()
                ];
                var bulletAttributes = [
                    new package_1.Attribute("Transform", { 'position': position, dimensions: dimensions }),
                    new package_1.Attribute("Sprite", { 'color': "black" }),
                    new package_1.Attribute("Physics", { 'velocity': velocity, 'acceleration': 0, 'drag': 1, 'terminalVelocity': 100 }),
                    new package_1.Attribute("Collision", { 'collidingWith': 'Nothing' }),
                    new package_1.Attribute("Game", { 'index': -1, 'type': 'Bullet', 'active': true })
                ];
                var bullet = new package_3.Entity(bulletComponents, bulletAttributes);
                Globals_1.entities.addEntity(bullet);
            };
            this.id = 'Game';
            this.state = System_1.SystemState.None;
        }
        return GameSystem;
    }());
    exports.GameSystem = GameSystem;
});
define("System/GraphicsSystem", ["require", "exports", "System/System", "Globals"], function (require, exports, System_2, Globals_2) {
    "use strict";
    var GraphicsSystem = (function () {
        function GraphicsSystem() {
            var _this = this;
            this.id = "";
            this.init = function () {
                _this.state = System_2.SystemState.Init;
                var canvas = document.createElement("canvas");
                canvas.width = Globals_2.WIDTH;
                canvas.height = Globals_2.HEIGHT;
                document.getElementById("canvasContainer").appendChild(canvas);
                _this.canvasContext = canvas.getContext("2d");
            };
            this.update = function () {
                _this.state = System_2.SystemState.Update;
                _this.clear();
                _this.renderScore();
                _this.renderCooldown();
                _this.renderPower();
                _this.renderSpawnRate();
                _this.renderSpawnAmount();
            };
            this.finit = function () {
                _this.state = System_2.SystemState.Finit;
            };
            this.clear = function () {
                _this.canvasContext.fillStyle = "white";
                _this.canvasContext.fillRect(0, 0, Globals_2.WIDTH, Globals_2.HEIGHT);
            };
            this.renderScore = function () {
                _this.canvasContext.fillStyle = "#eee";
                _this.canvasContext.font = "400px Arial";
                _this.canvasContext.textAlign = "center";
                _this.canvasContext.fillText("" + Globals_2.systems.getSystem('Game').getCurrentScore(), Globals_2.WIDTH / 2, Globals_2.HEIGHT / 2);
            };
            this.renderCooldown = function () {
                _this.canvasContext.fillStyle = "#999";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("y", 50, 50);
                _this.canvasContext.fillText("+", 70, 50);
                _this.canvasContext.fillText("-" + Globals_2.entities.getPlayer().attribute['Weapon'].val['cooldown'], 90, 50);
                _this.canvasContext.fillText("(" + Globals_2.systems.getSystem('Game').weaponRateCost + ')', 130, 50);
            };
            this.renderPower = function () {
                _this.canvasContext.fillStyle = "#999";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("u", 50, 100);
                _this.canvasContext.fillText("+", 70, 100);
                _this.canvasContext.fillText("*" + Globals_2.entities.getPlayer().attribute['Weapon'].val['power'], 90, 100);
                _this.canvasContext.fillText("(" + Globals_2.systems.getSystem('Game').weaponPowerCost + ')', 130, 100);
            };
            this.renderSpawnRate = function () {
                _this.canvasContext.fillStyle = "#999";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("i", 50, 150);
                _this.canvasContext.fillText("+", 70, 150);
                _this.canvasContext.fillText("/" + Globals_2.systems.getSystem('Game').spawnTimerMax, 90, 150);
                _this.canvasContext.fillText("(" + Globals_2.systems.getSystem('Game').spawnTimerCost + ')', 130, 150);
            };
            this.renderSpawnAmount = function () {
                _this.canvasContext.fillStyle = "#999";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("o", 50, 200);
                _this.canvasContext.fillText("+", 70, 200);
                _this.canvasContext.fillText("x" + Globals_2.systems.getSystem('Game').spawnAmount, 90, 200);
                _this.canvasContext.fillText("(" + Globals_2.systems.getSystem('Game').spawnAmountCost + ')', 130, 200);
            };
            this.id = "Graphics";
            this.state = System_2.SystemState.None;
        }
        return GraphicsSystem;
    }());
    exports.GraphicsSystem = GraphicsSystem;
});
define("System/InputSystem", ["require", "exports", "System/System"], function (require, exports, System_3) {
    "use strict";
    var InputSystem = (function () {
        function InputSystem() {
            var _this = this;
            this.keyCallback = {};
            this.keyDown = {};
            this.init = function () {
                _this.state = System_3.SystemState.Init;
                document.addEventListener('keydown', _this.keyboardDown);
                document.addEventListener('keyup', _this.keyboardUp);
            };
            this.update = function () {
                _this.state = System_3.SystemState.Update;
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
                _this.state = System_3.SystemState.Finit;
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
            this.state = System_3.SystemState.None;
        }
        return InputSystem;
    }());
    exports.InputSystem = InputSystem;
});
define("System/PhysicsSystem", ["require", "exports", "System/System"], function (require, exports, System_4) {
    "use strict";
    var PhysicsSystem = (function () {
        function PhysicsSystem() {
            var _this = this;
            this.init = function () {
                _this.state = System_4.SystemState.Init;
            };
            this.update = function () {
                _this.state = System_4.SystemState.Update;
            };
            this.finit = function () {
                _this.state = System_4.SystemState.Finit;
            };
            this.id = 'Physics';
            this.state = System_4.SystemState.None;
        }
        return PhysicsSystem;
    }());
    exports.PhysicsSystem = PhysicsSystem;
});
define("System/package", ["require", "exports", "System/GameSystem", "System/GraphicsSystem", "System/InputSystem", "System/PhysicsSystem", "System/System"], function (require, exports, GameSystem_1, GraphicsSystem_1, InputSystem_1, PhysicsSystem_1, System_5) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(GameSystem_1);
    __export(GraphicsSystem_1);
    __export(InputSystem_1);
    __export(PhysicsSystem_1);
    __export(System_5);
});
define("Component/EnemyAI", ["require", "exports", "Globals"], function (require, exports, Globals_3) {
    "use strict";
    var EnemyAI = (function () {
        function EnemyAI() {
            this.id = "";
            this.update = function (attribute) {
                var player = Globals_3.entities.getPlayer();
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
                    Globals_3.systems.getSystem("Game").addScore(5);
                    attribute["Game"].val['active'] = false;
                }
                else if (attribute["Collision"].val['collidingWith'] === 'Player') {
                    Globals_3.systems.getSystem("Game").reduceScore(20);
                    attribute["Game"].val['active'] = false;
                }
            };
            this.id = "AI";
        }
        return EnemyAI;
    }());
    exports.EnemyAI = EnemyAI;
});
define("Component/EntityCollision", ["require", "exports", "Globals", "Util/Util"], function (require, exports, Globals_4, Util_2) {
    "use strict";
    var EntityCollision = (function () {
        function EntityCollision() {
            this.id = "";
            this.update = function (attribute) {
                var entityList = Globals_4.entities.entity;
                for (var key in entityList) {
                    if (key == attribute["Game"].val['index'])
                        continue;
                    if (attribute["Collision"].val['collidingWith'] !== 'Nothing')
                        return;
                    var collideWith = {};
                    collideWith['position'] = entityList[key].attribute["Transform"].val['position'];
                    collideWith['dimensions'] = entityList[key].attribute["Transform"].val['dimensions'];
                    var dimensions = new Util_2.Vector(0, 0);
                    dimensions.add(collideWith['dimensions']);
                    dimensions.add(attribute["Transform"].val['dimensions']);
                    dimensions.multiply(0.5);
                    var difference = new Util_2.Vector(0, 0);
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
    exports.EntityCollision = EntityCollision;
});
define("Component/EntityGraphics", ["require", "exports", "Globals"], function (require, exports, Globals_5) {
    "use strict";
    var EntityGraphics = (function () {
        function EntityGraphics() {
            this.id = "";
            this.update = function (attribute) {
                var transform = attribute["Transform"];
                var sprite = attribute["Sprite"];
                var ctxt = Globals_5.systems.getSystem("Graphics").canvasContext;
                ctxt.fillStyle = sprite.val['color'];
                ctxt.fillRect(transform.val['position'].x, transform.val['position'].y, transform.val['dimensions'].x, transform.val['dimensions'].y);
            };
            this.id = "Graphics";
        }
        return EntityGraphics;
    }());
    exports.EntityGraphics = EntityGraphics;
});
define("Component/EntityPhysics", ["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.EntityPhysics = EntityPhysics;
});
define("Component/PlayerAI", ["require", "exports", "Globals", "Util/Util"], function (require, exports, Globals_6, Util_3) {
    "use strict";
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
                var orientation = new Util_3.Vector(0, 0);
                orientation.copy(_this.physics.val['velocity']);
                if (orientation.magnitude() == 0) {
                    orientation.copy(_this.lastOrientation);
                }
                orientation.normalize().multiply(-_this.weapon.val['power']);
                _this.lastOrientation.copy(orientation);
                var position = _this.transform.val['position'];
                Globals_6.systems.getSystem("Game").spawnBullet(new Util_3.Vector(position.x, position.y), orientation, new Util_3.Vector(5, 5));
            };
            this.id = "AI";
            this.cooldown = 0;
            this.lastOrientation = new Util_3.Vector(1, 0);
        }
        return PlayerAI;
    }());
    exports.PlayerAI = PlayerAI;
});
define("Component/PlayerInput", ["require", "exports", "Globals"], function (require, exports, Globals_7) {
    "use strict";
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
            var inputSystem = Globals_7.systems.getSystem("Input");
            var gameSystem = Globals_7.systems.getSystem("Game");
            inputSystem.addKeycodeCallback(65, this.left);
            inputSystem.addKeycodeCallback(87, this.up);
            inputSystem.addKeycodeCallback(83, this.down);
            inputSystem.addKeycodeCallback(68, this.right);
            inputSystem.addKeycodeCallback(89, gameSystem.upgradeCooldown);
            inputSystem.addKeycodeCallback(85, gameSystem.upgradePower);
            inputSystem.addKeycodeCallback(73, gameSystem.upgradeSpawnRate);
            inputSystem.addKeycodeCallback(79, gameSystem.upgradeSpawnAmount);
        }
        return PlayerInput;
    }());
    exports.PlayerInput = PlayerInput;
});
define("Component/package", ["require", "exports", "Component/BulletAI", "Component/EnemyAI", "Component/EntityCollision", "Component/EntityGraphics", "Component/EntityPhysics", "Component/PlayerAI", "Component/PlayerInput"], function (require, exports, BulletAI_1, EnemyAI_1, EntityCollision_1, EntityGraphics_1, EntityPhysics_1, PlayerAI_1, PlayerInput_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(BulletAI_1);
    __export(EnemyAI_1);
    __export(EntityCollision_1);
    __export(EntityGraphics_1);
    __export(EntityPhysics_1);
    __export(PlayerAI_1);
    __export(PlayerInput_1);
});
define("Entity/Entity", ["require", "exports", "Globals"], function (require, exports, Globals_8) {
    "use strict";
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
                Globals_8.entities.removeEntity(_this.attribute["Game"].val['index']);
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
    exports.Entity = Entity;
});
define("Entity/package", ["require", "exports", "Entity/Entity"], function (require, exports, Entity_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(Entity_1);
});
define("Context/EntityContext", ["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.EntityContext = EntityContext;
});
define("Context/SystemContext", ["require", "exports", "System/package"], function (require, exports, package_4) {
    "use strict";
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
                    if (_this.system[key].state == package_4.SystemState.None)
                        _this.system[key].init();
                    _this.system[key].update();
                }
            };
            this.system = {};
        }
        return SystemContext;
    }());
    exports.SystemContext = SystemContext;
});
define("Context/package", ["require", "exports", "Context/EntityContext", "Context/SystemContext"], function (require, exports, EntityContext_1, SystemContext_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(EntityContext_1);
    __export(SystemContext_1);
});
define("Globals", ["require", "exports", "Context/package"], function (require, exports, package_5) {
    "use strict";
    var WIDTH = 1024;
    exports.WIDTH = WIDTH;
    var HEIGHT = 1024;
    exports.HEIGHT = HEIGHT;
    var systems = new package_5.SystemContext();
    exports.systems = systems;
    var entities = new package_5.EntityContext();
    exports.entities = entities;
});
define("main", ["require", "exports", "Globals", "System/package"], function (require, exports, Globals_9, package_6) {
    "use strict";
    function gameLoop() {
        requestAnimationFrame(gameLoop);
        Globals_9.systems.updateSystems();
        Globals_9.entities.updateEntities();
    }
    window.onload = function () {
        Globals_9.systems.addSystem(new package_6.PhysicsSystem());
        Globals_9.systems.addSystem(new package_6.InputSystem());
        Globals_9.systems.addSystem(new package_6.GameSystem());
        Globals_9.systems.addSystem(new package_6.GraphicsSystem());
        gameLoop();
    };
});
//# sourceMappingURL=main.js.map