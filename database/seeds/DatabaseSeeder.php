<?php

use Illuminate\Database\Seeder;
use App\Models;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        factory(Models\MstUser::class, 200)->create();
        factory(Models\MstCustomer::class, 20)->create();
        $this->call(ShopTableSeeder::class);
        // $this->call(ProductTableSeeder::class);
        factory(Models\MstProduct::class, 1000)->create();
    }
}
