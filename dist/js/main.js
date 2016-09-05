define("Attribute/Attribute", ["require", "exports"], function (require, exports) {
    "use strict";
    var Attribute = (function () {
        function Attribute(id, val) {
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
            this.update = function (attribute) {
                if (attribute["Physics"].val["velocity"].magnitude() <= 1)
                    attribute["Game"].val["active"] = false;
                var collisionList = attribute["Collision"].val["collidingWith"];
                for (var key in collisionList) {
                    if (collisionList[key].attribute["type"] === "Enemy") {
                        attribute["Game"].val["active"] = false;
                        return;
                    }
                }
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
                if (magnitude == 0)
                    _this.zero();
                else {
                    var ratio = magnitude / _this.magnitude();
                    console.log("Ratio: ", magnitude, "/", _this.magnitude(), " = ", ratio);
                }
                //this.x *= ratio;//magnitude * Math.cos(angle) * sign(this.x);
                //this.y *= ratio;//magnitude * Math.sin(angle) * sign(this.y);
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
            this.getCopy = function () {
                return new Vector(_this.x, _this.y);
            };
            this.rotate = function (radians) {
                var cos = Math.cos(radians);
                var sin = Math.sin(radians);
                var x = (cos * _this.x) + (sin * _this.y);
                var y = (cos * _this.y) - (sin * _this.x);
                _this.x = x;
                _this.y = y;
            };
            this.getRotate = function (radians) {
                var cos = Math.cos(radians);
                var sin = Math.sin(radians);
                var x = (cos * _this.x) + (sin * _this.y);
                var y = (cos * _this.y) - (sin * _this.x);
                return new Vector(x, y);
            };
            this.getAngle = function () {
                var angle = Math.atan2(_this.y, _this.x);
                return angle;
                //if (this.x > 0 && this.y > 0)
                //    return angle;
                //if (this.x < 0 && this.y > 0)
                //    return (Math.PI * 4) + angle;
                //else
                //    return Math.PI * 2 + angle;
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
    var sign = function (x) {
        return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    };
    exports.sign = sign;
    var add = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };
    exports.add = add;
    var multiply = function (v, value) {
        return new Vector(v.x * value, v.y * value);
    };
    exports.multiply = multiply;
    var subtract = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    };
    exports.subtract = subtract;
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
                _this.spawnPlayer(new Util_1.Vector(Globals_1.WIDTH / 2, Globals_1.HEIGHT / 2), new Util_1.Vector(0, 0), new Util_1.Vector(0, 0), new Util_1.Vector(10, 10));
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
                        _this.spawnEnemy(new Util_1.Vector(x, y), new Util_1.Vector(0, 0), new Util_1.Vector(0, 0), new Util_1.Vector(15, 15));
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
                var weapon = Globals_1.entities.getPlayer().attribute["Weapon"];
                _this.score -= _this.weaponPowerCost;
                _this.weaponPowerCost += 25;
                weapon.val["power"]++;
            };
            this.upgradeCooldown = function () {
                var weapon = Globals_1.entities.getPlayer().attribute["Weapon"];
                if (weapon.val["cooldown"] === 1) {
                    console.log("Already at minimum cooldown");
                    return;
                }
                if (_this.score < _this.weaponRateCost) {
                    console.log("Not enough score");
                    return;
                }
                _this.score -= _this.weaponRateCost;
                _this.weaponRateCost += 50;
                weapon.val["cooldown"]--;
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
            this.spawnPlayer = function (position, velocity, force, dimensions) {
                var playerComponents = [
                    new package_2.EntityPhysics(),
                    new package_2.PlayerInput(),
                    new package_2.PlayerAI(),
                    new package_2.EntityCollision(),
                    new package_2.EntityGraphics()
                ];
                var playerAttributes = [
                    new package_1.Attribute("Game", { "index": -1, "type": "Player", "active": true }),
                    new package_1.Attribute("Transform", { "position": position, "dimensions": dimensions }),
                    new package_1.Attribute("Sprite", { "color": "black" }),
                    new package_1.Attribute("Physics", { "mass": 10, "velocity": velocity, "force": force, "power": 8, "acceleration": 0, "drag": 1 }),
                    new package_1.Attribute("Collision", { "collidingWith": {} }),
                    new package_1.Attribute("Weapon", { "cooldown": 5, "power": 20 })
                ];
                var player = new package_3.Entity(playerComponents, playerAttributes);
                Globals_1.entities.addEntity(player);
            };
            this.spawnEnemy = function (position, velocity, force, dimensions) {
                var enemyComponents = [
                    new package_2.EntityPhysics(),
                    new package_2.EnemyAI(),
                    new package_2.EntityCollision(),
                    new package_2.EntityGraphics()
                ];
                var enemyAttributes = [
                    new package_1.Attribute("Game", { "index": -1, "type": "Enemy", "active": true }),
                    new package_1.Attribute("Transform", { "position": position, "dimensions": dimensions }),
                    new package_1.Attribute("Sprite", { "color": "red" }),
                    new package_1.Attribute("Physics", { "mass": 10, "velocity": velocity, "force": force, "power": 4, "acceleration": 0, "drag": 1 }),
                    new package_1.Attribute("Collision", { "collidingWith": {} })
                ];
                var enemy = new package_3.Entity(enemyComponents, enemyAttributes);
                Globals_1.entities.addEntity(enemy);
            };
            this.spawnBullet = function (position, velocity, force, dimensions) {
                var bulletComponents = [
                    new package_2.EntityPhysics(),
                    new package_2.BulletAI(),
                    new package_2.EntityCollision(),
                    new package_2.EntityGraphics()
                ];
                var bulletAttributes = [
                    new package_1.Attribute("Game", { "index": -1, "type": "Bullet", "active": true }),
                    new package_1.Attribute("Transform", { "position": position, dimensions: dimensions }),
                    new package_1.Attribute("Sprite", { "color": "black" }),
                    new package_1.Attribute("Physics", { "mass": 2, "velocity": velocity, "force": force, "power": 0, "acceleration": 0, "drag": 5 }),
                    new package_1.Attribute("Collision", { "collidingWith": {} })
                ];
                var bullet = new package_3.Entity(bulletComponents, bulletAttributes);
                Globals_1.entities.addEntity(bullet);
            };
            this.id = "Game";
            this.state = System_1.SystemState.None;
        }
        return GameSystem;
    }());
    exports.GameSystem = GameSystem;
});
define("System/GraphicsSystem", ["require", "exports", "System/package", "Globals"], function (require, exports, package_4, Globals_2) {
    "use strict";
    var GraphicsSystem = (function () {
        function GraphicsSystem() {
            var _this = this;
            this.init = function () {
                _this.state = package_4.SystemState.Init;
                var canvas = document.createElement("canvas");
                canvas.width = Globals_2.WIDTH;
                canvas.height = Globals_2.HEIGHT;
                document.getElementById("canvasContainer").appendChild(canvas);
                _this.canvasContext = canvas.getContext("2d");
            };
            this.update = function () {
                _this.state = package_4.SystemState.Update;
                _this.clear();
                _this.renderScore();
                _this.renderCooldown();
                _this.renderPower();
                _this.renderSpawnRate();
                _this.renderSpawnAmount();
                _this.renderFPS();
                _this.renderUPS();
            };
            this.finit = function () {
                _this.state = package_4.SystemState.Finit;
            };
            this.clear = function () {
                _this.canvasContext.fillStyle = "white";
                _this.canvasContext.fillRect(0, 0, Globals_2.WIDTH, Globals_2.HEIGHT);
            };
            this.renderScore = function () {
                _this.canvasContext.fillStyle = "#eee";
                _this.canvasContext.font = "400px Arial";
                _this.canvasContext.textAlign = "center";
                _this.canvasContext.fillText("" + Globals_2.systems.getSystem("Game").getCurrentScore(), Globals_2.WIDTH / 2, Globals_2.HEIGHT / 2);
            };
            this.renderCooldown = function () {
                _this.canvasContext.fillStyle = "#999";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("y", 50, 50);
                _this.canvasContext.fillText("+", 70, 50);
                _this.canvasContext.fillText("-" + Globals_2.entities.getPlayer().attribute["Weapon"].val["cooldown"], 90, 50);
                _this.canvasContext.fillText("(" + Globals_2.systems.getSystem("Game").weaponRateCost + ")", 130, 50);
            };
            this.renderPower = function () {
                _this.canvasContext.fillStyle = "#999";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("u", 50, 100);
                _this.canvasContext.fillText("+", 70, 100);
                _this.canvasContext.fillText("*" + Globals_2.entities.getPlayer().attribute["Weapon"].val["power"], 90, 100);
                _this.canvasContext.fillText("(" + Globals_2.systems.getSystem("Game").weaponPowerCost + ")", 130, 100);
            };
            this.renderSpawnRate = function () {
                _this.canvasContext.fillStyle = "#999";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("i", 50, 150);
                _this.canvasContext.fillText("+", 70, 150);
                _this.canvasContext.fillText("/" + Globals_2.systems.getSystem("Game").spawnTimerMax, 90, 150);
                _this.canvasContext.fillText("(" + Globals_2.systems.getSystem("Game").spawnTimerCost + ")", 130, 150);
            };
            this.renderSpawnAmount = function () {
                _this.canvasContext.fillStyle = "#999";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("o", 50, 200);
                _this.canvasContext.fillText("+", 70, 200);
                _this.canvasContext.fillText("x" + Globals_2.systems.getSystem("Game").spawnAmount, 90, 200);
                _this.canvasContext.fillText("(" + Globals_2.systems.getSystem("Game").spawnAmountCost + ")", 130, 200);
            };
            this.renderFPS = function () {
                _this.canvasContext.fillStyle = "#0F0";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("FPS " + Math.round(Globals_2.systems.getSystem("Physics").fps * 100) / 100, Globals_2.WIDTH / 2, 50);
            };
            this.renderUPS = function () {
                _this.canvasContext.fillStyle = "#0F0";
                _this.canvasContext.font = "15px Arial";
                _this.canvasContext.fillText("UPS " + Math.round(Globals_2.systems.getSystem("Physics").updateCount * 100) / 100, Globals_2.WIDTH / 2, 100);
            };
            this.id = "Graphics";
            this.state = package_4.SystemState.None;
        }
        return GraphicsSystem;
    }());
    exports.GraphicsSystem = GraphicsSystem;
});
define("System/InputSystem", ["require", "exports", "System/System"], function (require, exports, System_2) {
    "use strict";
    var InputSystem = (function () {
        function InputSystem() {
            var _this = this;
            this.keyCallback = {};
            this.keyDown = {};
            this.init = function () {
                _this.state = System_2.SystemState.Init;
                document.addEventListener("keydown", _this.keyboardDown);
                document.addEventListener("keyup", _this.keyboardUp);
            };
            this.update = function () {
                _this.state = System_2.SystemState.Update;
                for (var key in _this.keyDown) {
                    var isDown = _this.keyDown[key];
                    if (isDown) {
                        var callback = _this.keyCallback[key];
                        if (callback != null) {
                            callback();
                        }
                    }
                }
            };
            this.finit = function () {
                _this.state = System_2.SystemState.Finit;
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
            this.id = "Input";
            this.state = System_2.SystemState.None;
        }
        return InputSystem;
    }());
    exports.InputSystem = InputSystem;
});
define("System/PhysicsSystem", ["require", "exports", "System/System", "Util/Util"], function (require, exports, System_3, Util_2) {
    "use strict";
    var PhysicsSystem = (function () {
        function PhysicsSystem() {
            var _this = this;
            this.init = function () {
                _this.state = System_3.SystemState.Init;
                _this.t = 0;
                _this.dt = 16;
                _this.currentTime = Date.now();
            };
            this.update = function () {
                _this.state = System_3.SystemState.Update;
                var newTime = Date.now();
                var frameTime = newTime - _this.currentTime;
                _this.currentTime = newTime;
                _this.t += frameTime;
                _this.fps = 1000 / frameTime;
                _this.updateCount = frameTime / _this.dt;
            };
            this.finit = function () {
                _this.state = System_3.SystemState.Finit;
            };
            this.calculateDrag = function (transform, physics) {
                var dragCoeff = physics.val["drag"];
                var fluidDensity = 0.002;
                //F_d = 1/2 * p * v^2 * C_d * A
                var drag = (1 / 2) * fluidDensity * dragCoeff * transform.val["dimensions"].x;
                var dragX = drag * Math.pow(physics.val["velocity"].x, 2) * Util_2.sign(physics.val["velocity"].x);
                var dragY = drag * Math.pow(physics.val["velocity"].y, 2) * Util_2.sign(physics.val["velocity"].y);
                dragX = Math.abs(dragX) > 0 && Math.abs(dragX) < 0.2 ? 0.2 * Util_2.sign(dragX) : dragX;
                dragY = Math.abs(dragY) > 0 && Math.abs(dragY) < 0.2 ? 0.2 * Util_2.sign(dragY) : dragY;
                return new Util_2.Vector(dragX, dragY);
            };
            this.id = "Physics";
            this.state = System_3.SystemState.None;
        }
        return PhysicsSystem;
    }());
    exports.PhysicsSystem = PhysicsSystem;
});
define("System/package", ["require", "exports", "System/GameSystem", "System/GraphicsSystem", "System/InputSystem", "System/PhysicsSystem", "System/System"], function (require, exports, GameSystem_1, GraphicsSystem_1, InputSystem_1, PhysicsSystem_1, System_4) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(GameSystem_1);
    __export(GraphicsSystem_1);
    __export(InputSystem_1);
    __export(PhysicsSystem_1);
    __export(System_4);
});
define("Component/EnemyAI", ["require", "exports", "Globals"], function (require, exports, Globals_3) {
    "use strict";
    var EnemyAI = (function () {
        function EnemyAI() {
            var _this = this;
            this.update = function (attribute) {
                var player = Globals_3.entities.getPlayer();
                var playerTransform = player.attribute["Transform"].val;
                var enemyPhysics = attribute["Physics"].val;
                if (playerTransform["position"].x < attribute["Transform"].val["position"].x)
                    enemyPhysics["force"].x = -enemyPhysics["power"];
                if (playerTransform["position"].x > attribute["Transform"].val["position"].x)
                    enemyPhysics["force"].x = enemyPhysics["power"];
                if (playerTransform["position"].y < attribute["Transform"].val["position"].y)
                    enemyPhysics["force"].y = -enemyPhysics["power"];
                if (playerTransform["position"].y > attribute["Transform"].val["position"].y)
                    enemyPhysics["force"].y = enemyPhysics["power"];
                var collisionList = attribute["Collision"].val["collidingWith"];
                for (var key in collisionList) {
                    if (key == attribute["Game"].val["index"])
                        continue;
                    var type = collisionList[key].attribute["Game"].val["type"];
                    ////console.log(type);
                    if (type === "Bullet") {
                        _this.gameSystem.addScore(5);
                        attribute["Game"].val["active"] = false;
                        return;
                    }
                    if (type === "Player") {
                        _this.gameSystem.reduceScore(20);
                        attribute["Game"].val["active"] = false;
                        return;
                    }
                    if (type === "Enemy") {
                        _this.gameSystem.addScore(1);
                        attribute["Game"].val["active"] = false;
                        return;
                    }
                }
            };
            this.id = "AI";
            this.gameSystem = Globals_3.systems.getSystem("Game");
        }
        return EnemyAI;
    }());
    exports.EnemyAI = EnemyAI;
});
define("Component/EntityCollision", ["require", "exports", "Globals", "Util/Util"], function (require, exports, Globals_4, Util_3) {
    "use strict";
    var EntityCollision = (function () {
        function EntityCollision() {
            this.update = function (attribute) {
                var entityList = Globals_4.entities.entity;
                for (var key in entityList) {
                    if (key === attribute["Game"].val["index"])
                        continue;
                    var collideWith = {};
                    collideWith["position"] = entityList[key].attribute["Transform"].val["position"];
                    collideWith["dimensions"] = entityList[key].attribute["Transform"].val["dimensions"];
                    var dimensions = new Util_3.Vector(0, 0);
                    dimensions.add(collideWith["dimensions"]);
                    dimensions.add(attribute["Transform"].val["dimensions"]);
                    dimensions.multiply(0.5);
                    var difference = new Util_3.Vector(0, 0);
                    difference.copy(collideWith["position"]);
                    difference.subtract(attribute["Transform"].val["position"]);
                    difference.x = Math.abs(difference.x);
                    difference.y = Math.abs(difference.y);
                    if (difference.x < dimensions.x && difference.y < dimensions.y) {
                        attribute["Collision"].val["collidingWith"][key] = entityList[key]; //.attribute["Game"].val["type"];
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
            var _this = this;
            this.update = function (attribute) {
                var transform = attribute["Transform"];
                var sprite = attribute["Sprite"];
                var ctxt = _this.graphicsSystem.canvasContext;
                ctxt.fillStyle = sprite.val["color"];
                ctxt.fillRect(transform.val["position"].x, transform.val["position"].y, transform.val["dimensions"].x, transform.val["dimensions"].y);
            };
            this.id = "Graphics";
            this.graphicsSystem = Globals_5.systems.getSystem("Graphics");
        }
        return EntityGraphics;
    }());
    exports.EntityGraphics = EntityGraphics;
});
define("Component/EntityPhysics", ["require", "exports", "Globals", "Util/Util"], function (require, exports, Globals_6, Util_4) {
    "use strict";
    var EntityPhysics = (function () {
        function EntityPhysics() {
            var _this = this;
            this.update = function (attribute) {
                var currentTransform = attribute["Transform"];
                var currentPhysics = attribute["Physics"];
                // a = F/m
                currentPhysics.val["acceleration"] = Util_4.multiply(currentPhysics.val["force"], 1 / currentPhysics.val["mass"]);
                var drag = _this.physicsSystem.calculateDrag(currentTransform, currentPhysics);
                currentPhysics.val["acceleration"].x -= drag.x;
                currentPhysics.val["acceleration"].y -= drag.y;
                // v += a
                currentPhysics.val["velocity"].add(currentPhysics.val["acceleration"]);
                currentTransform.val["position"].add(Util_4.multiply(currentPhysics.val["velocity"], _this.physicsSystem.updateCount));
                currentPhysics.val["force"].zero();
            };
            this.id = "Physics";
            this.physicsSystem = Globals_6.systems.getSystem("Physics");
        }
        return EntityPhysics;
    }());
    exports.EntityPhysics = EntityPhysics;
});
define("Component/PlayerAI", ["require", "exports", "Globals", "Util/Util"], function (require, exports, Globals_7, Util_5) {
    "use strict";
    var PlayerAI = (function () {
        function PlayerAI() {
            var _this = this;
            this.update = function (attribute) {
                _this.physics = attribute["Physics"];
                _this.transform = attribute["Transform"];
                _this.weapon = attribute["Weapon"];
                _this.cooldown += _this.physicsSystem.updateCount;
                if (_this.cooldown >= _this.weapon.val["cooldown"]) {
                    _this.fire();
                    _this.cooldown = 0;
                }
            };
            this.fire = function () {
                var orientation = new Util_5.Vector(0, 0);
                orientation.copy(_this.physics.val["velocity"]);
                if (orientation.magnitude() === 0) {
                    orientation.copy(_this.lastOrientation);
                }
                orientation.normalize().multiply(-_this.weapon.val["power"]);
                _this.lastOrientation.copy(orientation);
                var position = _this.transform.val["position"];
                _this.gameSystem.spawnBullet(new Util_5.Vector(position.x, position.y), new Util_5.Vector(0, 0), orientation, new Util_5.Vector(5, 5));
            };
            this.id = "AI";
            this.gameSystem = Globals_7.systems.getSystem("Game");
            this.physicsSystem = Globals_7.systems.getSystem("Physics");
            this.cooldown = 0;
            this.lastOrientation = new Util_5.Vector(1, 0);
        }
        return PlayerAI;
    }());
    exports.PlayerAI = PlayerAI;
});
define("Component/PlayerInput", ["require", "exports", "Globals"], function (require, exports, Globals_8) {
    "use strict";
    var PlayerInput = (function () {
        function PlayerInput() {
            var _this = this;
            this.update = function (attribute) {
                _this.physics = attribute["Physics"];
                _this.transform = attribute["Transform"];
            };
            this.left = function () {
                _this.physics.val["force"].x = -_this.physics.val["power"];
                if (_this.physics.val["velocity"].x > 0)
                    _this.physics.val["velocity"].x = 0;
            };
            this.up = function () {
                _this.physics.val["force"].y = -_this.physics.val["power"];
                if (_this.physics.val["velocity"].y > 0)
                    _this.physics.val["velocity"].y = 0;
            };
            this.down = function () {
                _this.physics.val["force"].y = _this.physics.val["power"];
                if (_this.physics.val["velocity"].y < 0)
                    _this.physics.val["velocity"].y = 0;
            };
            this.right = function () {
                _this.physics.val["force"].x = _this.physics.val["power"];
                if (_this.physics.val["velocity"].x < 0)
                    _this.physics.val["velocity"].x = 0;
            };
            this.id = "Input";
            this.inputSystem = Globals_8.systems.getSystem("Input");
            this.gameSystem = Globals_8.systems.getSystem("Game");
            this.inputSystem.addKeycodeCallback(65, this.left);
            this.inputSystem.addKeycodeCallback(87, this.up);
            this.inputSystem.addKeycodeCallback(83, this.down);
            this.inputSystem.addKeycodeCallback(68, this.right);
            this.inputSystem.addKeycodeCallback(89, this.gameSystem.upgradeCooldown);
            this.inputSystem.addKeycodeCallback(85, this.gameSystem.upgradePower);
            this.inputSystem.addKeycodeCallback(73, this.gameSystem.upgradeSpawnRate);
            this.inputSystem.addKeycodeCallback(79, this.gameSystem.upgradeSpawnAmount);
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
define("Entity/Entity", ["require", "exports", "Globals"], function (require, exports, Globals_9) {
    "use strict";
    var Entity = (function () {
        function Entity(components, attributes) {
            var _this = this;
            this.init = function (index) {
                _this.attribute["Game"].val["index"] = index;
            };
            this.update = function () {
                if (!_this.attribute["Game"].val["active"]) {
                    _this.finit();
                    return;
                }
                for (var key in _this.component) {
                    //if (key !== "Physics")
                    _this.component[key].update(_this.attribute);
                }
            };
            this.finit = function () {
                Globals_9.entities.removeEntity(_this.attribute["Game"].val["index"]);
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
        Entity.prototype.hasComponent = function (name) {
            return this.component.hasOwnProperty(name);
        };
        Entity.prototype.hasAttribute = function (name) {
            return this.attribute.hasOwnProperty(name);
        };
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
            this.getEntitiesWithComponent = function (componentId) {
                var entityList = [];
                for (var key in _this.entity) {
                    if (_this.entity[key].component.hasOwnProperty(componentId))
                        entityList.push(_this.entity[key]);
                }
                return entityList;
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
define("Context/SystemContext", ["require", "exports", "System/package"], function (require, exports, package_5) {
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
                    if (_this.system[key].state === package_5.SystemState.None)
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
define("Globals", ["require", "exports", "Context/package"], function (require, exports, package_6) {
    "use strict";
    var WIDTH = 1024;
    exports.WIDTH = WIDTH;
    var HEIGHT = 1024;
    exports.HEIGHT = HEIGHT;
    var systems = new package_6.SystemContext();
    exports.systems = systems;
    var entities = new package_6.EntityContext();
    exports.entities = entities;
});
define("main", ["require", "exports", "Globals", "System/package"], function (require, exports, Globals_10, package_7) {
    "use strict";
    function gameLoop() {
        requestAnimationFrame(gameLoop);
        Globals_10.systems.updateSystems();
        Globals_10.entities.updateEntities();
    } //
    function main() {
        Globals_10.systems.addSystem(new package_7.PhysicsSystem());
        Globals_10.systems.addSystem(new package_7.InputSystem());
        Globals_10.systems.addSystem(new package_7.GameSystem());
        Globals_10.systems.addSystem(new package_7.GraphicsSystem());
        gameLoop();
    }
    main();
});
//# sourceMappingURL=main.js.map