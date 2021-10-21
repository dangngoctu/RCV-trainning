<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models;

class ProductTableSeeder extends Seeder
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
				'product_name' => 'Sản phẩm A',
				'product_price' => 1000,
				'is_sales' => rand(0,1),
				'description' => 'Sản phẩm A'
			],
			[
				'product_name' => 'Sản phẩm B',
				'product_price' => 1001,
				'is_sales' => rand(0,1),
				'description' => 'Sản phẩm B'
			],
			[
				'product_name' => 'Sản phẩm C',
				'product_price' => 1002,
				'is_sales' => rand(0,1),
				'description' => 'Sản phẩm C'
			],
			[
				'product_name' => 'Sản phẩm D',
				'product_price' => 1003,
				'is_sales' => rand(0,1),
				'description' => 'Sản phẩm D'
			],
			[
				'product_name' => 'Sản phẩm E',
				'product_price' => 1004,
				'is_sales' => rand(0,1),
				'description' => 'Sản phẩm E'
			],
			[
				'product_name' => 'Sản phẩm F',
				'product_price' => 1005,
				'is_sales' => rand(0,1),
				'description' => 'Sản phẩm F'
			]
		];

		Models\MstProduct::insert($data);
    }
}
