import CategoryProducts from "../components/CategoryProducts";

function Home() {
    return (
        <div className="min-h-screen">
            {/* Show only specific categories */}
            <CategoryProducts categoryName="Vegetables" title="Top pick for Vegetables"/>
            <CategoryProducts categoryName="ColdDrinks" title="Top pick for Cold Drinks" />
            <CategoryProducts categoryName="Biscuits" title="Top pick for Biscuits"/>
            <CategoryProducts categoryName="Munchies" title="Top pick for Munchies"/>
        </div>
    );
}

export default Home;
