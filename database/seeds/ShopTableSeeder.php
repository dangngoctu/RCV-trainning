<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models;

class ShopTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		$data = [
			[
				'shop_name' => 'Amazon'
			],
			[
				'shop_name' => 'Yahoo'
			],
			[
				'shop_name' => 'Rakuten'
			]
		];

		Models\MstShop::create($data);
    }
}
