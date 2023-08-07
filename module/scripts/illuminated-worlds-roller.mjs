class IlluminatedWorldsRoller {
    /**
     * Gets Foundry major and minor versions.
     * @return {{major: number, minor: number}} version object
     */
    getFoundryVersion(game) {
        let versionParts;

        if (game.version) {
            versionParts = game.version.split('.');
            return {
                major: parseInt(versionParts[0]),
                minor: parseInt(versionParts[1])
            };
        }

        versionParts = game.data.version.split('.');
        return {
            major: parseInt(versionParts[1]),
            minor: parseInt(versionParts[2])
        };
    }

    /**
     * Creates and shows the roller popup.
     * @return none
     */
    async showRoller() {
        const maxDice = game.settings.get(
            "illuminated-worlds-roller", "maxDiceCount"
        );
        const defaultDiceCount = game.settings.get(
            "illuminated-worlds-roller", "defaultDiceCount"
        );
        const actions = game.settings.get(
            "illuminated-worlds-roller", "actions"
        );
        const defaultStakes = game.settings.get(
            "illuminated-worlds-roller", "defaultStakes"
        );

        new Dialog({
            title: `${game.i18n.localize('IlluminatedWorldsRoller.RollTitle')}`,
            content: `
                <h2>${game.i18n.localize('IlluminatedWorldsRoller.Roll')}</h2>
                <form>
                    <div class="form-group">
                        <label>
                            ${game.i18n.localize(
                                'IlluminatedWorldsRoller.RollNumberOfDice'
                            )}:
                        </label>
                        <select id="standard-dice" name="standard-dice">
                            ${
                                Array(maxDice + 1).fill().map((item, i) => {
                                    return `<option value="${i}">${i}d</option>`
                                }).join('')
                            }
                        </select>
                        <script>
                            $('#standard-dice').find(
                                'option[value="${defaultDiceCount}"]'
                            ).prop(
                                "selected", "selected"
                            );
                        </script>
                    </div>
                    <div class="form-group">
                        <label>
                            ${game.i18n.localize(
                                'IlluminatedWorldsRoller.Action'
                            )}:
                        </label>
                        <select id="action" name="action">
                            <option value=""></option>
                            ${
                                actions.split(',').map(item => {
                                    return `
                                        <option value="${item}">
                                            ${item}
                                        </option>
                                    `;
                                })
                            }
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            ${game.i18n.localize(
                                'IlluminatedWorldsRoller.Stakes'
                            )}:
                        </label>
                        <select id="stakes" name="stakes">
                            <option value="low">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.StakesLow'
                                )}
                            </option>
                            <option value="normal">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.StakesNormal'
                                )}
                            </option>
                            <option value="high">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.StakesHigh'
                                )}
                            </option>
                        </select>
                        <script>
                            $('#stakes').find(
                                'option[value="${defaultStakes}"]'
                            ).prop(
                                "selected", "selected"
                            );
                        </script>
                    </div>
                </form>
            `,
            buttons: {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: game.i18n.localize('IlluminatedWorldsRoller.Roll'),
                    callback: async (html) => {
                        const standardDice = parseInt(
                            html.find('[name="standard-dice"]')[0].value
                        );
                        const action = html.find('[name="action"]')[0].value;
                        const stakes = html.find('[name="stakes"]')[0].value;
                        await this.roll(action, standardDice, 0, stakes);
                    }
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: game.i18n.localize('IlluminatedWorldsRoller.Close'),
                },
            },
            default: "yes",
        }).render(true);
    }

    /**
     * Rolls the Dice.
     * @param {string} attribute arbitrary label for the roll
     * @param {int} diceAmount number of dice to roll
     * @param {string} stakes stakes
     */
    async roll(
        attribute = "",
        standardDice = 0,
        gildedDice = 0,
        stakes = "normal"
    ) {
        let zeroMode = false, gildedMode = false;

        if (standardDice < 0) { standardDice = 0; }
        if (gildedDice < 0) { gildedDice = 0; }
        if (standardDice === 0) { zeroMode = true; standardDice = 2; }
        if (gildedDice > 0) { isGilded = true; }

        let formula = `${standardDice}d6`;

        if (gildedMode) {
            formula += ` + ${gildedDice}d6[radiant]`
        }

        const r = new Roll(formula, {});

        if (this.getFoundryVersion(game).major > 7) {
            await r.evaluate({async: true});
        } else {
            r.roll();
        }
        return await this.showChatRollMessage(
            r, zeroMode, gildedMode, attribute, stakes
        );
    }

    /**
     * Shows Chat message for a roll.
     *
     * @param {Roll} r array of rolls
     * @param {Boolean} zeroMode whether to treat as if 0d
     * @param {Boolean} gildedMode whether to treat as a gilded roll
     * @param {string} attribute arbitrary label for the roll
     * @param {string} stakes stakes
     */
    async showChatRollMessage(
        r,
        zeroMode,
        gildedMode,
        attribute = "",
        stakes = ""
    ) {
        const speaker = ChatMessage.getSpeaker();
        const color = game.settings.get(
            "illuminated-worlds-roller", "backgroundColor"
        );

        let rolls = r.terms[0].results;

        if (gildedMode) {
            r.terms[2].results.forEach(result => {
                result.gilded = true;
                rolls.push(result);
            });
        }

        const rollOutcome = this.getRollOutcome(rolls, zeroMode);

        let stakesLocalize = "";
        switch (stakes) {
            case "low":
                stakesLocalize = (
                    "IlluminatedWorldsRoller.StakesLow"
                );
                break;
            case "high":
                stakesLocalize = (
                    "IlluminatedWorldsRoller.StakesHigh"
                );
                break;
            case "normal":
            default:
                stakesLocalize = (
                    "IlluminatedWorldsRoller.StakesNormal"
                );
        }

        const renderedTemplate = await renderTemplate(
            "modules/illuminated-worlds-roller/templates/roll-result.html",
            {
                rolls,
                rollOutcome,
                attribute,
                stakes,
                stakesLocalize,
                zeroMode,
                gildedMode,
                color
            }
        );

        const message = {
            speaker,
            content: renderedTemplate,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: r
        };

        if (this.getFoundryVersion(game).major > 7) {
            return CONFIG.ChatMessage.documentClass.create(message, {});
        } else {
            return CONFIG.ChatMessage.entityClass.create(message, {});
        }
    }

    /**
     *  Gets outcome of the Roll.
     *  - failure
     *  - mixed-success
     *  - success
     *  - critical-success
     * @param {Array} rolls results of dice rolls
     * @param {Boolean} zeroMode whether to treat as if 0d
     * @returns {string} success/failure outcome of roll
     */
    getRollOutcome(rolls, zeroMode = false) {
        // Sort roll values from lowest to highest.
        const sortedRolls = rolls.map(i => i.result).sort();

        let useDie, prevUseDie, rollOutcome = "failure";

        if (sortedRolls[0] === 6 && zeroMode) {
            rollOutcome = "success";
        } else {
            if (zeroMode) {
                useDie = sortedRolls[0];
            } else {
                useDie = sortedRolls[sortedRolls.length - 1];

                if (sortedRolls.length - 2 >= 0) {
                    prevUseDie = sortedRolls[sortedRolls.length - 2];
                }
            }

            if (useDie <= 3) {
                // 1,2,3 = failure
                rollOutcome = "failure";
            } else if (useDie === 6) {
                if (prevUseDie && prevUseDie === 6) {
                    // 6,6 = critical success
                    rollOutcome = "critical-success";
                } else {
                    // 6 = success
                    rollOutcome = "success";
                }
            } else {
                // 4,5 = mixed success
                rollOutcome = "mixed-success";
            }
        }
        return rollOutcome;
    }
}

export { IlluminatedWorldsRoller };
