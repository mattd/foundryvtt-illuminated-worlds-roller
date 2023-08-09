# Illuminated Worlds Roller for FoundryVTT

A generic dice roller for Illuminated Worlds games played on FoundryVTT. Based on code by Megastruktur.

## Installation
Install manually via the module's [manifest URL](https://raw.githubusercontent.com/mattd/foundryvtt-illuminated-worlds-roller/main/module/module.json):
```
https://raw.githubusercontent.com/mattd/foundryvtt-illuminated-worlds-roller/main/module/module.json
```

## Usage

This module adds a roll icon at the bottom of the taskbar. Set your dice pool, action, stakes - and roll!

There are module settings for controlling:

* color of dice icons in the chat message
* the max number of standard dice in a roll
* the actions used in your system
* the default number of standard dice initially selected
* the default stakes initially selected
* for users of Dice So Nice!, the default theme for gilded dice

Alternatively, you can set up macros and skip the popup UI altogether.

`game.illuminatedWorldsRoller.roll("action", standardDice, gildedDice, "stakes")`

* `action`: any string of your choosing (defaults to "")
* `standardDice`: total number of standard dice to roll (defaults to 0)
* `gildedDice`: total number of gilded dice to roll (defaults to 0)
* `effect`: either low, normal, or high (defaults to normal if you enter anything else)

Based on concepts from Candela Obscura (found at http://www.darringtonpress.com/candela/), product of Darrington Press, LLC, designed and written by Spenser Starke and Rowan Hall.
