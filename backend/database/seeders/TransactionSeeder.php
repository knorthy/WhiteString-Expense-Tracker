<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        // 20 income entries + 40 expense entries for a realistic dashboard
        Transaction::factory()->count(20)->income()->create();
        Transaction::factory()->count(40)->expense()->create();
    }
}
