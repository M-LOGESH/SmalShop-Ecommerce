import CategoryProducts from '../components/CategoryProducts';
import ImageCarousel from '../components/common/ImageCarousel';

const sampleImages = [
    'src/assets/img/carousel/car1.jpg',
    'src/assets/img/carousel/car2.jpg',
    'src/assets/img/carousel/car3.jpg',
    'src/assets/img/carousel/car4.jpg',
    'src/assets/img/carousel/car5.jpg',
    'src/assets/img/carousel/car6.jpg',
    'src/assets/img/carousel/car7.jpg',
];

const banner = 'src/assets/img/banner/banner2.jpg';
const banner1 = 'src/assets/img/banner/banner4.jpg';
const banner2 = 'src/assets/img/banner/banner1.jpg';

function Home() {
    return (
        <div className="min-h-screen mb-10">
            <ImageCarousel images={sampleImages} />

            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4 sm:py-6">
                <img src={banner} alt="Banner" className="rounded-lg" />
            </div>

            <CategoryProducts
                categoryName="Vegetables"
                title="Top pick for Vegetables"
                slug="vegetables"
            />
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
            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4">
                <img src={banner1} alt="Banner" className="rounded-lg" />
            </div>
            <CategoryProducts
                categoryName="Munchies"
                title="Top pick for Munchies"
                slug="munchies"
            />
            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4">
                <img src={banner2} alt="Banner" className="rounded-lg" />
            </div>
        </div>
    );
}

export default Home;
