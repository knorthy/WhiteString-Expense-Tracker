<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    private const INCOME_CATEGORIES = [
        'Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other Income',
    ];

    private const EXPENSE_CATEGORIES = [
        'Food', 'Transport', 'Utilities', 'Rent', 'Entertainment',
        'Healthcare', 'Shopping', 'Education', 'Other Expense',
    ];

    public function definition(): array
    {
        $type = $this->faker->randomElement(['income', 'expense']);

        $categories = $type === 'income'
            ? self::INCOME_CATEGORIES
            : self::EXPENSE_CATEGORIES;

        return [
            'type'        => $type,
            'category'    => $this->faker->randomElement($categories),
            'amount'      => $this->faker->randomFloat(2, 10, 5000),
            'description' => $this->faker->optional(0.7)->sentence(),
            'date'        => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
        ];
    }

    public function income(): static
    {
        return $this->state(fn () => [
            'type'     => 'income',
            'category' => $this->faker->randomElement(self::INCOME_CATEGORIES),
            'amount'   => $this->faker->randomFloat(2, 500, 5000),
        ]);
    }

    public function expense(): static
    {
        return $this->state(fn () => [
            'type'     => 'expense',
            'category' => $this->faker->randomElement(self::EXPENSE_CATEGORIES),
            'amount'   => $this->faker->randomFloat(2, 10, 1500),
        ]);
    }
}
