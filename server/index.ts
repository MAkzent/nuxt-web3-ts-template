const ethers = require('ethers')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }


  setupKittyAPI()

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

function setupKittyAPI() {
  const ATTACK_CAP = 128;
  const SPEED_CAP = 64;
  const CRIT_CAP = 16;
  const CRIT_MULTIPLIER = 3;
  const TANK_CRIT_WEAKNESS = 2;

  const ELEMENT_TYPES = {
      Earth: 0,
      Water: 1,
      Fire: 2,
      Wind: 3,
      Void: 4
  }

  const BOSS_TYPES = {
    Normal: 0,
    Tank: 1,
    Flying: 2
  }

  function getKittyStats(kittyGene)
  {

    return (
      {
        attack: Number(kittyGene) % ATTACK_CAP,
        speed: Number(kittyGene) % SPEED_CAP,
        crit: Number(kittyGene) % CRIT_CAP,
        element: Number(kittyGene) % Object.keys(ELEMENT_TYPES).length
      }
    )
  }

  function getKittiesKilled(bossId)
  {
    return [20, 30, 5, 60, 80];
  }

  function getBossStats(bossId)
  {
    var bossStats =
    {
      bossId: Number(bossId),
      element: ELEMENT_TYPES.Water,
      type: BOSS_TYPES.Tank
    };

    return bossStats;
  }

  function computeDamage(kitty, bossStats)
  {

    // get primitives
    var bossElement = bossStats.element;
    var bossType = bossStats.type;

    var kittyElement = kitty.element;
    var kittyBaseDamage = kitty.attack;
    var kittySpeed = kitty.speed;
    var kittyCritChance = kitty.crit;

    // get element damage mulitplier
    var elementMultiplier = computeElementMultiplier(bossElement, kittyElement);

    // roll for crit: random int from 0 to CRIT_CAP. if < kittyCrit, hasCrit = true
    var hasCrit = Math.floor(Math.random() * Math.floor(CRIT_CAP)) < kittyCritChance;

    // get total attack damage depending on boss type
    var totalAttackDamage = kittyBaseDamage;

    // if crit, deal more damage
    if (hasCrit)
      totalAttackDamage *= CRIT_MULTIPLIER;

    switch (bossType)
    {
      case BOSS_TYPES.Normal:
        totalAttackDamage *= elementMultiplier;
      break;
      case BOSS_TYPES.Tank:
        // if tank and has crit, deal more damage
        totalAttackDamage *= elementMultiplier;
        if (hasCrit)
          totalAttackDamage *= TANK_CRIT_WEAKNESS;
      break;
      case BOSS_TYPES.Flying:
        // if type is flying, a low speed decreases the damage
        totalAttackDamage *= elementMultiplier;
        totalAttackDamage *=  (kittySpeed / SPEED_CAP);
      break;
    }

    return totalAttackDamage;
  }

  function computeElementMultiplier(bossElement, kittyElement)
  {
    const elementTable =
    [
      [1,   2,    1,    1,  0.5], // 0 - kitty
      [0.5, 1,    2,    1,    1],
      [3,   0.5,  1,    2,    1],
      [1,   1,    0.5,  1,    2],
      [2,   1,    1,    0.5,  1]
    ]

    return elementTable[kittyElement][bossElement];
  }

  function getBossInfo(bossId)
  {
    // get boss stats
    var bossStats = getBossStats(bossId);

    // get tokenIds of all kitties killed by boss
    var killList = getKittiesKilled(bossId);

    // get detailed data for each kitty
    var kittyInfo = killList.map(getKittyStats);

    // compute damage by each Kitty then add onto KittyInfo as ripKitties
    var ripKitties = kittyInfo.map(kitty =>
    {
      return {
        ...kitty,
        damage: computeDamage(kitty, bossStats)
      }
    })

    return (
      {
        ...bossStats,
        ripKitties: ripKitties
      }
    )

  }


  app.all('/api/kitty/:id', (req, res) => {
    const {id} = req.params;
    return res.status(200).send(getKittyStats(id));
  });

  app.all('/api/boss/:id', async (req, res) => {
    const {id} = req.params;
    return res.status(200).send(await getBossInfo2(id));
  });

  async function getBossInfo2(id)
  {
    let provider = ethers.getDefaultProvider('rinkeby');

    const contractAddress = '0xa4CEEB325423c662Cd41Ae653C00acD73E9b85Dc';
    const dragonKittyAbi = require('../src/assets/data/ethereum/DragonKittyABI.json')

    let contract = await new ethers.Contract(contractAddress, dragonKittyAbi, provider);

    var result;

    try {
      var history = await contract.history(Number(id))
      var bossId = parseInt(history.bossId);
      var startIndex = parseInt(history.startIndex);
      var recordLength = parseInt(history.recordLength);

      var resultArray  = new Array();
      for (var i = 0; i < recordLength; i++)
      {
        var kitty = await contract.records(startIndex + i);
        var kittyObject = {
          bossId: parseInt(kitty.bossId),
          kittyId: parseInt(kitty.kittyId),
          damage: kitty.damage,
          criticalHit: kitty.criticalHit,
          winner: kitty.winner
        }

        resultArray.push(kittyObject);
      }

      result = JSON.stringify(resultArray);

    } catch (e) {
      console.log(e);
      result = {
        error: "boss not found"
      }
    }

    return result;
  }

}


start()
