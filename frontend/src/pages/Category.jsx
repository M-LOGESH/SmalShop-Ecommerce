import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
    {
        title: 'Biscuits, Drinks & Packaged Foods',
        items: [
            { name: 'Biscuits & Cookies', img: '/img/categories/biscuits.webp', slug: 'biscuits' },
            { name: 'Chips & Munchies', img: '/img/categories/munchies.webp', slug: 'munchies' },
            { name: 'Cold Drinks', img: '/img/categories/colddrinks.webp', slug: 'colddrinks' },
            { name: 'Chocolates', img: '/img/categories/chocolate.webp', slug: 'chocolates' },
        ],
    },
    {
        title: 'Fruits & Vegetables',
        items: [
            { name: 'Fresh Fruits', img: '/img/categories/fruits.webp', slug: 'fruits' },
            { name: 'Basic Vegetables', img: '/img/categories/vegetables.webp', slug: 'vegetables' },
        ],
    },
    {
        title: 'Home Essentials',
        items: [
            { name: 'Detergents & Cleaners', img: '/img/categories/detergent.webp', slug: 'detergents' },
            { name: 'Dishwash', img: '/img/categories/dishwash.webp', slug: 'dishwash' },
            { name: 'Fresheners & Repellents', img: '/img/categories/repellant.webp', slug: 'repellents' },
            { name: 'Pooja Needs', img: '/img/categories/poojaitems.webp', slug: 'poojaitems' },
        ],
    },
];

function Category() {
    const navigate = useNavigate();

    return (
        <div className="mx-auto min-h-screen max-w-6xl px-6 py-6 sm:px-10">
            {categories.map((category, idx) => (
                <div key={idx} className="mb-10">
                    <h2 className="mb-4 text-lg font-bold">{category.title}</h2>

                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-6 md:grid-cols-6 lg:grid-cols-8">
                        {category.items.map((item, i) => (
                            <div
                                key={i}
                                className="flex cursor-pointer flex-col items-center text-center"
                                onClick={() => navigate(`/category/${item.slug}`)}
                            >
                                <div className="flex h-18 w-18 items-center justify-center rounded-xl bg-slate-200 p-1 shadow-md transition hover:shadow-lg sm:h-24 sm:w-24">
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="mt-2 text-sm">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Category;
