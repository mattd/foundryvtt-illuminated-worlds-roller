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

    html.children().first().append(control);
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

    game.settings.register(
        "illuminated-worlds-roller", "backgroundColor",
        {
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
        }
    );

    game.settings.register(
        "illuminated-worlds-roller", "maxStandardDiceCount",
        {
            "name": game.i18n.localize(
                "IlluminatedWorldsRoller.MaxStandardDiceCountName"
            ),
            "hint": game.i18n.localize(
                "IlluminatedWorldsRoller.MaxStandardDiceCountHint"
            ),
            "scope": "world",
            "config": true,
            "default": 10,
            "type": Number
        }
    );

    game.settings.register(
        "illuminated-worlds-roller", "defaultStandardDiceCount",
        {
            "name": game.i18n.localize(
                "IlluminatedWorldsRoller.DefaultStandardDiceCountName"
            ),
            "hint": game.i18n.localize(
                "IlluminatedWorldsRoller.DefaultStandardDiceCountHint"
            ),
            "scope": "world",
            "config": true,
            "default": 2,
            "type": Number
        }
    );

    game.settings.register(
        "illuminated-worlds-roller", "actions",
        {
            "name": game.i18n.localize("IlluminatedWorldsRoller.ActionsName"),
            "hint": game.i18n.localize("IlluminatedWorldsRoller.ActionsHint"),
            "scope": "world",
            "config": true,
            "type": String,
            "default": defaultActions.map(item => {
                return game.i18n.localize(
                    `IlluminatedWorldsRoller.DefaultAction${item}`
                )
            }).join(',')
        }
    );

    game.settings.register(
        "illuminated-worlds-roller", "defaultStakes",
        {
            "name": game.i18n.localize(
                "IlluminatedWorldsRoller.DefaultStakesName"
            ),
            "hint": game.i18n.localize(
                "IlluminatedWorldsRoller.DefaultStakesHint"
            ),
            "scope": "world",
            "config": true,
            "type": String,
            "choices": {
                "high": game.i18n.localize(
                    "IlluminatedWorldsRoller.StakesHigh"
                ),
                "normal": game.i18n.localize(
                    "IlluminatedWorldsRoller.StakesNormal"
                ),
                "low": game.i18n.localize(
                    "IlluminatedWorldsRoller.StakesLow"
                )
            },
            "default": "normal"
        }
    );

    game.settings.register(
        "illuminated-worlds-roller", "gildedAppearance",
        {
            "name": game.i18n.localize(
                "IlluminatedWorldsRoller.GildedAppearanceName"
            ),
            "hint": game.i18n.localize(
                "IlluminatedWorldsRoller.GildedAppearanceHint"
            ),
            "scope": "world",
            "config": true,
            "type": String,
            "default": "radiant"
        }
    );
});

console.log("IlluminatedWorldsRoller | Illuminated Worlds Roller loaded");
