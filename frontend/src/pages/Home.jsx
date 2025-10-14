import CategoryProducts from '../components/CategoryProducts';
import ImageCarousel from '../components/common/ImageCarousel';
import WelcomeMessage from '../components/WelcomeMessage';
import { useAuth } from '../context/AuthContext';

const sampleImages = [
    '/img/carousel/car1.webp',
    '/img/carousel/car2.webp',
    '/img/carousel/car3.webp',
    '/img/carousel/car4.webp',
    '/img/carousel/car5.webp',
    '/img/carousel/car6.webp',
    '/img/carousel/car7.webp',
];

const banner = '/img/banner/banner2.webp';
const banner1 = '/img/banner/banner4.webp';
const banner2 = '/img/banner/banner1.webp';

function Home() {
    const { user } = useAuth();

    return (
        <div className="mb-10 min-h-screen">
            <ImageCarousel images={sampleImages} />

            {!user && <WelcomeMessage />}

            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4 sm:py-6">
                <img src={banner} alt="Banner" className="rounded-lg" />
            </div>

            <CategoryProducts
                categoryName="Vegetables"
                title="Top pick for Vegetables"
                slug="vegetables"
            />

            <CategoryProducts categoryName="Fruits" title="Top pick for Fruits" slug="fruits" />

            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4">
                <img src={banner1} alt="Banner" className="rounded-lg" />
            </div>

            <CategoryProducts
                categoryName="ColdDrinks"
                title="Top pick for Cold Drinks"
                slug="colddrinks"
            />
            <CategoryProducts
                categoryName="Biscuits"
                title="Top pick for Biscuits"
                slug="biscuits"
            />

            <CategoryProducts
                categoryName="Munchies"
                title="Top pick for Munchies"
                slug="munchies"
            />

            <CategoryProducts
                categoryName="Chocolates"
                title="Top pick for Chocolates"
                slug="chocolates"
            />
            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4">
                <img src={banner2} alt="Banner" className="rounded-lg" />
            </div>
        </div>
    );
}

export default Home;
