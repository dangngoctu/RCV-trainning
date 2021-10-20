<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models;
use Faker\Generator as Faker;

$factory->define(Models\MstCustomer::class, function (Faker $faker) {
    return [
        'customer_name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'tel_num' => $faker->regexify('09[0-9]{9}'),
        'address' => $faker->streetAddress,
        'is_active' => 1,
        'is_active' => rand(0,1),
    ];
});
