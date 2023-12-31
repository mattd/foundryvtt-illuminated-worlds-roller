class IlluminatedWorldsRoller {
    /**
     * Creates and shows the roller popup.
     *
     * @returns none
     */
    async showRoller() {
        const maxStandardDice = game.settings.get(
            "illuminated-worlds-roller",
            "maxStandardDiceCount"
        );
        const defaultStandardDiceCount = game.settings.get(
            "illuminated-worlds-roller",
            "defaultStandardDiceCount"
        );
        const actions = game.settings.get(
            "illuminated-worlds-roller",
            "actions"
        );
        const defaultStakes = game.settings.get(
            "illuminated-worlds-roller",
            "defaultStakes"
        );

        new Dialog({
            title: game.i18n.localize("IlluminatedWorldsRoller.RollTitle"),
            content: `
                <h2>${game.i18n.localize("IlluminatedWorldsRoller.Roll")}</h2>
                <form>
                    <div class="form-group">
                        <label>
                            ${game.i18n.localize(
                                "IlluminatedWorldsRoller.StandardDice"
                            )}:
                        </label>
                        <select id="standard-dice" name="standard-dice">
                            ${Array(maxStandardDice + 1)
                                .fill()
                                .map((item, i) => {
                                    return `<option value="${i}">${i}d</option>`;
                                })
                                .join("")}
                        </select>
                        <script>
                            $('#standard-dice').find(
                                'option[value="${defaultStandardDiceCount}"]'
                            ).prop(
                                "selected", "selected"
                            );
                        </script>
                    </div>
                    <div class="form-group">
                        <label>
                            ${game.i18n.localize(
                                "IlluminatedWorldsRoller.GildedDice"
                            )}:
                        </label>
                        <select id="gilded-dice" name="gilded-dice">
                            <option value="0">0d</option>
                            <option value="1">1d</option>
                            <option value="2">2d</option>
                            <option value="3">3d</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            ${game.i18n.localize(
                                "IlluminatedWorldsRoller.Action"
                            )}:
                        </label>
                        <select id="action" name="action">
                            <option value=""></option>
                            ${actions.split(",").map(item => {
                                return `<option value="${item}">
                                    ${item}
                                </option>`;
                            })}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            ${game.i18n.localize(
                                "IlluminatedWorldsRoller.Stakes"
                            )}:
                        </label>
                        <select id="stakes" name="stakes">
                            <option value="low">
                                ${game.i18n.localize(
                                    "IlluminatedWorldsRoller.StakesLow"
                                )}
                            </option>
                            <option value="normal">
                                ${game.i18n.localize(
                                    "IlluminatedWorldsRoller.StakesNormal"
                                )}
                            </option>
                            <option value="high">
                                ${game.i18n.localize(
                                    "IlluminatedWorldsRoller.StakesHigh"
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
                    label: game.i18n.localize("IlluminatedWorldsRoller.Roll"),
                    callback: async html => {
                        const standardDice = parseInt(
                            html.find('[name="standard-dice"]')[0].value
                        );
                        const gildedDice = parseInt(
                            html.find('[name="gilded-dice"]')[0].value
                        );
                        const action = html.find('[name="action"]')[0].value;
                        const stakes = html.find('[name="stakes"]')[0].value;
                        await this.roll(
                            action,
                            standardDice,
                            gildedDice,
                            stakes
                        );
                    }
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: game.i18n.localize("IlluminatedWorldsRoller.Close")
                }
            },
            default: "yes"
        }).render(true);
    }

    /**
     * Get a string representing the gilded state given dice selected.
     *
     * @param {int} standardDice number of non-gilded dice to roll
     * @param {int} gildedDice number of gilded dice to roll
     * @returns {string} indicates the mix of dice to roll
     */
    getGildedRollType(standardDice, gildedDice) {
        if (gildedDice > 0) {
            if (standardDice) {
                return "with-standard-dice";
            } else {
                return "without-standard-dice";
            }
        }
        return "none";
    }

    /**
     * Get a roll formula given the dice state.
     *
     * @param {int} standardDice number of non-gilded dice to roll
     * @param {int} gildedDice number of gilded dice to roll
     * @param {string} gildedRollType indicates mix of standard and gilded dice
     * @returns {string} the roll formula for the given roll
     */
    getRollFormula(standardDice, gildedDice, gildedRollType) {
        const gildedAppearance = game.settings.get(
            "illuminated-worlds-roller",
            "gildedAppearance"
        );

        if (gildedRollType == "none") {
            return `${standardDice}d6`;
        } else if (gildedRollType == "with-standard-dice") {
            return `${standardDice}d6 + ${gildedDice}d6[${gildedAppearance}]`;
        } else if (gildedRollType == "without-standard-dice") {
            return `${gildedDice}d6[${gildedAppearance}]`;
        }
    }

    /**
     * Annotates roll results with gilded state.
     *
     * @param {Roll} r array of rolls
     * @param {string} gildedRollType whether to treat as a gilded roll
     * @returns {Array} rolls an annotated array of roll results
     */
    getAnnotatedRollResults(r, gildedRollType) {
        const rolls = [];

        if (
            gildedRollType == "none" ||
            gildedRollType == "with-standard-dice"
        ) {
            r.terms[0].results.forEach(result => {
                rolls.push(result);
            });
        }
        if (gildedRollType != "none") {
            const results =
                gildedRollType == "without-standard-dice"
                    ? r.terms[0].results
                    : r.terms[2].results;
            results.forEach(result => {
                result.gilded = true;
                rolls.push(result);
            });
        }

        return rolls;
    }

    /**
     * Get a string representing the interpreted state of gilded dice.
     *
     * @param {array} rolls an array of roll results
     * @param {string} rollOutcome a string describing the overall outcome
     * @param {string} gildedRollType a string desribing the mix of dice
     * @returns {string} a string representing the state of gilded results
     */
    getGildedResultType(rolls, rollOutcome, gildedRollType) {
        if (gildedRollType === "none") {
            return;
        }

        if (gildedRollType === "without-standard-dice") {
            return "gilded-is-only-result";
        }

        const gildedOutcome = this.getRollOutcome(
            rolls.filter(roll => roll.gilded)
        );

        const outcomeRanks = {
            "failure": 0,
            "mixed-success": 1,
            "success": 2,
            "critical-success": 3
        };

        if (
            rollOutcome == "critical-success" ||
            gildedOutcome == "success" ||
            outcomeRanks[gildedOutcome] > outcomeRanks[rollOutcome]
        ) {
            return "gilded-is-best-result";
        } else if (outcomeRanks[gildedOutcome] == outcomeRanks[rollOutcome]) {
            return "gilded-is-same-result";
        } else {
            if (gildedOutcome == "mixed-success") {
                return "gilded-mixed-is-worse-than-result";
            }
            return "gilded-failure-is-worse-than-result";
        }
    }

    /**
     * Rolls the Dice.
     *
     * @param {string} attribute arbitrary label for the roll
     * @param {int} diceAmount number of dice to roll
     * @param {string} stakes stakes
     * @returns none
     */
    async roll(
        attribute = "",
        standardDice = 0,
        gildedDice = 0,
        stakes = "normal"
    ) {
        let zeroMode = false;

        if (standardDice < 0) {
            standardDice = 0;
        }
        if (gildedDice < 0) {
            gildedDice = 0;
        }

        if (standardDice === 0 && gildedDice === 0) {
            zeroMode = true;
            standardDice = 2;
        }

        const gildedRollType = this.getGildedRollType(standardDice, gildedDice);

        const r = new Roll(
            this.getRollFormula(standardDice, gildedDice, gildedRollType),
            {}
        );

        await r.evaluate({ async: true });

        return await this.showChatRollMessage(
            r,
            zeroMode,
            gildedRollType,
            attribute,
            stakes
        );
    }

    /**
     * Shows Chat message for a roll.
     *
     * @param {Roll} r array of rolls
     * @param {Boolean} zeroMode whether to treat as if 0d
     * @param {string} gildedRollType a string describing the mix of dice
     * @param {string} attribute arbitrary label for the roll
     * @param {string} stakes stakes
     */
    async showChatRollMessage(
        r,
        zeroMode,
        gildedRollType,
        attribute = "",
        stakes = ""
    ) {
        const speaker = ChatMessage.getSpeaker();
        const color = game.settings.get(
            "illuminated-worlds-roller",
            "backgroundColor"
        );

        const rolls = this.getAnnotatedRollResults(r, gildedRollType);

        const rollOutcome = this.getRollOutcome(rolls, zeroMode);

        const gildedResultType = this.getGildedResultType(
            rolls,
            rollOutcome,
            gildedRollType
        );

        let stakesLocalize = "";
        switch (stakes) {
            case "low":
                stakesLocalize = "IlluminatedWorldsRoller.RollLowStakes";
                break;
            case "high":
                stakesLocalize = "IlluminatedWorldsRoller.RollHighStakes";
                break;
            case "normal":
            default:
                stakesLocalize = "IlluminatedWorldsRoller.RollNormalStakes";
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
                gildedRollType,
                gildedResultType,
                color
            }
        );

        const message = {
            speaker,
            content: renderedTemplate,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: r
        };

        return CONFIG.ChatMessage.documentClass.create(message, {});
    }

    /**
     *  Gets outcome of the Roll.
     *  - failure
     *  - mixed-success
     *  - success
     *  - critical-success
     *
     * @param {Array} rolls results of dice rolls
     * @param {Boolean} zeroMode whether to treat as if 0d
     * @returns {string} success/failure outcome of roll
     */
    getRollOutcome(rolls, zeroMode = false) {
        // Sort roll values from lowest to highest.
        const sortedRolls = rolls.map(i => i.result).sort();

        let useDie,
            prevUseDie,
            rollOutcome = "failure";

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
