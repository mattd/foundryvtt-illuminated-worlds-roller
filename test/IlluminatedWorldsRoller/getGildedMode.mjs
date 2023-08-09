import test from 'ava';

import {
    IlluminatedWorldsRoller
} from "../../module/scripts/illuminated-worlds-roller.mjs";

const illuminatedWorldsRoller = new IlluminatedWorldsRoller();

test("returns the expected mode when rolled with standard dice", t => {
    const gildedMode = illuminatedWorldsRoller.getGildedMode(2, 2);
    t.is(gildedMode, "with-standard-dice");
});

test("returns the expected mode when rolled with no standard dice", t => {
    const gildedMode = illuminatedWorldsRoller.getGildedMode(0, 2);
    t.is(gildedMode, "without-standard-dice");
});

test("returns the expected mode when rolled with no gilded dice", t => {
    const gildedMode = illuminatedWorldsRoller.getGildedMode(3, 0);
    t.is(gildedMode, "none");
});
