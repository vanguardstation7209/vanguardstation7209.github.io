//-------------------------
// Defining Variables
//-------------------------

var costMultiplier = 1.15;

// Variables for Typewriter Function
var typewriter = {
    i: 0,
    speed: 75,
}

// Strings to be fed into typewriter
var txt = {
    one: "Specified distance reached.",
    two: "Restoring Station AI to full functionality.",
    three: "WARNING: LOW POWER",
    four: "Emergency power generation online.",
    five: "Sufficient power stored.",
    six: "Unfold solar panel?",
    seven: "Solar panel unfolded.",
    eight: "Automatic power generation online.",
    panelBuy: "Solar panel unfolded.",
    panelUpgrade1: "Solar panels aligned for maximum efficiency.",
    miningDroneBuy: "Mining drone activated and deployed.",
    foundryActive: "The foundry is online and ready for operation.",
    welcome: "Welcome back.",
    panelBuyDesc: "Unfold a solar panel to increase the rate of light absorption. Cost: ",
}

// How much do I have of a resource?

var inv = {
    power: 0,
    ice: 0,
    rock: 0,
    iron: 0,
    copper: 0,
    silicon: 0,
}

// What is the maximum quantity of a resource?

var invMax = {
    power: 50,
    ice: 50,
    rock: 100,
    iron: 0,
    copper: 0,
    silicon: 0,
}

// What is the storage increase?

var invStore = {
    power: 50,
    ice: 0,
    rock: 0,
    metal: 0,
    copper: 0,
    silicon: 0,
}

// How many times have I upgraded a generator?

var upgrade = {
    panel: 0,
    miningDrone: 0,
}

// How much does the upgrade change the amount generated?

var upgradeChange = {
    panel: [0.5, 1],
}

// How much does the generator cost?
var cost = {
    panel: 10,
    panelUpgrade: [100, 500, 5000],
    miningDrone: 250,
}

// How many generators do I have?
var gen = {
    panel: 0,
    miningDrone: 0,
}

// How many active do I have?
var active = {
    miningDrone: 0,
}
// What is the maximum quantity of the generator?
var genMax = {
    panel: 10,
    miningDrone: 5,
}

// How much of a resource do generators produce?
var prod = {
    panel: 0.5,
    miningDroneIce: 0.2,
    miningDroneRock: 0.5,
}

// How much of a resource is being used?
var usage = {
    power: 0,
    ice: 0,
    rock: 0,
    iron: 0,
    copper: 0,
    silicon: 0,
}

// What is the overall change for the resource?
var change = {
    power: 0,
    ice: 0,
    rock: 0,
    iron: 0,
    copper: 0,
    silicon: 0,
}
// Check whether intro can be skipped
var storyPosition = 0;

//-------------------------
// Purchase Generators
//-------------------------

function panelBuy() {
    switch (gen.panel) {
        case 4:
            gen.panel += 1;
            invMax.power = gen.panel * invStore.power;
            storyPosition += 1;
            inv.power -= cost.panel;
            cost.panel = Math.round((cost.panel*1e12*costMultiplier)/1e12);
            document.getElementById("panelBuyDesc").innerHTML = txt.panelBuyDesc + cost.panel + " <img src='images/powerIcon.png'>";
            document.getElementById("panelUpgrade").classList.remove("hidden");
            feedtext(txt.panelBuy);
            break;
        default:
            gen.panel += 1;
            invMax.power += invStore.power;
            inv.power -= cost.panel;
            cost.panel = Math.round((cost.panel*1e12*costMultiplier)/1e12);
            document.getElementById("panelBuyDesc").innerHTML = txt.panelBuyDesc + cost.panel + " <img src='images/powerIcon.png'>";
            feedtext(txt.panelBuy);
            break;
    }
}

function miningDroneBuy() {
    switch (gen.miningDrone) {
        case 0:
            gen.miningDrone += 1;
            active.miningDrone += 1;
            inv.power -= cost.miningDrone;
            document.getElementById("miningDroneActive").innerHTML = active.miningDrone;
            feedtext(txt.miningDroneBuy);
            const collectionIce = document.getElementsByClassName("ice");
            for (let i=0; i < collectionIce.length; i++) {
                collectionIce[i].classList.remove("hidden");
            }
            const collectionRock = document.getElementsByClassName("rock");
            for (let i=0; i < collectionRock.length; i++) {
                collectionRock[i].classList.remove("hidden");
            }
            document.getElementById("trayCentreLeftTop").classList.remove("hidden");
            feedtext(txt.foundryActive);
            break;
        default:
            gen.miningDrone += 1;
            active.miningDrone += 1;
            inv.power -= cost.miningDrone;
            document.getElementById("miningDroneActive").innerHTML = active.miningDrone;
            feedtext(txt.miningDroneBuy);
            break;
    }
}

//-------------------------
// Purchase Upgrades
//-------------------------

function panelUpgrade() {
    switch (upgrade.panel) {
        case 0:
            prod.panel = Math.round(prod.panel*1e12 + upgradeChange.panel[upgrade.panel]*1e12)/1e12;
            inv.power -= cost.panelUpgrade[upgrade.panel];
            upgrade.panel += 1;
            document.getElementById("trayLeftBottom").classList.remove("hidden");
            feedtext(txt.panelUpgrade1);
            break;
        default:
            prod.panel = Math.round(prod.panel*1e12 + upgradeChange.panel[upgrade.panel]*1e12)/1e12;
            inv.power -= cost.panelUpgrade[upgrade.panel];
            upgrade.panel += 1;
            document.getElementById("trayLeftBottom").classList.remove("hidden");
            feedtext(txt.panelUpgrade1);
    }
}
//-------------------------
// Functions to Calculate Resource Changes
//-------------------------

function powerAuto() {
    usage.power = Math.round(active.miningDrone*1e12*2.5)/1e12;
    change.power = Math.round(gen.panel*1e12*prod.panel - usage.power*1e12)/1e12;
    if (change.power >= 0) {
        document.getElementById("powerChange").innerHTML = "+" + change.power;
    } else {
        document.getElementById("powerChange").innerHTML = change.power;
    }
    if (inv.power + change.power > invMax.power) {
        inv.power = invMax.power;
        document.getElementById("powerInv").innerHTML = inv.power  + "/" + invMax.power + "  <img src='images/powerIcon.png'>";
    } else if (inv.power + change.power <= 0) {
        inv.power = 0;
        document.getElementById("powerInv").innerHTML = inv.power  + "/" + invMax.power + "  <img src='images/powerIcon.png'>";
    } else {
        inv.power = Math.round(inv.power*1e12 + change.power*1e12)/1e12;
        document.getElementById("powerInv").innerHTML = inv.power  + "/" + invMax.power + "  <img src='images/powerIcon.png'>";
    }
}

function iceAuto() {
    change.ice = Math.round(active.miningDrone*prod.miningDroneIce*1e12-usage.ice*1e12)/1e12;
    if (change.ice >= 0) {
        document.getElementById("iceChange").innerHTML = "+" + change.ice;
    } else {
        document.getElementById("iceChange").innerHTML = change.ice;
    }
    if (inv.ice + change.ice > invMax.ice) {
        inv.ice = invMax.ice;
        document.getElementById("iceInv").innerHTML = inv.ice  + "/" + invMax.ice + "  <img src='images/iceIcon.png'>";
    } else if (inv.ice + change.ice <= 0) {
        inv.ice = 0;
        document.getElementById("iceInv").innerHTML = inv.ice  + "/" + invMax.ice + "  <img src='images/iceIcon.png'>";
    } else {
        inv.ice = Math.round(inv.ice*1e12 + change.ice*1e12)/1e12;
        document.getElementById("iceInv").innerHTML = inv.ice  + "/" + invMax.ice + "  <img src='images/iceIcon.png'>";
    }
}

function rockAuto() {
    change.rock = Math.round(active.miningDrone*prod.miningDroneRock*1e12-usage.rock*1e12)/1e12;
    if (change.rock >= 0) {
        document.getElementById("rockChange").innerHTML = "+" + change.rock;
    } else {
        document.getElementById("rockChange").innerHTML = change.rock;
    }
    if (inv.rock + change.rock > invMax.rock) {
        inv.rock = invMax.rock;
        document.getElementById("rockInv").innerHTML = inv.rock  + "/" + invMax.rock + "  <img src='images/rockIcon.png'>";
    } else if (inv.rock + change.rock <= 0) {
        inv.rock = 0;
        document.getElementById("rockInv").innerHTML = inv.rock  + "/" + invMax.rock + "  <img src='images/rockIcon.png'>";
    } else {
        inv.rock = Math.round(inv.rock*1e12 + change.rock*1e12)/1e12;
        document.getElementById("rockInv").innerHTML = inv.rock  + "/" + invMax.rock + "  <img src='images/rockIcon.png'>";
    }
}

//-------------------------
// Functions to enable/disable buttons
//-------------------------

function buttonEnableDisable() {
    // Unfold Panels
    if (inv.power >= cost.panel && gen.panel < genMax.panel) {
        document.getElementById("panelBuy").classList.remove("disabled");
        document.getElementById("panelBuy").disabled = false;
    } else {
        document.getElementById("panelBuy").classList.add("disabled");
        document.getElementById("panelBuy").disabled = true;
    }
    // Upgrade Panels
    if (inv.power < cost.panelUpgrade[upgrade.panel]) {
        document.getElementById("panelUpgradeButton").classList.add("disabled");
        document.getElementById("panelUpgradeButton").disabled = true;
    } else {
        document.getElementById("panelUpgradeButton").classList.remove("disabled");
        document.getElementById("panelUpgradeButton").disabled = false;
    }
    // Buy Mining Drones
    if (inv.power >= cost.miningDrone && gen.miningDrone < genMax.miningDrone){
        document.getElementById("miningDroneBuy").classList.remove("disabled");
        document.getElementById("miningDroneBuy").disabled = false;
    } else {
        document.getElementById("miningDroneBuy").classList.add("disabled");
        document.getElementById("miningDroneBuy").disabled = true;
    }
    // Mining Drone Plus
    if (active.miningDrone < gen.miningDrone) {
        document.getElementById("miningDronePlus").classList.remove("disabled");
        document.getElementById("miningDronePlus").disabled = false;
    } else {
        document.getElementById("miningDronePlus").classList.add("disabled");
        document.getElementById("miningDronePlus").disabled = true;
    }
    // Mining Drone Minus
    if (active.miningDrone > 0) {
        document.getElementById("miningDroneMinus").classList.remove("disabled");
        document.getElementById("miningDroneMinus").disabled = false;
    } else {
        document.getElementById("miningDroneMinus").classList.add("disabled");
        document.getElementById("miningDroneMinus").disabled = true;
    }    
}

//-------------------------
// Functions for +/- Buttons
//-------------------------

function miningDronePlus() {
    active.miningDrone += 1;
    document.getElementById("miningDroneActive").innerHTML = active.miningDrone;
}

function miningDroneMinus() {
    active.miningDrone -= 1;
    document.getElementById("miningDroneActive").innerHTML = active.miningDrone;
}

//-------------------------
// Functions for the introduction
//-------------------------

function introOne() {
    typeWriter(txt.one, "story");
    setTimeout(introTwo, 3000);
    inv.power = 0;
}

function introTwo() {
    typewriter.i = 0;
    document.getElementById("story").innerHTML = "";
    typeWriter(txt.two, "story");
    setTimeout(introThree, 5000);
}

function introThree() {
    typewriter.i = 0;
    document.getElementById("story").innerHTML = "";
    typeWriter(txt.three, "story");
    setTimeout(introFour, 3000);
}

function introFour() {
    typewriter.i = 0;
    document.getElementById("story").innerHTML = "";
    typeWriter(txt.four, "story");
    setTimeout(function(){document.getElementById("introButton").classList.remove("hidden"); document.getElementById("storyPower").classList.remove("hidden");
        document.getElementById("storyPower").innerHTML = inv.power + "  <img src='images/powerIcon.png'>"; document.getElementById("introButton").disabled=false}, 4000);
}

function introButtonOne() {
    if (inv.power == 9) {
        inv.power += 1;
        typewriter.i = 0;
        document.getElementById("introButton").classList.add("hidden");
        document.getElementById("introButton").disabled = true;
        document.getElementById("storyPower").innerHTML = inv.power + "  <img src='images/powerIcon.png'>";
        document.getElementById("story").innerHTML = "";
        typeWriter(txt.five, "story");
        setTimeout(function(){document.getElementById("story").innerHTML = ""; typewriter.i = 0; typeWriter(txt.six, "story"); 
            document.getElementById("introButton").onclick = introButtonTwo;},3500);
        setTimeout(function(){document.getElementById("introButton").innerHTML = "Unfold Panel"; document.getElementById("introButton").classList.remove("hidden");
            document.getElementById("introButton").disabled = false},5000);
    } else {
        inv.power += 1;
        document.getElementById("storyPower").innerHTML = inv.power + "  <img src='images/powerIcon.png'>";
    }    
}

function introButtonTwo() {
    gen.panel += 1;
    inv.power -= cost.panel;
    typewriter.i = 0;
    storyPosition = 1;
    document.getElementById("introButton").classList.add("hidden");
    document.getElementById("storyPower").classList.add("hidden");
    document.getElementById("storyPower").innerHTML = inv.power + "  <img src='images/powerIcon.png'  height='15' width='15'>";
    document.getElementById("introButton").disabled = true;
    document.getElementById("story").innerHTML = "";
    cost.panel = Math.round((cost.panel*1e12*costMultiplier)/1e12);
    document.getElementById("panelBuyDesc").innerHTML = txt.panelBuyDesc + cost.panel + " <img src='images/powerIcon.png'>";
    typeWriter(txt.seven, "story");
    setTimeout(function(){document.getElementById("story").innerHTML = ""; typewriter.i = 0; typeWriter(txt.eight, "story")},3500);
    setTimeout(function(){document.getElementById("story").innerHTML = ""; typewriter.i = 0; typeWriter(txt.two, "story")}, 7500);
    setTimeout(function(){document.getElementById("storyIntro").classList.add("hidden"); document.getElementById("title").classList.remove("hidden");
        document.getElementById("inv").classList.remove("hidden"); document.getElementById("feed").classList.remove("hidden");
        document.getElementById("tray").classList.remove("hidden"); document.getElementById("powerClick").disabled = false}, 11500);
}

//-------------------------
// Time Loops
//-------------------------

// Functions to run every half-second
var SecondLoop = window.setInterval(function() {
    powerAuto();
    iceAuto();
    rockAuto();
}, 1000)

// Functions to run every tenth of a second
var tenthSecondLoop = window.setInterval(function() {
    buttonEnableDisable();
}, 100)

// Every 15 seconds, make an autosave
var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("storyPosition", JSON.stringify(storyPosition));
    localStorage.setItem("invSave", JSON.stringify(inv));
    localStorage.setItem("genSave", JSON.stringify(gen));
    localStorage.setItem("invMaxSave", JSON.stringify(invMax));
    localStorage.setItem("upgrade", JSON.stringify(upgrade));
    localStorage.setItem("active", JSON.stringify(active));
}, 15000)
//-------------------------
// Misc Functions
//-------------------------

// Text Feed
function feedtext(text) {
    for (let i = 7; i > 1; i--) {
        document.getElementById("feed" + i).innerHTML = document.getElementById("feed" + (i-1)).innerHTML;
    }
    document.getElementById("feed1").innerHTML = text;
}

// Provides typewriter effect with string as parameter one, and target id as parameter two
function typeWriter(text, target) {
    if (typewriter.i < text.length) {
        document.getElementById(target).innerHTML += text.charAt(typewriter.i);
        typewriter.i++;
        setTimeout(function(){typeWriter(text, target)}, typewriter.speed);
    }
}

// Resets local data - turn into new game button at some point?
function reset() {
    storyPosition = 0;
    localStorage.clear();
    location.reload();
}

// Function that runs upon load
function load() {
    document.getElementById("feed1").innerHTML = txt.welcome;

    // Check local storage for story position
    var storyTemp = JSON.parse(localStorage.getItem("storyPosition"));
    if (storyTemp !== null) {
        storyPosition = storyTemp;
    }
    // Assign temporary variables from save data
    var invTemp = JSON.parse(localStorage.getItem("invSave"));
    if (invTemp !== null) {
        inv = invTemp;
    }

    var genTemp = JSON.parse(localStorage.getItem("genSave"));
    if (genTemp !== null) {
        gen = genTemp;
    }

    var invMaxTemp = JSON.parse(localStorage.getItem("invMaxSave"));
    if (invMaxTemp !== null) {
        invMax = invMaxTemp;
    }

    var upgradeTemp = JSON.parse(localStorage.getItem("upgrade"));
    if (upgradeTemp !== null) {
        upgrade = upgradeTemp;
    }

    var activeTemp = JSON.parse(localStorage.getItem("active"));
    if (activeTemp !== null) {
        active = activeTemp;
    }

    // Determine whether panels and buttons are visible
    if (gen.panel >= 5) {
        document.getElementById("panelUpgrade").classList.remove("hidden");
    }
    if (upgrade.panel >> 0) {
        document.getElementById("trayLeftBottom").classList.remove("hidden");
    }
    if (gen.miningDrone >> 0) {
        document.getElementById("trayCentreLeftTop").classList.remove("hidden");
        const collectionIce = document.getElementsByClassName("ice");
        for (let i=0; i < collectionIce.length; i++) {
            collectionIce[i].classList.remove("hidden");
        }
        const collectionRock = document.getElementsByClassName("rock");
        for (let i=0; i < collectionRock.length; i++) {
            collectionRock[i].classList.remove("hidden");
        }
    }


    // Run intro if needed
    switch (storyPosition) {
        case 0:
            introOne();
            break;
        default:
            document.getElementById("title").classList.remove("hidden");
            document.getElementById("inv").classList.remove("hidden");
            document.getElementById("feed").classList.remove("hidden");
            document.getElementById("tray").classList.remove("hidden");
            document.getElementById("powerClick").disabled = false;
            break;
    }
}