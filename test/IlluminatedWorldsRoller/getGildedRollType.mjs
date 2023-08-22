import test from 'ava';

import {
    IlluminatedWorldsRoller
} from "../../module/scripts/illuminated-worlds-roller.mjs";

const illuminatedWorldsRoller = new IlluminatedWorldsRoller();

test("returns the expected type when rolled with standard dice", t => {
    const gildedRollType = illuminatedWorldsRoller.getGildedRollType(2, 2);
    t.is(gildedRollType, "with-standard-dice");
});

test("returns the expected type when rolled with no standard dice", t => {
    const gildedRollType = illuminatedWorldsRoller.getGildedRollType(0, 2);
    t.is(gildedRollType, "without-standard-dice");
});

test("returns the expected type when rolled with no gilded dice", t => {
    const gildedRollType = illuminatedWorldsRoller.getGildedRollType(3, 0);
    t.is(gildedRollType, "none");
});
