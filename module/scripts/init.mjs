import { IlluminatedWorldsRoller } from './illuminated-worlds-roller.mjs';

Hooks.once("ready", () => {
    game.illuminatedWorldsRoller = new IlluminatedWorldsRoller();
});

Hooks.on("renderSceneControls", (app, html) => {
    const control = $(`
        <li class="scene-control" data-tooltip="Illuminated Worlds Roller">
            <i class="fas fa-dice"></i>
        </li>
    `);
    control.on("click", async function () {
        await game.illuminatedWorldsRoller.showRoller();
    });
    if (isNewerVersion(game.version, '9.220')) {
        html.children().first().append(control);
    } else {
        html.append(control);
    }
});

Hooks.once("setup", () => {
    const defaultActions = [
        'Move',
        'Strike',
        'Control',
        'Sway',
        'Read',
        'Hide',
        'Survey',
        'Focus',
        'Sense'
    ];

    game.settings.register("illuminated-worlds-roller", "backgroundColor", {
        "name": game.i18n.localize(
            "IlluminatedWorldsRoller.backgroundColorName"
        ),
        "hint": game.i18n.localize(
            "IlluminatedWorldsRoller.backgroundColorHint"
        ),
        "scope": "world",
        "config": true,
        "choices": {
            "gray": game.i18n.localize(
                "IlluminatedWorldsRoller.backgroundColorGray"
            ),
            "black": game.i18n.localize(
                "IlluminatedWorldsRoller.backgroundColorBlack"
            )
        },
        "default": "gray",
        "type": String
    });

    game.settings.register("illuminated-worlds-roller", "maxDiceCount", {
        "name": game.i18n.localize(
            "IlluminatedWorldsRoller.maxDiceCountName"
        ),
        "hint": game.i18n.localize(
            "IlluminatedWorldsRoller.maxDiceCountHint"
        ),
        "scope": "world",
        "config": true,
        "default": 10,
        "type": Number
    });

    game.settings.register("illuminated-worlds-roller", "defaultDiceCount", {
        "name": game.i18n.localize(
            "IlluminatedWorldsRoller.defaultDiceCountName"
        ),
        "hint": game.i18n.localize(
            "IlluminatedWorldsRoller.defaultDiceCountHint"
        ),
        "scope": "world",
        "config": true,
        "default": 2,
        "type": Number
    });

    game.settings.register("illuminated-worlds-roller", "actions", {
        "name": game.i18n.localize("IlluminatedWorldsRoller.actionsName"),
        "hint": game.i18n.localize("IlluminatedWorldsRoller.actionsHint"),
        "scope": "world",
        "config": true,
        "type": String,
        "default": defaultActions.map(item => {
            return game.i18n.localize(
                `IlluminatedWorldsRoller.DefaultAction${item}`
            )
        }).join(',')
    });

    game.settings.register("illuminated-worlds-roller", "defaultStakes", {
        "name": game.i18n.localize("IlluminatedWorldsRoller.defaultStakesName"),
        "hint": game.i18n.localize("IlluminatedWorldsRoller.defaultStakesHint"),
        "scope": "world",
        "config": true,
        "type": String,
        "choices": {
            "high": game.i18n.localize("IlluminatedWorldsRoller.StakesHigh"),
            "normal": game.i18n.localize(
                "IlluminatedWorldsRoller.StakesNormal"
            ),
            "low": game.i18n.localize(
                "IlluminatedWorldsRoller.StakesLow"
            )
        },
        "default": "normal"
    });

    game.settings.register("illuminated-worlds-roller", "gildedAppearance", {
        "name": game.i18n.localize(
            "IlluminatedWorldsRoller.gildedAppearanceName"
        ),
        "hint": game.i18n.localize(
            "IlluminatedWorldsRoller.gildedAppearanceHint"
        ),
        "scope": "world",
        "config": true,
        "type": String,
        "default": "radiant"
    });
});

console.log("IlluminatedWorldsRoller | Illuminated Worlds Roller loaded");
