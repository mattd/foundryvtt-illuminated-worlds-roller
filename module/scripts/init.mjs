import { IlluminatedWorldsRoller } from './illuminated-worlds-roller.mjs';

Hooks.once("ready", () => {
    game.illuminatedWorldsRoller = new IlluminatedWorldsRoller();
});

Hooks.on("renderSceneControls", (app, html) => {
    const control = $(`
        <li class="scene-control" title="Illuminated Worlds Roller">
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
        'Hunt',
        'Study',
        'Survey',
        'Tinker',
        'Finesse',
        'Prowl',
        'Skirmish',
        'Wreck',
        'Attune',
        'Command',
        'Consort',
        'Sway'
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

    game.settings.register("illuminated-worlds-roller", "defaultPosition", {
        "name": game.i18n.localize(
            "IlluminatedWorldsRoller.defaultPositionName"
        ),
        "hint": game.i18n.localize(
            "IlluminatedWorldsRoller.defaultPositionHint"
        ),
        "scope": "world",
        "config": true,
        "type": String,
        "choices": {
            "controlled": game.i18n.localize(
                "IlluminatedWorldsRoller.PositionControlled"
            ),
            "risky": game.i18n.localize(
                "IlluminatedWorldsRoller.PositionRisky"
            ),
            "desperate": game.i18n.localize(
                "IlluminatedWorldsRoller.PositionDesperate"
            )
        },
        "default": "risky"
    });

    game.settings.register("illuminated-worlds-roller", "defaultEffect", {
        "name": game.i18n.localize("IlluminatedWorldsRoller.defaultEffectName"),
        "hint": game.i18n.localize("IlluminatedWorldsRoller.defaultEffectHint"),
        "scope": "world",
        "config": true,
        "type": String,
        "choices": {
            "great": game.i18n.localize("IlluminatedWorldsRoller.EffectGreat"),
            "standard": game.i18n.localize(
                "IlluminatedWorldsRoller.EffectStandard"
            ),
            "limited": game.i18n.localize(
                "IlluminatedWorldsRoller.EffectLimited"
            )
        },
        "default": "standard"
    });
});

console.log("IlluminatedWorldsRoller | Illuminated Worlds Roller loaded");
