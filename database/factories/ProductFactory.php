<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models;
use Faker\Generator as Faker;

$factory->define(Models\MstProduct::class, function (Faker $faker) {
    return [
        'product_id' => $faker->bothify('?#########'),
        'product_name' => $faker->word,
        'product_price' => rand(100000,999999),
        'is_sales' => rand(0,1),
        'description' => $faker->sentence
    ];
});
