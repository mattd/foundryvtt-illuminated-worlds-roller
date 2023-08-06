# Illuminated Worlds Roller for FoundryVTT

A generic dice roller for Illuminated Worlds games played on FoundryVTT. Based on code by Megastruktur.

## Installation
Install manually via the module's [manifest URL](https://raw.githubusercontent.com/mattd/foundryvtt-illuminated-worlds-roller/main/module/module.json):
```
https://raw.githubusercontent.com/mattd/foundryvtt-simple-fog/main/module/module.json
```

## Usage

This module adds a roll icon at the bottom of the taskbar. Set your dice pool, action, stakes - and roll!

There are module settings for controlling:

* the max number of dice
* the actions used in your system
* the default number of dice initially selected
* the default stakes initially selected

Alternatively, you can set up macros and skip the popup UI altogether.

`game.illuminatedWorldsRoller.roll("action", dice, isGilded, "stakes")`

* `action`: any string of your choosing (defaults to "")
* `dice`: total number of dice to roll (defaults to 0)
* `isGilded`: is this roll gilded? (defaults to false)
* `effect`: either low, normal, or high (defaults to normal if you enter anything else)

Based on concepts from Candela Obscura (found at http://www.darringtonpress.com/candela/), product of Darrington Press, LLC, designed and written by Spenser Starke and Rowan Hall.
