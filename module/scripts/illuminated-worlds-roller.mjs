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
        const defaultPosition = game.settings.get(
            "illuminated-worlds-roller", "defaultPosition"
        );
        const defaultEffect = game.settings.get(
            "illuminated-worlds-roller", "defaultEffect");

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
                        <select id="dice" name="dice">
                            ${
                                Array(maxDice + 1).fill().map((item, i) => {
                                    return `<option value="${i}">${i}d</option>`
                                }).join('')
                            }
                        </select>
                        <script>
                            $('#dice option[value="${defaultDiceCount}"]').prop(
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
                                'IlluminatedWorldsRoller.Position'
                            )}:
                        </label>
                        <select id="pos" name="pos">
                            <option value="controlled">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.PositionControlled'
                                )}
                            </option>
                            <option value="risky">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.PositionRisky'
                                )}
                            </option>
                            <option value="desperate">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.PositionDesperate'
                                )}
                            </option>
                        </select>
                        <script>
                            $('#pos option[value="${defaultPosition}"]').prop(
                                "selected", "selected"
                            );
                        </script>
                    </div>
                    <div class="form-group">
                        <label>
                            ${game.i18n.localize(
                                'IlluminatedWorldsRoller.Effect'
                            )}:
                        </label>
                        <select id="fx" name="fx">
                            <option value="limited">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.EffectLimited'
                                )}
                            </option>
                            <option value="standard">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.EffectStandard'
                                )}
                            </option>
                            <option value="great">
                                ${game.i18n.localize(
                                    'IlluminatedWorldsRoller.EffectGreat'
                                )}
                            </option>
                        </select>
                        <script>
                            $('#fx option[value="${defaultEffect}"]').prop(
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
                        const diceAmount = parseInt(
                            html.find('[name="dice"]')[0].value
                        );
                        const action = html.find('[name="action"]')[0].value;
                        const position = html.find('[name="pos"]')[0].value;
                        const effect = html.find('[name="fx"]')[0].value;
                        await this.roll(action, diceAmount, position, effect);
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
     * @param {string} position position
     * @param {string} effect effect
     */
    async roll(
        attribute = "",
        diceAmount = 0,
        position = "risky",
        effect = "standard"
    ) {
        let zeroMode = false;
        if (diceAmount < 0) { diceAmount = 0; }
        if (diceAmount === 0) { zeroMode = true; diceAmount = 2; }

        const r = new Roll(`${diceAmount}d6`, {});

        if (this.getFoundryVersion(game).major > 7) {
            await r.evaluate({async: true});
        } else {
            r.roll();
        }
        return await this.showChatRollMessage(
            r, zeroMode, attribute, position, effect
        );
    }

    /**
     * Shows Chat message for a roll.
     *
     * @param {Roll} r array of rolls
     * @param {Boolean} zeroMode whether to treat as if 0d
     * @param {string} attribute arbitrary label for the roll
     * @param {string} position position
     * @param {string} effect effect
     */
    async showChatRollMessage(
        r,
        zeroMode,
        attribute = "",
        position = "",
        effect = ""
    ) {
        const speaker = ChatMessage.getSpeaker();
        const rolls = r.terms[0].results;
        const rollOutcome = this.getRollOutcome(rolls, zeroMode);
        const color = game.settings.get(
            "illuminated-worlds-roller", "backgroundColor"
        );

        let positionLocalize = "";
        switch (position) {
            case "controlled":
                positionLocalize = (
                    "IlluminatedWorldsRoller.PositionControlled"
                );
                break;
            case "desperate":
                positionLocalize = (
                    "IlluminatedWorldsRoller.PositionDesperate"
                );
                break;
            case "risky":
            default:
                positionLocalize = (
                    "IlluminatedWorldsRoller.PositionRisky"
                );
        }

        let effectLocalize = "";
        switch (effect) {
            case "limited":
                effectLocalize = (
                    "IlluminatedWorldsRoller.EffectLimited"
                );
                break;
            case "great":
                effectLocalize = (
                    "IlluminatedWorldsRoller.EffectGreat"
                );
                break;
            case "standard":
            default:
                effectLocalize = (
                    "IlluminatedWorldsRoller.EffectStandard"
                );
        }

        const renderedTemplate = await renderTemplate(
            "modules/illuminated-worlds-roller/templates/roll-result.html",
            {
                rolls,
                rollOutcome,
                attribute,
                position,
                positionLocalize,
                effect,
                effectLocalize,
                zeroMode,
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
