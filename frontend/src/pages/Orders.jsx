import MobileHeader from '../components/header/MobileHeader';

function Orders() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <MobileHeader title="Orders" />
            <div className="p-4 md:p-8">
                <h1 className="mb-4 text-2xl font-bold">My Orders</h1>
                <p>No orders yet.</p>
            </div>
        </div>
    );
}

export default Orders;
