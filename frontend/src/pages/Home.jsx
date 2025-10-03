import CategoryProducts from "../components/CategoryProducts";

function Home() {
    return (
        <div className="min-h-screen">
            {/* Show only specific categories */}
            <CategoryProducts categoryName="Vegetables" title="Top pick for Vegetables" slug="vegetables"/>
            <CategoryProducts categoryName="ColdDrinks" title="Top pick for Cold Drinks" slug="colddrinks"/>
            <CategoryProducts categoryName="Biscuits" title="Top pick for Biscuits" slug="biscuits"/>
            <CategoryProducts categoryName="Munchies" title="Top pick for Munchies" slug="munchies"/>
        </div>
    );
}

export default Home;
