import CategoryProducts from '../components/CategoryProducts';
import ImageCarousel from '../components/ImageCarousel';

const sampleImages = [
    'src/assets/img/carousel/car1.png',
    'src/assets/img/carousel/car2.png',
    'src/assets/img/carousel/car3.png',
    'src/assets/img/carousel/car4.png',
    'src/assets/img/carousel/car5.png',
];
const bannerImage = 'src/assets/img/banner/banner1.png';
const banner = 'src/assets/img/banner/banner2.png';

function Home() {
    return (
        <div className="min-h-screen">
            <ImageCarousel images={sampleImages} />

            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4 sm:py-6">
                <img src={banner} alt="Banner" className="rounded-lg" />
            </div>

            {/* Show only specific categories */}
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
            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4">
                <img src={bannerImage} alt="Banner" className="rounded-lg" />
            </div>
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
        </div>
    );
}

export default Home;
