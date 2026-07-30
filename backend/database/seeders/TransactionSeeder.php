<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        // use firstOrCreate so re-running the seeder won't fail since it has predefined values
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'demo@claro.com'],
            [
                'name'     => 'Demo User',
                'password' => bcrypt('password123'),
            ]
        );


        $wallet = \App\Models\Wallet::firstOrCreate(
            ['user_id' => $user->id, 'wallet_key' => 'bdo'],
            [
                'name'    => 'BDO',
                'type'    => 'Bank',
                'balance' => 50000,
            ]
        );

        if ($user->transactions()->count() === 0) {
            Transaction::factory()->count(20)->income()->create([
                'user_id'   => $user->id,
                'wallet_id' => $wallet->id,
            ]);
            Transaction::factory()->count(40)->expense()->create([
                'user_id'   => $user->id,
                'wallet_id' => $wallet->id,
            ]);
        }
    }
}

// demo credentials: demo@claro.com / password123
// run: php artisan db:seed
