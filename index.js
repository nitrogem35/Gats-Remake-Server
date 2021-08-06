/*
HTML/CSS/JS Client
https://replit.com/@Gats-Remake/Gats-Remake-Client                  Client

Node.js Server Info API
https://replit.com/@Gats-Remake/Gats-Remake-API#index.js             API

Node.js WebSocket gameserver
https://replit.com/@Gats-Remake/Gats-Remake-Server                 Server

Project URL
https://gats-remake-client.gats-remake.repl.co                   Project URL
*/

//Node.js gameserver by nitrogem35
//Please don't change any of the code below unless you know what you're doing.
const WebSocket = require('ws');
const axios = require('axios');
const serverData = [];
const servers = [];
const versionNumber = '1.0.0'
const postPath = 'serverData'

//scores will be loaded from the api in the future
var highscores = [
    {
        "username": "",
        "score": 0,
        "class_code":0,
        "is_member":1
    },
    {
        "username": "",
        "score": 0,
        "class_code":0,
        "is_member":1
    },
    {
        "username": "",
        "score": 0,
        "class_code":0,
        "is_member":1
    },
    {
        "username": "",
        "score": 0,
        "class_code":0,
        "is_member":1
    },
    {
        "username": "",
        "score": 0,
        "class_code":0,
        "is_member":1
    }
]
var names = [
    "Armadillo", "Crocodile", "Monkey", "Gazelle", 
    "Zebra", "Lion", "Tiger", "Shark", "Rat", "Wolf",
    "Fox", "Fish", "Walrus", "Wombat", "Bear", "Snake", 
    "Cow", "Whale", "Snail", "Moose", "Mongoose", "Spider", 
    "Civet", "Lobster", "Cat", "Dog", "Gorilla", "Squid", 
    "Giraffe", "Crab", "Dingo", "Bison", "Llama", "Raccoon", 
    "Ant", "Buffalo", "Porcupine", "Lizard", "Iguana", "Elephant", 
    "Horse", "Lemur", "Weasel", "Emu", "Vulture", "Sloth", 
    "Koala", "Baboon", "Wolverine", "Stork", "Frog", "Heron", 
    "Pig", "Kangaroo", "Coyote", "Gecko", "Scorpion", "Otter", 
    "Jackal", "Chicken", "Beaver", "Fly", "Skunk", "Rabbit", 
    "Beetle", "Platypus", "Goanna", "Squirrel", "Panther", 
    "Penguin", "Bee", "Bat", "Rhino", "Pelican", "Octopus", 
    "Sheep", "Seal", "Eagle", "Goat", "Reindeer", "Deer"
]

var obstacleData = require('./obstacles.json')

var port = 8000;
function createServer(type, region, city, capacity, population) {
    servers.push(new WebSocket.Server({port: port}));
    serverData.push({
        url: `Gats-Remake-Server.gats-remake.repl.co`,
        type: `${type}`,
        region: `${region}`,
        city: `${city}`,
        capacity: `${capacity}`,
        population: `${population}`
    });
    port++;
};
function b(data) {
    var msgAsBuffer = new ArrayBuffer(data.length);
    var uint8Array = new Uint8Array(msgAsBuffer);
    for (var l = 0; l < data.length; l++) {
        uint8Array[l] = data.charCodeAt(l);
    };
    return new Uint8Array(uint8Array);
};
//createServer('DOM', 'North America', 'Forth Worth', '144', 0);
createServer('FFA', 'Unknown (hosting via replit)', 'N/A', '120', 0);

//-----------------------------------------------------------
for(i in servers) {
    servers[i].obstacles = obstacleData
    //gamemode specific stuff will be added here later on
}
//-----------------------------------------------------------
var $1ArmorWeight = 6
var $2ArmorWeight = 9
var $3ArmorWeight = 12
var pistolWeight = 6.6
var smgWeight = 8.7
var shotgunWeight = 11
var assaultWeight = 13.5
var sniperWeight = 12.5
var lmgWeight = 15
for(i in servers) {
    servers[i].players = [];
    servers[i].mapSize = 2000;
    servers[i].population = 0
    servers[i].names = names
    servers[i].on('connection', player => {
        servers[i].players.push(player);
        servers[i].population = servers[i].players.length;
        serverData[i].population = servers[i].players.length;
        player.id = servers[i].players.indexOf(player);
        player.lastPing = Date.now();
        player.send(b('+'));
        player.send(b(`gameType,${serverData[i].type}`));
        player.send(b(`highScores,${JSON.stringify(highscores)}`));
        player.send(b(`version,${versionNumber}`))
        player.on('message', message => {
            if(message == '.') {
                player.lastPing = Date.now();
                setTimeout(function() {player.send(b('.'))}, 50);
            }
            else {
                message = new TextDecoder().decode(message);
                if(message.startsWith("s")) {
                    if(!player.spawned && !player.spawning) {
                        player.spawning = true
                        player.gun = message.split(",")[1];
                        if(isNaN(player.gun)) player.gun = 0;
                        var armor = message.split(",")[2];
                        if(isNaN(armor)) player.armor = 0;
                        player.color = parseInt(message.split(",")[3]);
                        player.angle = 0;
                        player.accelX = 0;
                        player.accelY = 0;
                        player.radius = 200;
                        player.hp = 100;
                        player.maxHp = 100;
                        // pe3ak changed this also, gonna keep your code commented out
                        
                        /* nitrogem 35
                        there's a reason i did it like this - users should log 
                        in if they want a custom username, so that we can track stats
                        */
                        // oh, didn't know that, thanks
                        var name = "Guest " + servers[i].names[Math.floor(Math.random()*servers[i].names.length)];
                        servers[i].names.splice(names.indexOf(name));
                        player.name = name;
                        player.score = 0;
                        player.kills = 0;
                        player.vip = 0;
                        player.isleader = false;
                        player.dashing = false;
                        player.chatboxOpen = false;
                        player.invincible = '1'
                        player.viewX = 1350;
                        player.viewY = 950;
                        player.left = false;
                        player.right = false;
                        player.up = false;
                        player.down = false;
                        player.shooting = false;
                        player.reloading = false;
                        player.beingHit = false;
                        player.level = 0;
                        player.levelPacket = {
                            'data': 'p,0|', 
                            'shouldSend': false
                        };
                        player.chatMessage = '';
                        player.lastPacket = '';
                        player.playersInView = [];
                        player.blocksInView = [];
                        player.weight = 0;
                        player.gunWeight = 0;
                        player.armorWeight = 0;
                        if(serverData[i].type == "FFA") player.teamID = 0;
                        if(armor == 0) player.armor = 0, player.maxArmor = 0;
                        if(armor == 1) player.armor = 30, player.maxArmor = 30, player.weight += $1ArmorWeight, player.armorWeight = $1ArmorWeight;
                        if(armor == 2) player.armor = 60, player.maxArmor = 60, player.weight += $2ArmorWeight, player.armorWeight = $2ArmorWeight;
                        if(armor == 3) player.armor = 90, player.maxArmor = 90, player.weight += $3ArmorWeight, player.armorWeight = $3ArmorWeight;
                        if(player.gun == 0) player.ammo = 16, player.maxAmmo = 16, player.weight += pistolWeight, player.gunWeight = pistolWeight;
                        if(player.gun == 1) player.ammo = 32, player.maxAmmo = 32, player.weight += smgWeight, player.gunWeight = smgWeight;
                        if(player.gun == 2) player.ammo = 5, player.maxAmmo = 5, player.weight += shotgunWeight, player.gunWeight = shotgunWeight;
                        if(player.gun == 3) player.ammo = 30, player.maxAmmo = 30, player.weight += assaultWeight, player.gunWeight = assaultWeight;
                        if(player.gun == 4) player.ammo = 6, player.maxAmmo = 6, player.weight += sniperWeight, player.gunWeight = sniperWeight;
                        if(player.gun == 5) player.ammo = 100, player.maxAmmo = 100, player.weight += lmgWeight, player.gunWeight = lmgWeight;
                        player.maxSpeed = 100 - (player.weight*2)
                        player.x = Math.floor((Math.random()-0.5)*servers[i].mapSize*5) + 35000;
                        player.y = Math.floor((Math.random()-0.5)*servers[i].mapSize*5) + 35000;
                        player.extData = `,${player.ammo},${c(player.shooting)},${c(player.reloading)},${player.hp},${c2(player.beingHit)},${player.armor},${player.radius},,${player.maxAmmo},${player.invincible},${c(player.dashing)},${c(player.chatboxOpen)},${c(player.isleader)},${player.color},${player.chatMessage}`
                        player.upgradeData = `,`
                        player.spawnPacket = `a,${player.id},${player.gun},${player.color},${player.x},${player.y},${player.radius},${player.angle},${player.armor},${player.ammo},${player.maxAmmo},${player.maxArmor},${player.hp},${player.viewX},${player.viewY},${player.maxHp},${servers[i].mapSize*10},${servers[i].mapSize*10},${player.name},${player.invincible},${player.isleader},${player.vip},${player.teamID},|`;

                    };
                };
                if(message.startsWith("m")) {
                    player.angle = parseInt(message.split(",")[3]) + 5;
                };
                if(message.startsWith("f")) {
                    player.left = false;
                    player.right = false;
                    player.up = false;
                    player.down = false;
                    player.shooting = false;
                };
                if(message.startsWith("k")) {
                    var inputType = parseInt(message.split(",")[1])
                    var pressed = parseInt(message.split(",")[2])
                    pressed && player.invincible ? player.invincible = 0 : null
                    if(inputType == 0) {
                        pressed ? player.left = true : player.left = false
                    }
                    if(inputType == 1) {
                        pressed ? player.right = true : player.right = false
                    }
                    if(inputType == 2) {
                        pressed ? player.up = true : player.up = false 
                    }
                    if(inputType == 3) {
                        pressed ? player.down = true : player.down = false
                    }
                    if(inputType == 6) {
                        pressed ? player.shooting = true : player.shooting = false
                    }
                    if(inputType == 7) {
                        pressed ? player.chatboxOpen = true : player.chatboxOpen = false
                    }
                }
                if(message.startsWith("c")) {
                    var msg = message.split(",")[1]
                    msg = msg.slice(0, -1); 
                    player.chatMessage = msg
                }
            };
        });
        setInterval(function() {
            if(Date.now() - player.lastPing > 5000) {
                player.close();
            };
        }, 100);
    });

    var ticks = 0
    // var test3 = Date.now()
    setInterval(function() {
        //--------update fog--------------------
        if(servers[i].players.length > 4 && !servers[i].expanding && !servers[i].shrinking) {
            var sz = Math.sqrt(servers[i].players.length)*1000;
            if(sz >= 2000) size = 2000
            if(sz >= 3000) size = 3000
            if(sz >= 4000) size = 4000
            if(sz >= 5000) size = 5000
            if(sz >= 6000) size = 6000
            if(sz >= 7000) size = 7000
            if(size > servers[i].mapSize) {
                servers[i].expanding = true;
                var expand = setInterval(() => {
                    if(!servers[i].sizeUpdated) {
                        if(servers[i].mapSize < size) {
                            servers[i].mapSize++;
                            servers[i].sizeUpdated = true
                            setTimeout(function() {servers[i].sizeUpdated = false}, 16)
                        }  else {
                            servers[i].expanding = false;
                            clearInterval(expand);
                        };
                    }
                }, 33);
            }
            else if(size < servers[i].mapSize) {
                servers[i].shrinking = true;
                var shrink = setInterval(() => {
                    if(!servers[i].sizeUpdated) {
                        if(servers[i].mapSize > size) {
                            servers[i].mapSize--;
                            servers[i].sizeUpdated = true
                            setTimeout(function() {servers[i].sizeUpdated = false}, 16)
                        } else {
                            servers[i].expanding = false;
                            clearInterval(shrink);
                        };
                    }
                }, 33);
            };
        };
        //--------update leaderboard------------
        var leaderboardArray = [];
        for(x in servers[i].players) {
            var player = servers[i].players[x]
            if((player.x < 36000 && player.x > 34000) && (player.y < 36000 && player.y > 34000) && ticks % 20 == 0 && servers[i].type == 'FFA') {
                player.score += 15
            }
            if(player.score > 100) player.level = 1
            if(player.score > 300) player.level = 2
            if(player.score > 600) player.level = 3
            if(player.score > 0) {
                leaderboardArray.push({
                    username: player.name,
                    score: player.score,
                    kills: player.kills,
                    teamID: player.teamID,
                    vip: player.vip
                })
            }
        };
        leaderboardArray.sort((a, b) => (a.score < b.score) ? 1 : -1)
        servers[i].leaderboardData = ''
        for(x in leaderboardArray) {
            if(x < 10 && leaderboardArray[x].score > 0) servers[i].leaderboardData += `,${leaderboardArray[x].username}.${leaderboardArray[x].vip}.${leaderboardArray[x].score}.${leaderboardArray[x].kills}.${leaderboardArray[x].teamID}`
            else break
        }
        //-------update player extData & more------
        for(x in servers[i].players) {
            var player = servers[i].players[x]
            var test =  `,${player.ammo},${c(player.shooting)},${c(player.reloading)},${player.hp},${c2(player.beingHit)},${player.armor},${player.radius},,${player.maxAmmo},${player.invincible},${c(player.dashing)},${c(player.chatboxOpen)},${c(player.isleader)},${player.color},${player.chatMessage}`
            if(player.lastPacket != test) {
                player.extData =  `,${player.ammo},${c(player.shooting)},${c(player.reloading)},${player.hp},${c2(player.beingHit)},${player.armor},${player.radius},,${player.maxAmmo},${player.invincible},${c(player.dashing)},${c(player.chatboxOpen)},${c(player.isleader)},${player.color},${player.chatMessage}`
                player.lastPacket = player.extData
            }
            else {
                player.extData = ''
            }
            if(player.spawned) {
                if(player.levelPacket.data.split(",")[1].replace("|","") != player.level) {
                    player.levelPacket = {
                        'data': `p,${player.level}|`,
                        'shouldSend': true
                    } 
                }
                else player.levelPacket.shouldSend = false
            }
            if(player.chatMessage) player.chatMessage = ''
        }
        //-------push update----------------------
        for(x in servers[i].players) {
            var player = servers[i].players[x]
            if(player.spawned || player.spawning) {

                player.x += player.accelX
                player.y += player.accelY

                if((player.left || player.right) && (player.up || player.down)) {
                    var speed = 100
                    speed -= player.gunWeight * 3.2
                    speed -= player.armorWeight * 2.2
                    player.maxSpeed = speed
                }
                else {
                    player.maxSpeed = 100 - (player.weight * 2)
                }
                if(player.left || player.right) {
                    if(player.left) player.accelX -= Math.ceil((player.maxSpeed + player.accelX)/7)
                    if(player.right) player.accelX += Math.ceil((player.maxSpeed - player.accelX)/7)
                }
                else if(player.accelX != 0) {
                    //player.accelY -= Math.floor((player.accelY-5)/10)
                    if(player.accelX < 0) {
                        if(player.accelX < -5) player.accelX -= Math.round((player.accelX)/10)
                        else if(player.accelX != 0) player.accelX += 1
                    }
                    if(player.accelX > 0) {
                        if(player.accelX > 5) player.accelX -= Math.round((player.accelX)/10)
                        else if(player.accelX != 0) player.accelX -= 1
                    }
                }
                if(player.up || player.down) {
                    if(player.up) player.accelY -= Math.ceil((player.maxSpeed + player.accelY)/7)
                    if(player.down) player.accelY += Math.ceil((player.maxSpeed - player.accelY)/7)
                }
                else if(player.accelY != 0) {
                    //player.accelY -= Math.floor((player.accelY-5)/10)
                    if(player.accelY < 0) {
                        if(player.accelY < -5) player.accelY -= Math.round((player.accelY)/10)
                        else if(player.accelY != 0) player.accelY += 1
                    }
                    if(player.accelY > 0) {
                        if(player.accelY > 5) player.accelY -= Math.round((player.accelY)/10)
                        else if(player.accelY != 0) player.accelY -= 1
                    }
                }

                var playerData = `b,${player.id},${player.x},${player.y},${player.accelX},${player.accelY},${player.angle},|`
                var extPlayerData = `c,${player.id}${player.extData}|`

                var upgradeData = 'f'
                if(trim(player.upgradeData, ',')) upgradeData += player.upgradeData
                upgradeData += '|'

                var upgradePacket = ''
                if(player.levelPacket.shouldSend) upgradePacket = player.levelPacket.data

                var otherPlayersData = ''
                var exitPacket = ''
                for(y in servers[i].players) {
                    var player2 = servers[i].players[y]
                    if(player2.id != player.id) { 
                        var distanceX = Math.abs(player2.x - player.x)
                        var distanceY = Math.abs(player2.y - player.y)
                        var isInView = Boolean(Math.abs(distanceX) < player.viewX*5.5 && Math.abs(distanceY) < player.viewY*5.5)
                        if(isInView && player.playersInView.includes(player2.id) && !player2.dispose) {
                            otherPlayersData += `b,${player2.id},${player2.x},${player2.y},${player2.accelX},${player2.accelY},${player2.angle}|`
                            otherPlayersData += `c,${player2.id}${player2.extData}|`
                        }
                        else if(isInView && !player2.dispose) {
                            player.playersInView.push(player2.id)
                            otherPlayersData += `d,${player2.id},${player2.gun},${player2.color},${player2.x},${player2.y},${player2.radius},${player2.angle},${player2.armor},${player2.hp},${player2.maxAmmo},${player2.name},,${player2.invincible},${player2.isleader},${player2.vip},${player2.teamID},${player2.chatboxOpen}|`
                            otherPlayersData += `c,${player2.id}${player2.lastPacket}|`
                        }
                        else {
                            if(player.playersInView.includes(player2.id)) {
                                exitPacket += `e,${player2.id}|`
                                player.playersInView.splice(player.playersInView.indexOf(player2.id), 1)
                            }  
                        }
                    }
                }
                
                var blocks = servers[i].obstacles
                var blockData = ''
                for(y in blocks) {
                    var block = blocks[y]
                    var distanceX = Math.abs(block.x*10 - player.x)
                    var distanceY = Math.abs(block.y*10 - player.y)
                    var isInView = Boolean(Math.abs(distanceX) < player.viewX*5.5 && Math.abs(distanceY) < player.viewY*5.5)
                    if(isInView && !player.blocksInView.includes(block.id)) {
                        player.blocksInView.push(block.id)
                        blockData += `j,${block.id},`
                        if(block.type == "crate") blockData += `${1},`
                        if(block.type == "longCrate") blockData += `${2},`
                        if(block.type == "userCrate") blockData += `${3},`
                        blockData += `${block.x*10},${block.y*10},${block.angle}|`
                    }
                    else if(!isInView && player.blocksInView.includes(block.id)) {
                        player.blocksInView.splice(player.blocksInView.indexOf(block.id), 1)
                        blockData += `l,${block.id}|`
                    }
                    collisionCheck(block, player)
                }
                
                var fog = ''
                if(servers[i].expanding || servers[i].shrinking) {
                    fog = `sz,${servers[i].mapSize}|`
                }
                
                var serverPopulation = `v,${servers[i].population}`
                if(servers[i].leaderboardData) serverPopulation += servers[i].leaderboardData
                serverPopulation += '|'

                var data = playerData + extPlayerData + upgradeData + upgradePacket + otherPlayersData + blockData + fog + exitPacket + serverPopulation
                if(player.spawning) {
                    data += player.spawnPacket
                    player.spawnPacket = undefined
                    player.spawned = true
                    player.spawning = false
                }
                if(player.spawned) {
                    player.send(b(data))
                }
                //console.log(servers[i].players.length)
                // test3 = Date.now()-test3
                // console.log(test3)
                // test3 = Date.now()
            }
        }
        for(x in servers[i].players) {
            var player = servers[i].players[x]
            if(player.dispose == true) {
                servers[i].names.push(player.name)
                servers[i].players.splice(x, 1)
                servers[i].population = servers[i].players.length
                serverData[i].population = servers[i].players.length
            }
        }
        ticks++
    }, 39)

    setInterval(function() {
        for(x in servers[i].players) {
            if(servers[i].players[x].readyState == 3) {
                servers[i].players[x].dispose = true
            }
        }
    }, 100)
};
//var isSquare = (n) => n === 0 ? true : n > 0 && Math.sqrt(n) % 1 === 0;
function c(data) {
    let d = data
    d ? d = '1' : d = '0'
    return d
}
function c2(data) {
    let d = data
    d ? d = '1' : d = ''
    return d
}
function trim(str, ch) {
    var start = 0, 
        end = str.length;
    while(start < end && str[start] === ch)
        ++start;
    while(end > start && str[end - 1] === ch)
        --end;
    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
};
function collisionCheck(block, player){
    blx = block.x*10
    bly = block.y*10
    plx = player.x + player.accelX
    ply = player.y + player.accelY
    disX = plx - blx
    disY = ply - bly
    if(block.type == 'crate') {
        if(collisionCheck2(player, block, 1010, 1010)) {
           collisionCheck3(disX, disY, player)
        }
        else if(Math.abs(disX) < 660 && Math.abs(disY) < 660) {
            collisionCheck3(disX, disY, player)
        }
    }
    else if(block.type == 'longCrate') {
        var angle = block.angle/90
        if(angle == '1') {
            if(collisionCheck2(player, block, 1010, 505)) {
                collisionCheck3(disX, disY, player)
            }
            else if(Math.abs(disX) < 640 && Math.abs(disY) < 450) {
                collisionCheck3(disX, disY, player)
            }
        }
        else {
            if(collisionCheck2(player, block, 505, 1010)) {
                collisionCheck3(disX, disY, player)
            }
            else if(Math.abs(disX) < 450 && Math.abs(disY) < 640) {
                collisionCheck3(disX, disY, player)
            }
        }
    }
}
function collisionCheck2(circ, rect, width, height) {
    var distance = {}
    distance.x = Math.abs((circ.x + circ.accelX) - rect.x*10);
    distance.y = Math.abs((circ.y + circ.accelY) - rect.y*10);
    if (distance.x > (width/2 + circ.radius)) { return false; }
    if (distance.y > (height/2 + circ.radius)) { return false; }
    //if (distance.x <= (width/2)) { return true; } 
    //if (distance.y <= (height/2)) { return true; }
    cDist_sq = (distance.x - width/2)^2 + (distance.y - height/2)^2;
  
    return (cDist_sq <= (circ.r^2));
}
function collisionCheck3(disX, disY, player) {
    if(disX >= 0 && disY <= 0) {
        if(Math.abs(disX) - Math.abs(disY) > 0) { 
            player.accelX = 10 
        } else {
            player.accelY = -10
        }
    }
    else if(disX <= 0 && disY >= 0) {
        if(Math.abs(disX) - Math.abs(disY) > 0) {
            player.accelX = -10
        } else {
            player.accelY = 10
        }
    }
    else if(disX <= 0 && disY <= 0) {
        if(Math.abs(disX) - Math.abs(disY) > 0) {
            player.accelX = -10
        } else {
            player.accelY = -10
        }
    }
    else if(disX >= 0 && disY >= 0) {
        if(Math.abs(disX) - Math.abs(disY) > 0) { 
            player.accelX = 10
        } else {
            player.accelY = 10
        }
    }
}
//-----------------------------------------------------------
setInterval(() => {
  axios.post(
    `https://Gats-Remake-API.gats-remake.repl.co/${postPath}`, 
    serverData
  )
  .then(res => {
    
  })
  .catch(error => {
    console.log(`There was an error sending an update to the API` );
  })
}, 2000)