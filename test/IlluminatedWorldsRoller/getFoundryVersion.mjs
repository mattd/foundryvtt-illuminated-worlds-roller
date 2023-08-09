import test from 'ava';

import {
    IlluminatedWorldsRoller
} from "../../module/scripts/illuminated-worlds-roller.mjs";

const illuminatedWorldsRoller = new IlluminatedWorldsRoller();

const currentGame = {
    version: "9.0"
};

const legacyGame = {
    data: {
        version: "0.7.1"
    }
};

test("returns the correct version for a current game", t => {
    const version = illuminatedWorldsRoller.getFoundryVersion(currentGame);
    t.deepEqual(version, { major: 9, minor: 0 });
});

test("returns the correct version for a legacy game", t => {
    const version = illuminatedWorldsRoller.getFoundryVersion(legacyGame);
    t.deepEqual(version, { major: 7, minor: 1 });
});
